package org.codebite.springmediamanager.data.yts.am;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.conn.ssl.NoopHostnameVerifier;
import org.apache.http.impl.client.HttpClients;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.annotation.PostConstruct;
import java.io.Serializable;
import java.util.Date;

import static java.util.Objects.*;

@Service
@Slf4j
public class YtsClient {

    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ListMoviesRequest implements Serializable {
        @JsonProperty("limit")
        public Integer limit; // 1 - 50 (inclusive)
        @JsonProperty("page")
        public Integer page;
        @JsonProperty("quality")
        public String quality; // 720p, 1080p, 3D
        @JsonProperty("minium_rating")
        public Integer miniumRating; // 0 - 9 (inclusive)
        @JsonProperty("query_term")
        public String queryTerm;
        @JsonProperty("genre")
        public String genre;
        @JsonProperty("sort_by")
        public String sortBy; // title, year, rating, peers, seeds, download_count, like_count, date_added
        @JsonProperty("order_by")
        public String orderBy; // desc, asc
        @JsonProperty("with_rt_rating")
        public Boolean withRtRating; // boolean
    }

    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class YtsTorrent implements Serializable {
        @JsonProperty("date_uploaded")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        public Date dateUploaded;                   // "2015-11-01 03:21:04"
        @JsonProperty("date_uploaded_unix")
        public long dateUploadedUnix;               // 1446344464
        @JsonProperty("hash")
        public String hash;                         // "A4C0B47427631559E8C0F5F9F1095728B3EF0F88"
        @JsonProperty("peers")
        public int peers;                           // 14
        @JsonProperty("quality")
        public String quality;                      // "720p"
        @JsonProperty("seeds")
        public int seeds;                           // 184
        @JsonProperty("size")
        public String size;                         // "807.04 MB"
        @JsonProperty("size_bytes")
        public long sizeBytes;                      // 846242775
        @JsonProperty("type")
        public String type;                         // "bluray"
        @JsonProperty("url")
        public String url;                          // "https://yts.am/torrent/download/A4C0B47427631559E8C0F5F9F1095728B3EF0F88"
    }

    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class YtsMovie implements Serializable {
        @JsonProperty("background_image")
        public String backgroundImage;              //  "https://yts.am/assets/images/movies/The_Sixth_Sense_1999/background.jpg"
        @JsonProperty("background_image_original")
        public String backgroundImageOriginal;      //  "https://yts.am/assets/images/movies/The_Sixth_Sense_1999/background.jpg"
        @JsonProperty("date_uploaded")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        public Date dateUploaded;                   //  "2015-11-01 03:21:04"
        @JsonProperty("date_uploaded_unix")
        public long dateUploadedUnix;               //  1446344464
        @JsonProperty("description_full")
        public String descriptionFull;              //  "Malcom Crowe (Bruce Willis)is a child psychologist who receives an award on the same night that he is visited by a very unhappy ex-patient. After this encounter, Crowe takes on the task of curing a young boy with the same ills as the ex-patient (Donnie Wahlberg) . This boy "sees dead people". Crowe spends a lot of time with the boy much to the dismay of his wife (Olivia Williams). Cole's mom (Toni Collette) is at her wit's end with what to do about her son's increasing problems. Crowe is the boy's only hope."
        @JsonProperty("genres")
        public String[] genres;                     //  ["Action", "Drama", "Mystery", "Thriller"]
        @JsonProperty("id")
        public int id;                              //  3717
        @JsonProperty("imdb_code")
        public String imdbCode;                     //  "tt0167404"
        @JsonProperty("language")
        public String language;                     //  "English"
        @JsonProperty("large_cover_image")
        public String largeCoverImage;              //  "https://yts.am/assets/images/movies/The_Sixth_Sense_1999/large-cover.jpg"
        @JsonProperty("medium_cover_image")
        public String mediumCoverImage;             //  "https://yts.am/assets/images/movies/The_Sixth_Sense_1999/medium-cover.jpg"
        @JsonProperty("mpa_rating")
        public String mpaRating;                    //  "PG-13"
        @JsonProperty("rating")
        public double rating;                       //  8.1
        @JsonProperty("runtime")
        public double runtime;                      //  107
        @JsonProperty("slug")
        public String slug;                         //  "the-sixth-sense-1999"
        @JsonProperty("small_cover_image")
        public String smallCoverImage;              //  "https://yts.am/assets/images/movies/The_Sixth_Sense_1999/small-cover.jpg"
        @JsonProperty("state")
        public String state;                        //  "ok"
        @JsonProperty("summary")
        public String summary;                      //  "Malcom Crowe (Bruce Willis)is a child psychologist who receives an award on the same night that he is visited by a very unhappy ex-patient. After this encounter, Crowe takes on the task of curing a young boy with the same ills as the ex-patient (Donnie Wahlberg) . This boy "sees dead people". Crowe spends a lot of time with the boy much to the dismay of his wife (Olivia Williams). Cole's mom (Toni Collette) is at her wit's end with what to do about her son's increasing problems. Crowe is the boy's only hope."
        @JsonProperty("synopsis")
        public String synopsis;                     //  "Malcom Crowe (Bruce Willis)is a child psychologist who receives an award on the same night that he is visited by a very unhappy ex-patient. After this encounter, Crowe takes on the task of curing a young boy with the same ills as the ex-patient (Donnie Wahlberg) . This boy "sees dead people". Crowe spends a lot of time with the boy much to the dismay of his wife (Olivia Williams). Cole's mom (Toni Collette) is at her wit's end with what to do about her son's increasing problems. Crowe is the boy's only hope."
        @JsonProperty("title")
        public String title;                        //  "The Sixth Sense"
        @JsonProperty("title_english")
        public String titleEnglish;                 //  "The Sixth Sense"
        @JsonProperty("title_long")
        public String titleLong;                    //  "The Sixth Sense (1999)"
        @JsonProperty("torrents")
        public YtsTorrent[] torrents;               //  [{url: "https://yts.am/torrent/download/A4C0B47427631559E8C0F5F9F1095728B3EF0F88",…},…]
        @JsonProperty("url")
        public String url;                          //  "https://yts.am/movie/the-sixth-sense-1999"
        @JsonProperty("year")
        public int year;                            //  1999
        @JsonProperty("yt_trailer_code")
        public String ytTrailerCode;                //  "VG9AGf66tXM"
    }

    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ListMoviesData implements Serializable {
        @JsonProperty("movie_count")
        public int movieCount;          // The total movie count results for your query	2131
        @JsonProperty("limit")
        public int limit;               // The limit of results per page that has been set	20
        @JsonProperty("page_number")
        public int pageNumber;          // The current page number you are viewing	1
        @JsonProperty("movies")
        public YtsMovie[] movies;       // An array which will hold multiple movies and their relative information	ARRAY
    }

    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class YtsMeta {
        @JsonProperty("server_time")
        public Long serverTime;
        @JsonProperty("server_timezone")
        public String serverTimezone;
        @JsonProperty("api_version")
        public Long apiVersion;
        @JsonProperty("execution_time")
        public String executionTime;
    }

    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ListMoviesResponse implements Serializable {
        @JsonProperty
        public String status;
        @JsonProperty
        public String statusMessage;
        @JsonProperty
        public ListMoviesData data;
        @JsonProperty("@meta")
        public YtsMeta meta;
    }

