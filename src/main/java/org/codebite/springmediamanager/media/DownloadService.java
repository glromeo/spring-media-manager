package org.codebite.springmediamanager.media;

import bt.Bt;
import bt.data.Storage;
import bt.data.file.FileSystemStorage;
import bt.dht.DHTConfig;
import bt.dht.DHTModule;
import bt.event.*;
import bt.metainfo.Torrent;
import bt.net.PeerId;
import bt.runtime.BtClient;
import bt.runtime.BtRuntime;
import bt.runtime.Config;
import bt.torrent.TorrentSessionState;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.data.bt.PeerStats;
import org.codebite.springmediamanager.data.mongodb.TorrentConfigMapper;
import org.codebite.springmediamanager.data.mongodb.TorrentConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.function.Function;

import static java.lang.String.format;
import static java.util.Optional.ofNullable;
import static org.codebite.springmediamanager.media.DownloadService.TorrentFile.toTorrentFileArray;

@Service
@Slf4j
public class DownloadService {

    private Storage storage;
    private BtRuntime runtime;
    private PeerStats peerStats;

    @PostConstruct
    private void setUp() {
        storage = createStorage();
        runtime = createRuntime();
        peerStats = createPeerStats();
    }

    @Value("${download.path}")
    private String downloadPath;

    private FileSystemStorage createStorage() {
        return new FileSystemStorage(Paths.get(downloadPath));
    }

    @Autowired
    TorrentConfigRepository configRepository;

    private BtRuntime createRuntime() {
        return BtRuntime.builder(createConfig())
                .autoLoadModules()
                .module(new DHTModule(new DHTConfig() {
                    @Override
                    public boolean shouldUseRouterBootstrap() {
                        return true;
                    }
                }))
                .build();
    }

    private Config createConfig() {
        return ofNullable(configRepository.findTopByOrderByCreatedDesc())
                .map(TorrentConfigMapper::toConfig)
                .orElseGet(() -> {
                    Config config = new Config();
                    configRepository.save(TorrentConfigMapper.toTorrentConfig(config));
                    return config;
                });
    }

    private PeerStats createPeerStats() {
        PeerStats peerStats = new PeerStats() {
            @Override
            public void onPeerDiscovered(PeerDiscoveredEvent event) {
                super.onPeerDiscovered(event);
                notifyTorrentEvent(event);
            }

            @Override
            public void onPeerConnected(PeerConnectedEvent event) {
                super.onPeerConnected(event);
                notifyTorrentEvent(event);
            }

            @Override
            public void onPeerDisconnected(PeerDisconnectedEvent event) {
                super.onPeerDisconnected(event);
                notifyTorrentEvent(event);
            }

            @Override
            public void onPeerBitfieldUpdated(PeerBitfieldUpdatedEvent event) {
                super.onPeerBitfieldUpdated(event);
                notifyTorrentEvent(event);
            }
        };
        runtime.getEventSource()
                .onPeerDiscovered(peerStats::onPeerDiscovered)
                .onPeerConnected(peerStats::onPeerConnected)
                .onPeerDisconnected(peerStats::onPeerDisconnected)
                .onPeerBitfieldUpdated(peerStats::onPeerBitfieldUpdated);
        return peerStats;
    }

    private Map<String, TransferState> downloads = new LinkedHashMap<>();

    @Data
    public static class TransferState {
        public final long startTime = System.currentTimeMillis();
        public String magnetUri;
        public boolean keepSeeding;
        public BtClient client;
        public long downloaded;
        public long uploaded;
        public Torrent torrent;
        public PeerStats stats;
        public CompletableFuture<?> done;
    }

    /**
     * @param magnetUri
     * @param keepSeeding
     * @return
     */
    public CompletableFuture<?> downloadTorrent(String magnetUri, boolean keepSeeding) {
        TransferState transfer = downloads.computeIfAbsent(magnetUri, createTransfer(magnetUri, keepSeeding));
        startTransfer(transfer).whenComplete((o, e) -> downloads.remove(magnetUri));
        return transfer.done;
    }

