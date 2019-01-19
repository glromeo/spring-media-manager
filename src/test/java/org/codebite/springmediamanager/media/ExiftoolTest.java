package org.codebite.springmediamanager.media;

import lombok.extern.slf4j.Slf4j;
import org.junit.Test;

import java.io.*;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Slf4j
public class ExiftoolTest {

    @Test
    public void exec() throws IOException, InterruptedException {
        Process exec = Runtime.getRuntime().exec(new String[]{"cmd.exe", "/c", "perl", ".\\media\\media", "\"V:\\55 Steps (2018)\\55 Steps (2018) h264-720p AAC-2ch.mp4\""});
        exec.waitFor();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(exec.getInputStream()))) {

            Map<String, String> exifMap = reader.lines().collect(
                    HashMap::new,
                    (map, line) -> {
                        String key = line.substring(0, 32).trim();
                        String value = line.substring(33).trim();
                        map.put(key, value);
                    },
                    HashMap::putAll
            );
            exifMap.forEach((k, v) -> System.out.println(String.format("%s: %s", k, v)));
        }
    }

    @Test
    public void execute() throws IOException, InterruptedException {

        execute(Stream.of(
                "perl exiftool/exiftool -stay_open true -@ -",
                "-ver",
                "-execute",
                (new File(new File(new File("V:\\"),
                        "55 Steps (2018)"),
                        "55 Steps (2018) h264-720p AAC-2ch.mp4").toPath().toAbsolutePath().toString()),
                "-execute",
                "-stay_open",
                "false",
                "-execute",
                "exit"
        ));
    }

    private void execute(Stream<String> commands) throws IOException {

        Runtime runtime = Runtime.getRuntime();
        Process process = runtime.exec(new String[]{"cmd.exe"}, null);

        ExecutorService esvc = Executors.newCachedThreadPool();

        esvc.submit(() -> {
            try (BufferedReader stdout = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                stdout.lines().forEach(System.out::println);
            } catch (IOException ex) {
                System.err.println(ex.getMessage());
                ex.printStackTrace();
            }
        });

        esvc.submit(() -> {
            try (BufferedReader stderr = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                stderr.lines().forEach(System.err::println);
            } catch (IOException ex) {
                System.err.println(ex.getMessage());
                ex.printStackTrace();
            }
        });

        esvc.submit(() -> {
            try (PrintWriter stdin = new PrintWriter(new OutputStreamWriter(process.getOutputStream()))) {
                commands.forEach(x -> {
                    System.out.println(">>> "+x);
                    stdin.println(x);
                });
            }
        });

        try {
            System.out.println("Waiting for process exit ..");
            if (process.waitFor(60, TimeUnit.SECONDS)) {
                System.out.println("Process exited with: " + process.exitValue());
            } else {
                System.out.println("Process has not exited .. destroying");
                process.destroy();
                if (process.waitFor(5, TimeUnit.SECONDS)) {
                    System.out.println("Destruction .. exit code: " + process.exitValue());
                } else {
                    System.out.println("Attempting forcible destruction ..");
                    process.destroyForcibly();
                    if (process.waitFor(5, TimeUnit.SECONDS)) {
                        System.out.println("Process forcibly destroyed .. exit code: " + process.exitValue());
                    }
                }
            }
        } catch (InterruptedException e) {
            System.err.println(e.getMessage());
            e.printStackTrace();
        }

        esvc.shutdown();
    }

}
