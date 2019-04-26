package org.codebite.springmediamanager

import org.codebite.springmediamanager.data.scrapers.CorsaroNero
import org.codebite.springmediamanager.data.scrapers.YifiScraper
import org.codebite.springmediamanager.data.yts.am.YtsClient
import org.codebite.springmediamanager.media.DownloadService
import org.codebite.springmediamanager.rest.MoviesController
import org.codebite.springmediamanager.rest.SearchController
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest
class SearchSpecification extends Specification {

    @Autowired
    private SearchController searchController

    @Autowired
    private MoviesController moviesController

    @Autowired
    private YtsClient ytsClient;
    @Autowired
    private YifiScraper yifiScraper;
    @Autowired
    private DownloadService downloadService;

    def "when context is loaded then all expected beans are created"() {
        expect: "the MoviesController is created"
        moviesController
    }

    def "search for Spider Man and download it"() {

        when:
        def search = searchController.movieSearch(
                "Spider Man",
                null,
                1,
                true,
                null,
                null,
                null
        )
        then:
        search.totalResults == 49
        search.page == 1
        search.results[0].originalTitle == "Spider-Man: Into the Spider-Verse"

        when:
        def movie = moviesController.getMovie(search.results[0].id)
        then:
        movie.id == 324857
        movie.title == "Spider-Man: Into the Spider-Verse"

        when:
        def list = ytsClient.listMovies(YtsClient.ListMoviesRequest.builder().queryTerm(movie.title).build());
        then:
        list.movies == null

        when:
        def downloads = yifiScraper.searchDownloads(movie.title);
        then:
        downloads.length == 2

        when:
        def magnet = yifiScraper.scrapeMagnet(downloads[0]);
        then:
        magnet != null

        when:
        def torrent = downloadService.downloadTorrent(magnet, false);
        torrent.get();
        then:
        true
    }

    @Autowired
    CorsaroNero corsaroNero;

    def "corsaro nero"() {
        when:
        def result = corsaroNero.searchMovie("Tre Uomini");
        then:
        result.length == 13
        when:
        def magnet = corsaroNero.getMagnet(result[0].url);
        then:
        magnet == "magnet:?xt=urn:btih:d1925591e770be391d9fc17e87fcb77098f7dd45&dn=Tre+Uomini+E+Una+Gamba+%281997%29.SD.H264.italian.Ac3-2.0.sub.ita-MIRCrew&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce"
        when:
        def torrent = downloadService.downloadTorrent(magnet, true);
        torrent.get();
        then:
        true
    }

    // fields
    // fixture methods
    // feature methods
    // helper methods
}
