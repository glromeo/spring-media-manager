package org.codebite.springmediamanager.util;

import lombok.extern.slf4j.Slf4j;

import java.util.concurrent.Semaphore;
import java.util.function.Consumer;

@Slf4j
public abstract class FairConsumer<T> implements Consumer<T> {

    private final Semaphore semaphore;

    public FairConsumer() {
        this(10, true);
    }

    public FairConsumer(int permits, boolean fair) {
        this.semaphore = new Semaphore(permits, fair);
    }

    @Override
    public void accept(T t) {
        try {
            semaphore.acquire();
        } catch (InterruptedException e) {
            log.error("Interrupted while acquiring semaphore permit", e);
            return;
        }
        try {
            fairlyAccept(t);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            semaphore.release();
        }
    }

    protected abstract void fairlyAccept(T t) throws Exception;
}
