package org.codebite.springmediamanager.data.tmdb;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.data.*;
import org.codebite.springmediamanager.data.elasticsearch.MovieIndexer;
import org.codebite.springmediamanager.data.mongodb.GenreRepository;
import org.codebite.springmediamanager.data.mongodb.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public MovieInfo findMovie(String title) {
        MovieSearchResult searchResult = movieSearch(title);
        if (searchResult.totalResults > 0) {
            MovieInfo movie = searchResult.results[0];
            log.info("{} -> #{} '{}' ({})", title, movie.id, movie.title, movie.releaseDate);
            return movie;
        } else {
            log.info("{} has no result", title);
            return null;
        }
    }

    public MovieSearchResult multiSearch(String query) {
        return apiClient.get("/search/multi?query={query}", MovieSearchResult.class, query);
    }

    public MovieSearchResult multiSearch(String query, MovieSearchParams searchParams) {
        if (searchParams != null) {
            Map<String, ?> vars = getUrlVariables(query, searchParams);
            StringBuilder url = new StringBuilder().append("/search/multi");
            {
                int questionMarkIndex = url.length();
                for (String key : vars.keySet()) {
                    url.append("&").append(key).append("={").append(key).append("}");
                }
                url.setCharAt(questionMarkIndex, '?');
            }
            return apiClient.get(url.toString(), MovieSearchResult.class, vars.values().toArray());
        } else {
            return movieSearch(query);
        }
    }

    public MovieSearchResult movieSearch(String query) {
        return apiClient.get("/search/movie?query={query}", MovieSearchResult.class, query);
    }

    @Autowired
    ObjectMapper objectMapper = new ObjectMapper();

    @SuppressWarnings("unchecked")
    private Map<String, ?> getUrlVariables(String query, MovieSearchParams searchParams) {
        Map<String, Object> map = new HashMap<>();
        objectMapper.convertValue(searchParams, Map.class).forEach((key, value) -> {
            if (value != null) {
                map.put(String.valueOf(key), value);
            }
        });
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
