package org.codebite.springmediamanager.rest;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.AppProperties;
import org.codebite.springmediamanager.data.Movie;
import org.codebite.springmediamanager.data.MovieGenres;
import org.codebite.springmediamanager.data.MovieSearchParams;
import org.codebite.springmediamanager.data.MovieSearchResult;
import org.codebite.springmediamanager.data.tmdb.Configuration;
import org.codebite.springmediamanager.data.tmdb.MovieService;
import org.codebite.springmediamanager.media.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.Serializable;
import java.nio.file.Paths;
import java.util.Map;

@Controller
@Slf4j
public class MoviesController {

    @Autowired
    AppProperties app;

    @Autowired
    MovieService movieService;

    @GetMapping("/configuration")
    @ResponseBody
    public Configuration getConfiguration() {
        return movieService.configuration();
    }

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/search/movie")
    @ResponseBody
    public MovieSearchResult movieSearch(
            @RequestParam(name = "query") String query,
            @RequestParam Map<String, String> parameters
    ) {
        MovieSearchParams params = objectMapper.convertValue(parameters, MovieSearchParams.class);
        return movieService.movieSearch(query, params);
    }

    @GetMapping("/movie/latest")
    @ResponseBody
    public Movie latestMovie() {
        return movieService.latestMovie();
    }

    @GetMapping("/movie/{id}")
    @ResponseBody
    public Movie getMovie(@PathVariable(name = "id") Long id) {
        return movieService.movie(id);
    }

    @Autowired
    MediaService mediaService;

    public static class PutMovieParams implements Serializable {
        @JsonProperty
        public String id;
        @JsonProperty
        public String path;
        @JsonProperty
        public String title;
    }

    @PutMapping("/movie/{id}")
    @ResponseBody
    public Movie putMovie(@PathVariable(name = "id") Long id, PutMovieParams params) throws IOException {
        Movie movie = movieService.movie(id);
        mediaService.read(Paths.get(params.path )).ifPresent(metadata -> {
            //todo: <<<???!!!
        });
        return movie;
    }

    @GetMapping("/index/movie/{id}")
    @ResponseBody
    public void indexMovie(@PathVariable(name = "id") Long id) {
        movieService.index(id);
    }

    @GetMapping("/genre/movie/list")
    @ResponseBody
    public MovieGenres listMovieGenre() {
        return movieService.listMovieGenres();
    }

}
