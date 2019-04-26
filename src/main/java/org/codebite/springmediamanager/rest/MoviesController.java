package org.codebite.springmediamanager.rest;

import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.ApplicationProperties;
import org.codebite.springmediamanager.data.Movie;
import org.codebite.springmediamanager.data.MovieGenres;
import org.codebite.springmediamanager.data.tmdb.Configuration;
import org.codebite.springmediamanager.data.tmdb.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Slf4j
public class MoviesController {

    @Autowired
    ApplicationProperties app;

    @Autowired
    MovieService movieService;

    @GetMapping("/configuration")
    @ResponseBody
    public Configuration getConfiguration() {
        return movieService.configuration();
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
