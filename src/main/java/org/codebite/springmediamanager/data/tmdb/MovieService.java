package org.codebite.springmediamanager.data.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.data.Genre;
import org.codebite.springmediamanager.data.MovieGenres;
import org.codebite.springmediamanager.data.Movie;
import org.codebite.springmediamanager.data.elasticsearch.MovieIndexer;
import org.codebite.springmediamanager.data.mongodb.GenreRepository;
import org.codebite.springmediamanager.data.mongodb.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import static org.codebite.springmediamanager.data.tmdb.ApiClient.BASE_URL;

@Service
@Slf4j
public class MovieService {

    @Autowired
    private ApiClient apiClient;

    public Movie latestMovie() {
        return apiClient.get("/movie/latest", Movie.class);
    }

    @Autowired
    MovieRepository movieRepository;

    @Cacheable("movie")
    public Movie movie(Long id) {
        return movieRepository.findById(id).orElseGet(() -> {
            Movie movie = apiClient.get("/movie/{id}", Movie.class, id);
            if (movie != null) {
                log.info("fetched: #{} {}", movie.id, movie.title);
                movieRepository.save(movie);
            }
            return movie;
        });
    }

    @Autowired
    MovieIndexer movieIndexer;

    public void index(Long id) {
        movieIndexer.index(movie(id));
    }

    public Configuration configuration() {
        return apiClient.configuration;
    }

    @Cacheable("image")
    public byte[] image(String size, String path) {
        return apiClient.image(size, path);
    }

    public Movie findMovie(String title) {
        SearchResult searchResult = movieSearch(title);
        if (searchResult.totalResults > 0) {
            Movie movie = searchResult.results[0];
            log.info("{} -> #{} '{}' ({})", title, movie.id, movie.title, movie.releaseDate);
            return movie;
        } else {
            log.info("{} has no result", title);
            return null;
        }
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class MovieSearchParams {
        public Integer page;
        public Boolean includeAdult;
        public String region;
        public Integer year;
        public Integer primaryReleaseYear;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SearchResult {
        @JsonProperty("page")
        public Integer page;
        @JsonProperty("results")
        public Movie[] results;
        @JsonProperty("total_results")
        public Integer totalResults;
        @JsonProperty("total_pages")
        public Integer totalPages;
    }

    public SearchResult movieSearch(String query) {
        return apiClient.get("/search/movie?query={query}", SearchResult.class, query);
    }

    public SearchResult movieSearch(String query, MovieSearchParams searchParams) {
        if (searchParams != null) {
            Map<String, ?> vars = getUrlVariables(query, searchParams);
            StringBuilder url = new StringBuilder().append(BASE_URL).append("/search/movie");
            {
                int questionMarkIndex = url.length();
                for (String key : vars.keySet()) {
                    url.append("&").append(key).append("={").append(key).append("}");
                }
                url.setCharAt(questionMarkIndex, '?');
            }
            return apiClient.get(url.toString(), SearchResult.class, vars);
        } else {
            return movieSearch(query);
        }
    }

    private static ObjectMapper objectMapper = new ObjectMapper();

    @SuppressWarnings("unchecked")
    private Map<String, ?> getUrlVariables(String query, MovieSearchParams searchParams) {
        Map map = objectMapper.convertValue(searchParams, Map.class);
        map.put("query", query);
        return map;
    }

    @Autowired
    GenreRepository genreRepository;

    public MovieGenres listMovieGenres() {
        List<Genre> genres = genreRepository.findAll();
        if (genres.isEmpty()) {
            MovieGenres all = apiClient.get("/genre/movie/list", MovieGenres.class);
            genreRepository.saveAll(all.genres);
            genres = genreRepository.findAll();
        }
        return new MovieGenres(genres);
    }
}