    private Function<String, TransferState> createTransfer(String magnetUri, boolean keepSeeding) {
        return uri -> {
            final TransferState transfer = new TransferState();
            transfer.magnetUri = magnetUri;
            transfer.keepSeeding = keepSeeding;
            transfer.client = Bt.client(runtime)
                    .magnet(uri)
                    .storage(storage)
                    .initEagerly()
                    .afterTorrentFetched(torrent -> {
                        transfer.torrent = torrent;
                        notifyTorrentFetched(torrent);
                        log.info("fetched torrent: {}, size: {}", torrent.getName(), torrent.getSize());
                    })
                    .build();
            return transfer;
        };
    }

    private CompletableFuture<?> startTransfer(final TransferState transfer) {
        BtClient client = transfer.client;
        if (!client.isStarted()) {
            transfer.done = client.startAsync(sessionState -> {
                notifySessionState(transfer, sessionState);
                transfer.downloaded = sessionState.getDownloaded();
                transfer.uploaded = sessionState.getUploaded();
                log.info("{} downloaded: {}, uploaded: {}", transfer.torrent.getName(), transfer.downloaded, transfer.uploaded);
                if (!transfer.keepSeeding && sessionState.getPiecesRemaining() == 0) {
                    client.stop();
                }
            }, 1000);
        }
        return transfer.done;
    }

    /**
     * @param magnetUri
     */
    public void stopTorrent(String magnetUri) {
        ofNullable(downloads.get(magnetUri))
                .map(TransferState::getClient)
                .filter(BtClient::isStarted)
                .ifPresent(BtClient::stop);
    }

    /**
     * @param magnetUri
     */
    public void deleteTorrent(String magnetUri) {
        stopTorrent(magnetUri);
        downloads.remove(magnetUri);
    }

    @Autowired
    private SimpMessagingTemplate simp;

    @Builder
    public static class TorrentFetched {
        @JsonProperty
        public final String type = "TORRENT_FETCHED";
        @JsonProperty
        public String torrentId;
        @JsonProperty
        public String name;
        @JsonProperty
        public long size;
        @JsonProperty
        public TorrentFile[] files;
        @JsonProperty
        public boolean isPrivate;
        @JsonProperty
        public String createdBy;
        @JsonProperty
        public Instant creationDate;
    }

    public static class TorrentFile {
        @JsonProperty
        public String path;
        @JsonProperty
        public long size;

        public TorrentFile(bt.metainfo.TorrentFile torrentFile) {
            this.path = String.join("/", torrentFile.getPathElements());
            this.size = torrentFile.getSize();
        }

        public static TorrentFile[] toTorrentFileArray(List<bt.metainfo.TorrentFile> files) {
            return files.stream().map(TorrentFile::new).toArray(TorrentFile[]::new);
        }
    }

    private void notifyTorrentEvent(TorrentEvent event) {
        simp.convertAndSend("/topic/download", event);
    }

    private void notifyTorrentFetched(Torrent torrent) {
        simp.convertAndSend("/topic/download", TorrentFetched.builder()
                .torrentId(torrent.getTorrentId().toString())
                .name(torrent.getName())
                .size(torrent.getSize())
                .isPrivate(torrent.isPrivate())
                .files(toTorrentFileArray(torrent.getFiles()))
                .createdBy(torrent.getCreatedBy().orElse(null))
                .creationDate(torrent.getCreationDate().orElse(null))
                .build());
    }

    @Builder
    public static class SessionState {
        @JsonProperty
        public String elapsedTime;
        @JsonProperty
        public String remainingTime;
        @JsonProperty
        public Rate downRate;
        @JsonProperty
        public Rate upRate;
        @JsonProperty
        public ConnectedPeer[] peers;
        @JsonProperty
        public double percentageComplete;
        @JsonProperty
        public double percentageRequired;
        @JsonProperty
        public int completedPieces;
        @JsonProperty
        public int remainingPieces;
    }

