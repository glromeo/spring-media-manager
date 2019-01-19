package org.codebite.springmediamanager.data.tmdb;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException.NotFound;
import org.springframework.web.client.HttpClientErrorException.TooManyRequests;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.lang.reflect.Array;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

import static java.lang.Long.parseLong;
import static java.lang.System.currentTimeMillis;
import static java.util.Optional.ofNullable;
import static org.springframework.http.HttpMethod.GET;

@Service
@Slf4j
public class ApiClient {

    public static final String BASE_URL = "https://api.themoviedb.org/3";

    public static final String API_KEY = "150dc7265c37ec9e671958360d92dcf6";
    public static final String READ_ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTBkYzcyNjVjMzdlYzllNjcxOTU4MzYwZDkyZGNmNiIsInN1YiI6IjUwNjhkMWFlMTljMjk1NjM2YTAwMGMxNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IOqvjPGd9cNMHU2Fu-txw7VMPbbh9AFsGF-Xg-0HEew";

    private static final long MAX_SLEEP_TIME_MILLIS = 10_000L;

    @Autowired
    private RestTemplate restTemplate;

    private Semaphore semaphore = new Semaphore(30, true);
    private ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    @Autowired
    private ObjectMapper objectMapper;

    public <T> List<T> list(String url, Class<T> type, Object... urlVars) {
        String json = get(url, String.class, urlVars);
        return objectMapper.convertValue(json, new TypeReference<List<T>>() {
        });
    }

    public <T> T get(String url, Class<T> type, Object... urlVars) {

        final String finalUrl = BASE_URL + url + (url.indexOf('?') > 0 ? '&' : '?') + "api_key={api_key}";
        final Object[] finalUrlVars = appendUrlVars(urlVars, API_KEY);

        int attempt = 1;
        while (true) try {

            if (log.isDebugEnabled()) {
                log.debug("acquiring semaphore permit.... available: {}", semaphore.availablePermits());
            }
            semaphore.acquire();

            try {
                ResponseEntity<T> exchange = restTemplate.exchange(finalUrl, GET, null, type, finalUrlVars);
                handleRateLimit(currentTimeMillis(), exchange.getHeaders());
                return exchange.getBody();

            } catch (NotFound e) {
                log.warn("{}: {} {}", e.getMessage(), finalUrl, finalUrlVars);
                handleRateLimit(currentTimeMillis(), Objects.requireNonNull(e.getResponseHeaders()));
                return null;
            } catch (TooManyRequests e) {
                log.warn("{}: {} {}", e.getMessage(), finalUrl, finalUrlVars);
                handleRateLimit(currentTimeMillis(), Objects.requireNonNull(e.getResponseHeaders()));
            } catch (Exception e) {
                log.warn("{}: {} {}", e.getMessage(), finalUrl, finalUrlVars);
                scheduler.schedule(() -> semaphore.release(), MAX_SLEEP_TIME_MILLIS, TimeUnit.MILLISECONDS);
            }

            if (attempt++ < 3) {
                log.info("retrying GET: {} with {}", finalUrl, finalUrlVars);
            } else {
                log.error("failed more than 3 attempts to GET: {} with {}", finalUrl, finalUrlVars);
                return null;
            }

        } catch (InterruptedException e) {
            log.warn("interrupted invoking GET: {} with {}", finalUrl, finalUrlVars);
            return null;
        }
    }

    private static final boolean ETAG = false;

    private void handleRateLimit(long requestTimeMills, HttpHeaders headers) {

        int limit = ofNullable(headers.getFirst("X-RateLimit-Limit")).map(Integer::parseInt).orElse(-1);
        int remaining = ofNullable(headers.getFirst("X-RateLimit-Remaining")).map(Integer::parseInt).orElse(-1);
        long reset = ofNullable(headers.getFirst("X-RateLimit-Reset")).map(s -> 1000 * parseLong(s)).orElse(-1L);

        if (ETAG) {
            String eTag = ofNullable(headers.getFirst("ETag")).orElse("");
            log.debug("themoviedb.org - etag: {}, limit: {}, remaining: {}, reset: {}", eTag, limit, remaining, reset);
        }

        if (remaining < semaphore.availablePermits()) {
            semaphore.drainPermits();
            semaphore.release(remaining);
        }

        long sleep = reset > 0 ? reset - requestTimeMills : MAX_SLEEP_TIME_MILLIS;
        scheduler.schedule(() -> semaphore.release(), sleep, TimeUnit.MILLISECONDS);
    }

    @SuppressWarnings("unchecked")
    private <T> T[] appendUrlVars(T[] source, T... toAppend) {
        if (source != null && source.length > 0) {
            if (toAppend != null && toAppend.length > 0) {
                Class<T> componentType = (Class<T>) source.getClass().getComponentType();
                T[] concat = (T[]) Array.newInstance(componentType, source.length + toAppend.length);
                System.arraycopy(source, 0, concat, 0, source.length);
                int c = source.length;
                for (T value : toAppend) {
                    concat[c++] = value;
                }
                return concat;
            } else {
                return source;
            }
        } else {
            if (toAppend != null && toAppend.length > 0) {
                return toAppend;
            } else {
                return source;
            }
        }
    }

    Configuration configuration;

    @PostConstruct
    public void configure() {
        configuration = get("/configuration", Configuration.class);
    }

    public byte[] image(String size, String path) {
        String imageUrl = configuration.images.baseUrl + size + path;
        int attempt = 1;
        while (true) try {
            ResponseEntity<byte[]> exchange = restTemplate.exchange(imageUrl, GET, null, byte[].class);
            return exchange.getBody();
        } catch (Exception e) {
            if (attempt++ < 3) {
                log.info("retrying to get image: {}", imageUrl);
            } else {
                log.error("failed more than 3 attempts to get image: {}", imageUrl);
                return null;
            }
        }
    }
}
