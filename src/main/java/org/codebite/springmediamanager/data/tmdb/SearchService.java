package org.codebite.springmediamanager.data.tmdb;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.data.Movie;
import org.codebite.springmediamanager.data.SearchResult;
import org.codebite.springmediamanager.data.SearchResultsPage;
import org.codebite.springmediamanager.data.yts.am.YtsClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Service
@Slf4j
public class SearchService {

    @Autowired
    private ApiClient apiClient;

    public SearchResultsPage searchMovie(String query) {
        return searchMovie(query, null, null, null, null, null, null);
    }

    public SearchResultsPage searchMovie(
        String query,
        String language,
        Integer page,
        Boolean includeAdult,
        String region,
        Integer year,
        Integer primaryReleaseYear
    ) {
        StringBuilder url = new StringBuilder(256);

        List<Object> urlVars = new ArrayList<>();
        url.append("/search/movie?query={query}");
        urlVars.add(query);

        if (language != null) {
            url.append("&language={language}");
            urlVars.add(language);
        }
        if (page != null) {
            url.append("&page={page}");
            urlVars.add(page);
        }
        if (includeAdult != null) {
            url.append("&includeAdult={includeAdult}");
            urlVars.add(includeAdult);
        }
        if (region != null) {
            url.append("&region={region}");
            urlVars.add(region);
        }
        if (year != null) {
            url.append("&year={year}");
            urlVars.add(year);
        }
        if (primaryReleaseYear != null) {
            url.append("&primaryReleaseYear={primaryReleaseYear}");
            urlVars.add(primaryReleaseYear);
        }

        return apiClient.get(url.toString(), SearchResultsPage.class, urlVars.toArray());
    }

    @Autowired
    YtsClient ytsClient;

    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TorrentResult implements Serializable {
        @JsonProperty("date_uploaded")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        public Date dateUploaded;                   //  "2015-11-01 03:21:04"
        @JsonProperty("genres")
        public String[] genres;                     //  ["Action", "Drama", "Mystery", "Thriller"]
        @JsonProperty("id")
        public int id;                              //  3717
        @JsonProperty("imdb_code")
        public String imdbCode;                     //  "tt0167404"
        @JsonProperty("slug")
        public String slug;                         //  "the-sixth-sense-1999"
        @JsonProperty("state")
        public String state;                        //  "ok"
        @JsonProperty("title")
        public String title;                        //  "The Sixth Sense"
        @JsonProperty("title_long")
        public String titleLong;                    //  "The Sixth Sense (1999)"
        @JsonProperty("torrents")
        public String[] torrents;                   //  [{url: "https://yts.am/torrent/download/A4C0B47427631559E8C0F5F9F1095728B3EF0F88",…},…]
        @JsonProperty("url")
        public String url;                          //  "https://yts.am/movie/the-sixth-sense-1999"
        @JsonProperty("year")
        public int year;                            //  1999
    }

    @Autowired
    MovieService movieService;

    public TorrentResult[] searchTorrent(String query) {

        SearchResult[] results = searchMovie(query).results;
        if (results.length < 1) {
            return null;
        }

        Movie movie = movieService.movie(results[0].id);

        YtsClient.YtsMovie[] movies = ytsClient.listMovies(
            movie.imdbId, true, null, null, null, null, 1, 100, null
        );

        if (movies != null) {
            return Arrays.stream(movies).map(yts -> TorrentResult.builder()
                .dateUploaded(yts.dateUploaded)
                .genres(yts.genres)
                .id(yts.id)
                .imdbCode(yts.imdbCode)
                .slug(yts.slug)
                .state(yts.state)
                .title(yts.title)
                .titleLong(yts.titleLong)
                .torrents(Arrays.stream(yts.torrents).map(torrent->torrent.url).toArray(String[]::new))
                .url(yts.url)
                .year(yts.year)
                .build()).toArray(TorrentResult[]::new);
        } else {
            return null;
        }
    }
}
