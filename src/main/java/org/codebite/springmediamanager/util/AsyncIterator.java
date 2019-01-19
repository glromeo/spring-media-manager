package org.codebite.springmediamanager.util;

import java.util.Iterator;
import java.util.NoSuchElementException;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.function.Consumer;

public class AsyncIterator<T> implements Iterator<T> {

    private BlockingQueue<T> queue = new ArrayBlockingQueue<T>(100);

    @SuppressWarnings("unchecked")
    private T sentinel = (T) new Object();
    private T next;

    public AsyncIterator(final Iterator<T> delegate) {
        new Thread() {
            @Override
            public void run() {
                while (delegate.hasNext()) try {
                    queue.put(delegate.next());
                } catch (InterruptedException e) {
                    break;
                }
                try {
                    queue.put(sentinel);
                } catch (InterruptedException e) {
                    queue = null;
                }
            }
        }.start();
    }

    public AsyncIterator(Consumer<Consumer<T>> consumer) {
        new Thread(() -> {
            consumer.accept(t -> {
                try {
                    queue.put(t != null ? t : sentinel);
                } catch (InterruptedException e) {
                    queue = null;
                }
            });
        }).start();
    }

    @Override
    public boolean hasNext() {
        if (next == null) try {
            return (next = queue.take()) != sentinel;
        } catch (Exception e) {
            return false;
        }
        else {
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

}