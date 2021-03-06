package org.codebite.springmediamanager.torrent;

import bt.Bt;
import bt.data.Storage;
import bt.data.file.FileSystemStorage;
import bt.metainfo.Torrent;
import bt.runtime.BtClient;
import bt.runtime.BtRuntime;
import bt.torrent.TorrentSessionState;
import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.media.DownloadService;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import static java.util.Objects.requireNonNull;

@RunWith(SpringRunner.class)
@SpringBootTest
@Slf4j
public class BtTest extends Assert {

    private static final String WHITESPACES = "\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020";

    private boolean shouldSeedAfterDownloaded = false;

    private BtRuntime runtime;
    private Storage storage;

    @Before
    public void setup() throws MalformedURLException {
        storage = new FileSystemStorage(Paths.get("./target"));
        runtime = BtRuntime.builder().build();
    }

    @Test
    public void testAllFilesInTorrent() throws IOException, URISyntaxException {
        String basedir = "torrent";
        walkTorrentFiles(basedir);
    }

    private void walkTorrentFiles(String basedir) throws URISyntaxException, IOException {

        URL basedirUrl = Thread.currentThread().getContextClassLoader().getResource(basedir);
        Path basedirPath = new File(requireNonNull(basedirUrl).toURI()).toPath();

        List<CompletableFuture<?>> completed = new ArrayList<>();

        Files.walkFileTree(basedirPath, new SimpleFileVisitor<Path>() {

            private Torrent torrent;

            private volatile long started;
            private volatile long downloaded;
            private volatile long uploaded;

            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attr) throws MalformedURLException {
                if (attr.isRegularFile()) {
                    URL torrentUrl = file.toFile().toURI().toURL();
                    log.info("starting torrent: {}", torrentUrl);
                    BtClient client = Bt.client(runtime)
                            .torrent(torrentUrl)
                            .storage(storage)
                            .afterTorrentFetched(t -> {
                                log.info("torrent: {}, size: {}", t.getName(), t.getSize());
                                this.torrent = t;
                            })
                            .build();

                    started = System.currentTimeMillis();

                    completed.add(client.startAsync(state -> {
                        this.print(state);
                        if (!shouldSeedAfterDownloaded && state.getPiecesRemaining() == 0) {
                            client.stop();
                        }
                    }, 1000));
                }
                return FileVisitResult.TERMINATE;
            }

            private void print(TorrentSessionState sessionState) {
                long downloaded = sessionState.getDownloaded();
                long uploaded = sessionState.getUploaded();
                String elapsedTime = getElapsedTime();
                String remainingTime = getRemainingTime(downloaded - this.downloaded,
                        sessionState.getPiecesRemaining(), sessionState.getPiecesNotSkipped());
                log.info(String.format("Elapsed time: %s\t\tRemaining time: %s", elapsedTime, remainingTime));

                DownloadService.Rate downRate = new DownloadService.Rate(downloaded - this.downloaded);
                DownloadService.Rate upRate = new DownloadService.Rate(uploaded - this.uploaded);
                int peerCount = sessionState.getConnectedPeers().size();
                log.info(String.format("Peers: %2d\t\tDown: %4.1f %s/s\t\tUp: %4.1f %s/s\t\t", peerCount, downRate.quantity, downRate.measureUnit,
                        upRate.quantity, upRate.measureUnit));

                int completed = sessionState.getPiecesComplete();
                double completePercents = getCompletePercentage(sessionState.getPiecesTotal(), completed);
                double requiredPercents = getTargetPercentage(sessionState.getPiecesTotal(), completed, sessionState.getPiecesRemaining());
                log.info("complete: {}%, required: {}%", completePercents, requiredPercents);

                boolean complete = (sessionState.getPiecesRemaining() == 0);
                if (complete) {
                    log.info("Download is complete. Press Ctrl-C to stop seeding and exit.");
                }
            }

            private String getElapsedTime() {
                Duration elapsed = Duration.ofMillis(System.currentTimeMillis() - started);
                return DownloadService.formatDuration(elapsed);
            }

            private String getRemainingTime(long downloaded, int piecesRemaining, int piecesTotal) {
                String remainingStr;
                if (piecesRemaining == 0) {
                    remainingStr = "-" + WHITESPACES;
                } else if (downloaded == 0) {
                    remainingStr = "\u221E" + WHITESPACES; // infinity
                } else {
                    long size = torrent.getSize();
                    double remaining = piecesRemaining / ((double) piecesTotal);
                    long remainingBytes = (long) (size * remaining);
                    Duration remainingTime = Duration.ofSeconds(remainingBytes / downloaded);
                    // overwrite trailing chars with whitespaces if there are any
                    remainingStr = DownloadService.formatDuration(remainingTime) + WHITESPACES;
                }
                return remainingStr;
            }

            private double getCompletePercentage(int total, int completed) {
                return completed / ((double) total) * 100;
            }

            private double getTargetPercentage(int total, int completed, int remaining) {
                return (completed + remaining) / ((double) total) * 100;
            }

        });

        CompletableFuture.allOf(completed.toArray(new CompletableFuture[0])).join();
    }

    @Test
    @Ignore
    public void testClients() throws MalformedURLException {

        URL url1 = new URL("");
        URL url2 = new URL("");

        BtClient client1 = Bt.client(runtime).storage(storage).torrent(url1).build();
        BtClient client2 = Bt.client(runtime).storage(storage).torrent(url2).build();

        CompletableFuture.allOf(client1.startAsync(state -> {
            if (!shouldSeedAfterDownloaded && state.getPiecesRemaining() == 0) {
                client1.stop();
            }
        }, 1000), client2.startAsync(state -> {
            if (!shouldSeedAfterDownloaded && state.getPiecesRemaining() == 0) {
                client2.stop();
            }
        }, 1000)).join();
    }

}
