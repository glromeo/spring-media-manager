package org.codebite.springmediamanager.media;

import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.data.Media;
import org.codebite.springmediamanager.data.Movie;
import org.codebite.springmediamanager.data.MovieInfo;
import org.codebite.springmediamanager.data.mongodb.BackdropRepository;
import org.codebite.springmediamanager.data.mongodb.PosterRepository;
import org.codebite.springmediamanager.data.tmdb.ImageService;
import org.codebite.springmediamanager.data.tmdb.MovieService;
import org.codebite.springmediamanager.util.AsyncIterator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.*;
import java.util.function.Consumer;

import static java.lang.System.getProperty;
import static java.util.Collections.singletonList;
import static org.codebite.springmediamanager.media.Metadata.parseVideoMetadata;

@Service
@Slf4j
public class MediaService {

    private static final String[] TERMINAL_EXEC = {
            getProperty("os.name").startsWith("Windows") ? "cmd.exe" : "bash"
    };

    private static final String EXIFTOOL_PATH = "./exiftool/exiftool";
    private static final String EXIFTOOL_READY = "{ready}";

    private final ExecutorService executor = Executors.newCachedThreadPool();

    @Autowired
    MovieService movieService;

    /**
     * @param paths
     * @return
     */
    public Iterable<Media> discover(Iterable<Path> paths) {
        return ()-> new AsyncIterator<>(consumer -> {
            try {
                scan(paths, metadata -> {
                    MovieInfo movie = movieService.findMovie(plausibleTitle(metadata));
                    if (movie != null) {
                        fetchImages(movie);
                    }
                    consumer.accept(Media.builder()
                            .path(Paths.get(metadata.directory, metadata.fileName).toString())
                            .metadata(metadata)
                            .movie(movie)
                            .build());
                });
            } catch (Exception e) {
                log.error("Exception while discovering media", e);
            }
            consumer.accept(null);
        });
    }

    private String plausibleTitle(Metadata metadata) {
        return metadata.fileName.replace('_', ' ').replace('.', ' ').replaceAll("\\W+\\([^)]*\\)\\W.*", "");
    }

    @Autowired
    PosterRepository posterRepository;

    @Autowired
    BackdropRepository backdropRepository;

    @Autowired
    ImageService imageService;

    private void fetchImages(MovieInfo movie) {
        log.info("Fetching images for: #{} {}", movie.id, movie.title);
        if (!posterRepository.existsById(movie.id)) {
            posterRepository.save(imageService.getPoster(movie));
        }
        if (!backdropRepository.existsById(movie.id)) {
            backdropRepository.save(imageService.getBackdrop(movie));
        }
    }

    /**
     * TODO: maybe I can optimize for single file case running without -stay_open ?
     *
     * @param path
     * @return
     * @throws IOException
     */
    public Optional<Metadata> read(Path path) throws IOException {
        List<Metadata> metadata = readAll(singletonList(path));
        return metadata.isEmpty() ? Optional.empty() : Optional.of(metadata.iterator().next());
    }

    public List<Metadata> readAll(Iterable<Path> paths) throws IOException {
        final List<Metadata> metadata = new ArrayList<>();
        scan(paths, metadata::add);
        return metadata;
    }

    public void scan(Iterable<Path> paths, Consumer<Metadata> consumer) throws IOException {

        final Process process = Runtime.getRuntime().exec(TERMINAL_EXEC, null);

        executor.submit(() -> {
            try (BufferedReader stderr = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                stderr.lines().forEach(log::error);
            } catch (Exception e) {
                log.error("Exception reading from process stderr", e);
            }
        });

        Future<?> futureIn = executor.submit(() -> {
            try (PrintWriter stdin = new PrintWriter(new OutputStreamWriter(process.getOutputStream()))) {
                supplyPaths(stdin, paths);
            } catch (Exception e) {
                log.error("Exception writing to process stdin", e);
            }
        });

        Future<?> futureOut = executor.submit(() -> {
            try (BufferedReader stdout = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                Semaphore semaphore = new Semaphore(10, true);
                consumeMetadata(stdout, metadata -> {
                    try {
                        semaphore.acquire();
                    } catch (InterruptedException e) {
                        log.error("Interrupted while acquiring semaphore permit", e);
                        return;
                    }
                    executor.execute(() -> {
                        try {
                            consumer.accept(metadata);
                        } catch (Exception e) {
                            log.error("Exception processing metadata", e);
                        } finally {
                            semaphore.release();
                        }
                    });
                });
            } catch (Exception e) {
                log.error("Exception reading from process stdout", e);
            }
        });

        try {
            futureIn.get();
            futureOut.get();

            log.info("Waiting for process exit ..");
            if (process.waitFor(10, TimeUnit.SECONDS)) {
                int exitValue = process.exitValue();
                if (exitValue == 0) {
                    log.info("Process exited with: " + exitValue);
                } else {
                    log.warn("Process exited with: " + exitValue);
                }
            } else {
                log.warn("Process has not exited .. destroying");
                process.destroy();
                if (process.waitFor(5, TimeUnit.SECONDS)) {
                    log.info("Destruction .. exit code: " + process.exitValue());
                } else {
                    log.warn("Attempting forcible destruction ..");
                    process.destroyForcibly();
                    if (process.waitFor(5, TimeUnit.SECONDS)) {
                        log.warn("Process forcibly destroyed .. exit code: " + process.exitValue());
                    }
                }
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

    private void supplyPaths(PrintWriter stdin, Iterable<Path> paths) {
        stdin.println("perl " + EXIFTOOL_PATH + " -stay_open true -@ -");
        stdin.println("-ver");
        stdin.println("-execute");
        for (Path path : paths) {
            stdin.println(path.toAbsolutePath());
            stdin.println("-execute");
        }
        stdin.println("-stay_open");
        stdin.println("false");
        stdin.println("-execute");
        stdin.println("exit");
    }

    void consumeMetadata(BufferedReader stdout, Consumer<Metadata> consumer) throws IOException {
        String line;
        while (!EXIFTOOL_READY.equals(line = stdout.readLine())) if (line == null) {
            return;
        }
        Map<String, String> metadata = null;
        while ((line = stdout.readLine()) != null) {
            if (metadata == null) {
                metadata = new HashMap<>(70);
            }
            if (EXIFTOOL_READY.equals(line)) {
                parseVideoMetadata(metadata).ifPresent(consumer);
                metadata = null;
            } else if (line.startsWith("========")) {
                parseVideoMetadata(metadata).ifPresent(consumer);
                metadata = null;
            } else if (line.length() > 34) {
                String key = line.substring(0, 32).trim();
                String value = line.substring(34).trim();
                metadata.put(key, value);
            }
        }
        parseVideoMetadata(metadata).ifPresent(consumer);
    }

    public void shutdown() {
        executor.shutdown();
    }
}
