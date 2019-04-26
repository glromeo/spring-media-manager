package org.codebite.springmediamanager.util;

import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.Spliterator;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Consumer;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public class QueuedIterator<T> implements Iterator<T>, Consumer<T>, AutoCloseable {

    private static final ExecutorService executor = Executors.newCachedThreadPool();

    private final BlockingQueue<T> queue;

    @SuppressWarnings("unchecked")
    private T sentinel = (T) new Object();
    private T next;
    private Throwable throwable;

    public QueuedIterator() {
        this(100);
    }

    public QueuedIterator(int capacity) {
        queue = new ArrayBlockingQueue<T>(capacity);
    }

    public QueuedIterator(final Iterator<T> delegate) {
        this();
        executor.submit(() -> {
            try {
                delegate.forEachRemaining(this);
            } finally {
                accept(sentinel);
            }
        });
    }

    public QueuedIterator(Consumer<Consumer<T>> agent) {
        this();
        executor.execute(() -> {
            try {
                agent.accept(this);
            } finally {
                accept(sentinel);
            }
        });
    }

    public void accept(T t) {
        T element = t != null ? t : sentinel;
        try {
            queue.put(element);
        } catch (Exception e) {
            throw new RuntimeException("unable to queue: " + element, e);
        }
    }

    @Override
    public boolean hasNext() {
        if (next == null) {
            try {
                return (next = queue.take()) != sentinel;
            } catch (Exception e) {
                return false;
            }
        } else {
            return true;
        }
    }

    @Override
    public T next() {
        while (next == null) {
            if (!hasNext()) throw new NoSuchElementException();
        }
        T last = next;
        next = null;
        return last;
    }

    @Override
    public void close() {
        accept(sentinel);
    }

    protected Spliterator<T> spliterator() {
        return new Spliterator<T>() {
            @Override
            public boolean tryAdvance(Consumer<? super T> action) {
                if (hasNext()) {
                    action.accept(next);
                    return true;
                } else {
                    return false;
                }
            }

            @Override
            public Spliterator<T> trySplit() {
                return null;
            }

            @Override
            public long estimateSize() {
                return Long.MAX_VALUE;
            }

            @Override
            public int characteristics() {
                return ORDERED;
            }
        };
    }

    public Stream<T> stream() {
        return StreamSupport.stream(this.spliterator(), false);
    }
}