    private void notifySessionState(TransferState transferState, TorrentSessionState sessionState) {

        simp.convertAndSend("/topic/download", SessionState.builder()
                .elapsedTime(elapsedTime(transferState))
                .remainingTime(remainingTime(transferState, sessionState))
                .downRate(new Rate(sessionState.getDownloaded() - transferState.downloaded))
                .upRate(new Rate(sessionState.getUploaded() - transferState.uploaded))
                .peers(connectedPeers(sessionState))
                .percentageComplete(percentageComplete(sessionState))
                .percentageRequired(percentageRequired(sessionState))
                .completedPieces(sessionState.getPiecesComplete())
                .remainingPieces(sessionState.getPiecesRemaining())
                .build());
    }

    private String elapsedTime(TransferState transferState) {
        Duration elapsedTime = Duration.ofMillis(System.currentTimeMillis() - transferState.startTime);
        return formatDuration(elapsedTime);
    }

    private String remainingTime(TransferState transferState, TorrentSessionState sessionState) {
        int piecesRemaining = sessionState.getPiecesRemaining();
        if (piecesRemaining == 0) {
            return "0";
        }
        long downloaded = sessionState.getDownloaded() - transferState.downloaded;
        if (downloaded == 0) {
            return INFINITY_SYMBOL;
        }
        int piecesNotSkipped = sessionState.getPiecesNotSkipped();
        if (piecesNotSkipped > 0) {
            long remainingBytes = transferState.torrent.getSize() * piecesRemaining / piecesNotSkipped;
            Duration remainingTime = Duration.ofSeconds(remainingBytes / downloaded);
            return formatDuration(remainingTime);
        }
        return INFINITY_SYMBOL;
    }

    public static class Rate {

        @JsonProperty
        public long bytes;

        @JsonProperty
        public double quantity;

        @JsonProperty
        public String measureUnit;

        public Rate(long delta) {
            if (delta < 0) {
                // TODO: this is a workaround for some nasty bug in the session state,
                //       due to which the delta is sometimes (very seldom) negative
                log.warn("Negative delta: " + delta + "; will not re-calculate rate");
                delta = 0;
                quantity = 0;
                measureUnit = "B";
            } else if (delta < 0x400) {
                quantity = delta;
                measureUnit = "B";
            } else if (delta < 0x100000) {
                quantity = (double) delta / 0x400;
                measureUnit = "KB";
            } else {
                quantity = (double) delta / 0x100000;
                measureUnit = "MB";
            }
            bytes = delta;
        }
    }

    @Builder
    public static class ConnectedPeer {
        @JsonProperty
        public String peerId;
        @JsonProperty
        public String address;
        @JsonProperty
        public String inetSocketAddress;
        @JsonProperty
        public int port;
    }

    private ConnectedPeer[] connectedPeers(TorrentSessionState session) {
        return session.getConnectedPeers().stream().map(peer -> ConnectedPeer.builder()
                .peerId(peer.getPeerId().map(PeerId::toString).orElse("#" + peer.hashCode()))
                .address(peer.getInetAddress().toString().substring(1))
                .inetSocketAddress(peer.getInetSocketAddress().toString().substring(1))
                .port(peer.getPort())
                .build()).toArray(ConnectedPeer[]::new);
    }

    private double percentageComplete(TorrentSessionState session) {
        double total = session.getPiecesTotal();
        if (total == 0) {
            return Double.NaN;
        } else {
            double completed = session.getPiecesComplete();
            return 100d * completed / total;
        }
    }

    private double percentageRequired(TorrentSessionState session) {
        double total = session.getPiecesTotal();
        if (total == 0) {
            return Double.NaN;
        } else {
            double completed = session.getPiecesComplete();
            double remaining = session.getPiecesRemaining();
            return 100d * (completed + remaining) / total;
        }
    }

    public static String formatDuration(Duration duration) {
        long seconds = duration.getSeconds();
        if (seconds < 0) {
            seconds = -seconds;
            return format("-%d:%02d:%02d", seconds / 3600, (seconds % 3600) / 60, seconds % 60);
        } else {
            return format("%d:%02d:%02d", seconds / 3600, (seconds % 3600) / 60, seconds % 60);
        }
    }

    private static final String INFINITY_SYMBOL = "\u221E";

}
