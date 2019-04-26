package org.codebite.springmediamanager.media;

import com.github.wtekiela.opensub4j.api.OpenSubtitlesClient;
import com.github.wtekiela.opensub4j.impl.OpenSubtitlesClientImpl;
import com.github.wtekiela.opensub4j.response.ServerInfo;
import com.github.wtekiela.opensub4j.response.SubtitleInfo;
import fr.noop.subtitle.model.SubtitleParsingException;
import fr.noop.subtitle.srt.SrtObject;
import fr.noop.subtitle.srt.SrtParser;
import fr.noop.subtitle.vtt.VttWriter;
import org.apache.xmlrpc.XmlRpcException;
import org.codebite.springmediamanager.data.Movie;
import org.codebite.springmediamanager.data.mongodb.TracksRepository;
import org.codebite.springmediamanager.data.tmdb.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;
import java.util.zip.GZIPInputStream;

import static java.nio.charset.StandardCharsets.UTF_8;

/**
 * https://github.com/wtekiela/opensub4j
 */

@Service
public class TracksService {

    @Autowired
    private TracksRepository tracksRepository;

    private OpenSubtitlesClient openSubtitlesClient;

    @PostConstruct
    private void login() throws MalformedURLException, XmlRpcException {
        URL serverUrl = new URL("https", "api.opensubtitles.org", 443, "/xml-rpc");
        openSubtitlesClient = new OpenSubtitlesClientImpl(serverUrl);
        openSubtitlesClient.login("glromeo", "lilith", "en", "TemporaryUserAgent");
    }

    @PreDestroy
    private void logout() throws XmlRpcException {
        openSubtitlesClient.logout();
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
        List<SubtitleInfo> subtitles = openSubtitlesClient.searchSubtitles(lang, imdbId);
        return subtitles;
    }

    RestTemplate restTemplate;

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
