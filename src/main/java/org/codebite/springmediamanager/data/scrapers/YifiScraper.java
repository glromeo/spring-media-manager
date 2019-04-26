package org.codebite.springmediamanager.data.scrapers;

import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriUtils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class YifiScraper {

    public String[] searchDownloads(String query) throws IOException {

        String encodedTitle = UriUtils.encodePath(query, "UTF-8");
        Document doc = Jsoup.connect("http://www.yify-movies.net/search/"+encodedTitle+"/").get();
        log.info(doc.title());
        Elements downloads = doc.select("a[title]");
        List<String> urls = new ArrayList<>();
        for (Element download : downloads) {
            Node childNode = download.childNodes().get(0);
            if (childNode instanceof TextNode && ((TextNode) childNode).getWholeText().equals("Download")) {
                String href = download.absUrl("href");
                log.info(download.attr("title") +": "+ href);
                urls.add(href);
            }
        }
        return urls.toArray(new String[0]);
    }

    public String scrapeMagnet(String url) throws IOException {
        Document doc = Jsoup.connect(url).get();
        log.info(doc.title());
        Elements downloads = doc.select("a[href]");
        for (Element download : downloads) {
            String href = download.attr("href");
            if (href.startsWith("magnet:")) {
                log.info(download.attr("title") +": "+ href);
                return href;
            }
        }
        return null;
    }

    public static void main(String[] args) throws IOException {
        YifiScraper yifi = new YifiScraper();
        String[] urls = yifi.searchDownloads("Rain Man");
        for (String url : urls) {
            System.out.println(yifi.scrapeMagnet(url));
        }
    }
}
