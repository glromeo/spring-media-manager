package org.codebite.springmediamanager.data.scrapers;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class CorsaroNero {

    @NoArgsConstructor
    public static class DownloadPage {

        @JsonProperty
        public String title;
        @JsonProperty
        public String url;

        public DownloadPage(String title, String url) {
            this.title = title;
            this.url = url;
        }
    }

    public DownloadPage[] searchMovie(String query) throws IOException {

        String encodedTitle = URLEncoder.encode(query, "UTF-8");
        Document document = Jsoup.connect("https://ilcorsaronero.pizza/argh.php?search=" + encodedTitle).get();
        log.info(document.title());
        Elements elements = document.select("a.tab[href]");
        List<DownloadPage> links = new ArrayList<>();
        for (Element element : elements) {
            String href = element.absUrl("href");
            DownloadPage downloadPage = new DownloadPage(element.text(), href);
            links.add(downloadPage);
            log.info(element.text() + ": " + href);
        }
        return links.toArray(new DownloadPage[0]);
    }

    public String getMagnet(String downloadPageUrl) throws IOException {

        Document document = Jsoup.connect(downloadPageUrl).get();
        Element element = document.selectFirst("a[title=Magnet]");
        String magnetUrl = element.attr("href");
        log.info(document.title() + ": " + magnetUrl);
        return magnetUrl;
    }
}
