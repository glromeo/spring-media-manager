package org.codebite.springmediamanager.media;

import org.codebite.springmediamanager.util.QueuedIterator;
import org.codebite.springmediamanager.util.Terminal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.stream.Stream;

import static java.util.Collections.singletonList;
import static org.codebite.springmediamanager.media.Metadata.parseVideoMetadata;

@Service
public class MetadataService {

    private static final String EXIFTOOL_PATH = "./exiftool/exiftool";
    private static final String EXIFTOOL_READY = "{ready}";
    private static final String EXIFTOOL_SEPARATOR = "========";

    @Autowired
    Terminal terminal;

    /**
     * TODO: maybe I can optimize for single file case running without -stay_open ?
     *
     * @param path
     * @return
     * @throws IOException
     */
    public Optional<Metadata> read(Path path) throws IOException {
        return scan(singletonList(path)).findFirst();
    }

    public Stream<Metadata> scan(Iterable<Path> paths) throws IOException {
        QueuedIterator<Metadata> iterator = new QueuedIterator<>(20);
        terminal.execute(
            stdin -> executeExiftool(paths, stdin),
            stdout -> consumeMetadata(stdout, iterator),
            System.err::println
        ).thenRun(iterator::close);
        return iterator.stream();
    }

    public void executeExiftool(Iterable<Path> paths, PrintWriter stdin) {
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

    public void consumeMetadata(BufferedReader stdout, Consumer<Metadata> consumer) throws IOException {
        String line;
        while (!EXIFTOOL_READY.equals(line = stdout.readLine())) if (line == null) {
            return;
        }
        Map<String, String> metadata = new HashMap<>(70);
        while ((line = stdout.readLine()) != null) {
            if (line.length() > 34) {
                String key = line.substring(0, 32).trim();
                String value = line.substring(34).trim();
                metadata.put(key, value);
            } else {
                if (EXIFTOOL_READY.equals(line) || line.startsWith(EXIFTOOL_SEPARATOR)) {
                    parseVideoMetadata(metadata).ifPresent(consumer);
                }
                metadata = new HashMap<>(70);
            }
        }
        parseVideoMetadata(metadata).ifPresent(consumer);
    }

}