    private RestTemplate restTemplate;

    @PostConstruct
    private void init() {
        HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();
        requestFactory.setHttpClient(
            HttpClients.custom()
                .setSSLHostnameVerifier(new NoopHostnameVerifier())
                .build()
        );
        restTemplate = new RestTemplate(requestFactory);
    }

    public YtsMovie[] listMovies(ListMoviesRequest request) {
        return listMovies(
            request.queryTerm, request.withRtRating, request.miniumRating, request.quality, request.sortBy, request.orderBy, request.page, request.limit,
            request.genre
        );
    }

    public YtsMovie[] listMovies(String queryTerm, Boolean withRtRating, Integer miniumRating, String quality, String sortBy, String orderBy, Integer page, Integer limit,
                                         String genre) {

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl("https://yts.am/api/v2/list_movies.json");
        if (limit != null) builder.queryParam("limit", limit);
        if (page != null) builder.queryParam("page", page);
        if (quality != null) builder.queryParam("quality", quality);
        if (miniumRating != null) builder.queryParam("minium_rating", miniumRating);
        if (queryTerm != null) builder.queryParam("query_term", queryTerm);
        if (genre != null) builder.queryParam("genre", genre);
        if (sortBy != null) builder.queryParam("sort_by", sortBy);
        if (orderBy != null) builder.queryParam("order_by", orderBy);
        if (withRtRating != null) builder.queryParam("with_rt_rating", withRtRating);

        String url = builder.toUriString();

        ResponseEntity<ListMoviesResponse> response = restTemplate.getForEntity(url, ListMoviesResponse.class);

        return requireNonNull(response.getBody()).data.movies;
    }
}
