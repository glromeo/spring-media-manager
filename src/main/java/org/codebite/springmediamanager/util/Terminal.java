package org.codebite.springmediamanager.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.annotation.PreDestroy;
import java.io.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static java.lang.System.getProperty;
import static java.util.concurrent.CompletableFuture.allOf;
import static java.util.concurrent.CompletableFuture.runAsync;

@Service
@Slf4j
public class Terminal {

    private final ExecutorService executor = Executors.newCachedThreadPool();

    private static final String[] TERMINAL = {
        getProperty("os.name").startsWith("Windows") ? "cmd.exe" : "bash"
    };

    public interface StdInHandler {
        void handle(PrintWriter stdin) throws Exception;
    }
    public interface StdOutHandler {
        void handle(BufferedReader stdin) throws Exception;
    }
    public interface StdErrHandler {
        void handle(BufferedReader stdin) throws Exception;
    }

    public CompletableFuture<Integer> execute(StdInHandler in, StdOutHandler out, StdErrHandler err) throws IOException {

        final Process process = Runtime.getRuntime().exec(TERMINAL, null);

        CompletableFuture<Void> stderrFuture = runAsync(() -> {
            try (BufferedReader stderr = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
                err.handle(stderr);
            } catch (Exception e) {
                log.error("Exception reading from process stderr", e);
                throw new RuntimeException(e);
            }
        }, executor);

        CompletableFuture<Void> stdoutFuture = runAsync(() -> {
            try (BufferedReader stdout = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                out.handle(stdout);
            } catch (Exception e) {
                log.error("Exception reading from process stdout", e);
                throw new RuntimeException(e);
            }
        }, executor);

        CompletableFuture<Void> stdinFuture = runAsync(() -> {
            try (PrintWriter stdin = new PrintWriter(new OutputStreamWriter(process.getOutputStream()))) {
                in.handle(stdin);
            } catch (Exception e) {
                log.error("Exception writing to process stdin", e);
                throw new RuntimeException(e);
            }
        }, executor);

        return allOf(stdinFuture, stdoutFuture, stderrFuture).handle((o, ex) -> closeProcess(process));
    }

    private int closeProcess(Process process) {
        log.info("Waiting for process exit ..");
        if (waitForProcess(process, 10)) {
            int exitValue = process.exitValue();
            if (exitValue == 0) {
                log.info("Process exited with: " + exitValue);
            } else {
                log.warn("Process exited with: " + exitValue);
            }
            return exitValue;
        } else {
            log.warn("Process has not exited .. destroying");
            process.destroy();
            if (waitForProcess(process, 5)) {
                log.info("Destruction .. exit code: " + process.exitValue());
            } else {
                log.warn("Attempting forcible destruction ..");
                process.destroyForcibly();
                if (waitForProcess(process, 5)) {
                    log.warn("Process forcibly destroyed .. exit code: " + process.exitValue());
                }
            }
        }
        return -9;
    }

    private boolean waitForProcess(Process process, int i) {
        try {
            return process.waitFor(i, TimeUnit.SECONDS);
        } catch (Exception e) {
            return false;
        }
    }

    @PreDestroy
    public void shutdown() {
        executor.shutdown();
    }
}
