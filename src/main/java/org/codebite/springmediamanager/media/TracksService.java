package org.codebite.springmediamanager.media;

import com.github.wtekiela.opensub4j.api.OpenSubtitlesClient;
import com.github.wtekiela.opensub4j.impl.OpenSubtitlesClientImpl;
import com.github.wtekiela.opensub4j.response.ServerInfo;
import com.github.wtekiela.opensub4j.response.SubtitleInfo;
import fr.noop.subtitle.model.SubtitleParsingException;
import fr.noop.subtitle.srt.SrtObject;
import fr.noop.subtitle.srt.SrtParser;
import fr.noop.subtitle.vtt.VttWriter;
import lombok.extern.slf4j.Slf4j;
import org.apache.xmlrpc.XmlRpcException;
import org.codebite.springmediamanager.data.Movie;
import org.codebite.springmediamanager.data.tmdb.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.*;
import java.lang.reflect.Proxy;
import java.net.URL;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.zip.GZIPInputStream;

import static java.nio.charset.StandardCharsets.UTF_8;

/**
 * https://github.com/wtekiela/opensub4j
 */

@Service
@Slf4j
public class TracksService {

    private OpenSubtitlesClient openSubtitlesClient;

    @Value("${connect.retry.delay:15}")
    private int connectRetryDelay = 15;

    public TracksService() {
        connect();
    }

    ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    private void connect() {
        try {
            URL serverUrl = new URL("https", "api.opensubtitles.org", 443, "/xml-rpc");
            log.info("connecting to {}", serverUrl.toExternalForm());
            this.openSubtitlesClient = new OpenSubtitlesClientImpl(serverUrl);
            log.info("connected");
        } catch (Exception e) {
            log.warn("failed to connect, will retry in {} minutes", connectRetryDelay);
            this.openSubtitlesClient = (OpenSubtitlesClient) Proxy.newProxyInstance(
                OpenSubtitlesClient.class.getClassLoader(),
                new Class[]{OpenSubtitlesClient.class},
                (proxy, method, args) -> {
                    if (method.getName().equals("searchSubtitles")) {
                        return Collections.emptyList();
                    }
                    if (method.getName().equals("isLoggedIn")) {
                        return false;
                    }
                    return null;
                });
            scheduler.schedule(this::connect, connectRetryDelay, TimeUnit.MINUTES);
        }
    }

    @PostConstruct
    private void login() throws XmlRpcException {
        openSubtitlesClient.login("glromeo", "lilith", "en", "TemporaryUserAgent");
    }

    @PreDestroy
    private void logout() throws XmlRpcException {
        openSubtitlesClient.logout();
    }

    private void ensureLoggedIn() throws XmlRpcException {
        if (!openSubtitlesClient.isLoggedIn()) {
            login();
        }
    }

    public ServerInfo openSubtitlesInfo() throws XmlRpcException {
        return openSubtitlesClient.serverInfo();
    }

    @Autowired
    MovieService movieService;

    public List<SubtitleInfo> findSubtitles(Movie movie) throws XmlRpcException {
        return findSubtitles(movie, "eng");
    }


    public List<SubtitleInfo> findSubtitles(Movie movie, String lang) throws XmlRpcException {
        String imdbId = movie.imdbId.substring(2);
        ensureLoggedIn();
        List<SubtitleInfo> subtitles = openSubtitlesClient.searchSubtitles(lang, imdbId);
        return subtitles;
    }

    private RestTemplate restTemplate;

    @PostConstruct
    public void initRestTemplate() {
        restTemplate = new RestTemplate();
    }

    public String get(SubtitleInfo subtitleInfo) throws IOException, SubtitleParsingException {

        String downloadLink = subtitleInfo.getDownloadLink();
        ResponseEntity<byte[]> track = restTemplate.getForEntity(downloadLink, byte[].class);

        byte[] body = track.getBody();

        try (GZIPInputStream gzis = new GZIPInputStream(new ByteArrayInputStream(body))) {

            String srt = toString(gzis);

            SrtParser parser = new SrtParser(UTF_8.name());
            SrtObject srtObj = parser.parse(new ByteArrayInputStream(srt.getBytes()));

            VttWriter writer = new VttWriter(UTF_8.name());
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            writer.write(srtObj, outputStream);

            String vttText = new String(outputStream.toByteArray());

            return vttText;
        }
    }

    private static String toString(InputStream inputStream) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            StringBuilder builder = new StringBuilder();
            String line = reader.readLine();
            if (line != null && line.charAt(0) == '\uFEFF') {
                line = line.substring(1);
            }
            while (line != null) {
                builder.append(line.trim()).append('\n');
                line = reader.readLine();
            }
            return builder.toString();
        }
    }
}
