package org.codebite.springmediamanager.media;

import bt.Bt;
import bt.data.Storage;
import bt.data.file.FileSystemStorage;
import bt.net.PeerId;
import bt.runtime.BtClient;
import bt.runtime.BtRuntime;
import bt.torrent.TorrentSessionState;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.nio.file.Paths;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

import static java.lang.String.format;
import static java.util.Optional.ofNullable;

@Service
@Slf4j
public class DownloadService {

    @Value("${download.path}")
    private String downloadPath;

    private Storage storage;

    private BtRuntime runtime;

    @PostConstruct
    private void setUp() {
        storage = new FileSystemStorage(Paths.get(downloadPath));
        runtime = BtRuntime.builder().build();
    }

    private Map<String, BtClient> downloads = new LinkedHashMap<>();

    @Autowired
    private SimpMessagingTemplate simp;

    public void downloadTorrent(String magnetUri, boolean keepSeeding) {

        final DownloadState downloadState = new DownloadState();

        BtClient client = downloads.computeIfAbsent(magnetUri, uri -> Bt.client(runtime)
                .magnet(magnetUri)
                .storage(storage)
                .afterTorrentFetched(t -> {
                    downloadState.torrentName = t.getName();
                    downloadState.torrentSize = t.getSize();
                    log.info("torrent: {}, size: {}", downloadState.torrentName, downloadState.torrentSize);
                    notifyDownloadState(downloadState);
                })
                .build()
        );

        if (!client.isStarted()) {
            CompletableFuture<?> done = client.startAsync(sessionState -> {
                notifySessionState(downloadState, sessionState);
                downloadState.downloaded = sessionState.getDownloaded();
                downloadState.uploaded = sessionState.getUploaded();
                if (!keepSeeding && sessionState.getPiecesRemaining() == 0) {
                    client.stop();
                }
            }, 1000);
            done.thenAccept(o -> downloads.remove(magnetUri));
        }
    }

    public void stopTorrent(String magnetUri) {
        ofNullable(downloads.get(magnetUri)).filter(BtClient::isStarted).ifPresent(BtClient::stop);
    }

    public void deleteTorrent(String magnetUri) {
        stopTorrent(magnetUri);
        downloads.remove(magnetUri);
    }

    public static class DownloadState {

        @JsonProperty
        public final long startTime = System.currentTimeMillis();
        @JsonProperty
        public long downloaded;
        @JsonProperty
        public long uploaded;
        @JsonProperty
        public String torrentName;
        @JsonProperty
        public long torrentSize;
    }

    private void notifyDownloadState(DownloadState download) {
        simp.convertAndSend("/topic/download", download);
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

    private void notifySessionState(DownloadState download, TorrentSessionState session) {

        simp.convertAndSend("/topic/download", SessionState.builder()
                .elapsedTime(elapsedTime(download))
                .remainingTime(remainingTime(download, session))
                .downRate(new Rate(session.getDownloaded() - download.downloaded))
                .upRate(new Rate(session.getUploaded() - download.uploaded))
                .peers(connectedPeers(session))
                .percentageComplete(percentageComplete(session))
                .percentageRequired(percentageRequired(session))
                .completedPieces(session.getPiecesComplete())
                .remainingPieces(session.getPiecesRemaining())
                .build());
    }

    private String elapsedTime(DownloadState download) {
        Duration elapsedTime = Duration.ofMillis(System.currentTimeMillis() - download.startTime);
        return formatDuration(elapsedTime);
    }

    private String remainingTime(DownloadState download, TorrentSessionState session) {
        int piecesRemaining = session.getPiecesRemaining();
        if (piecesRemaining == 0) {
            return "0";
        }
        long downloaded = session.getDownloaded() - download.downloaded;
        if (downloaded == 0) {
            return INFINITY_SYMBOL;
        }
        int piecesNotSkipped = session.getPiecesNotSkipped();
        if (piecesNotSkipped > 0) {
            long remainingBytes = download.torrentSize * piecesRemaining / piecesNotSkipped;
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
                .peerId(peer.getPeerId().map(PeerId::toString).orElse("Peer@" + peer.hashCode()))
                .address(peer.getInetAddress().toString())
                .inetSocketAddress(peer.getInetSocketAddress().toString())
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
