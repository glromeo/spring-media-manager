package org.codebite.springmediamanager.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.AppProperties;
import org.codebite.springmediamanager.data.*;
import org.codebite.springmediamanager.data.mongodb.MediaRepository;
import org.codebite.springmediamanager.data.tmdb.Configuration;
import org.codebite.springmediamanager.data.tmdb.MovieService;
import org.codebite.springmediamanager.media.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
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
    MediaService mediaService;

    @Autowired
    MediaRepository mediaRepository;

    @PostMapping(value = "/discover/media")
    public void discover(@RequestParam("path") String path) throws IOException {
        try (DirectoryStream<Path> paths = Files.newDirectoryStream(Paths.get(path))) {
            mediaService.discover(paths).forEach(mediaRepository::save);
        }
    }

    @GetMapping("/media")
    @ResponseBody
    public List<Media> movies() {
        return mediaRepository.findAll();
    }

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/search/movie")
    @ResponseBody
    public MovieSearchResult searchMovieInfo(
            @RequestParam(name = "title") String title,
            @RequestParam Map<String, String> parameters
    ) {
        MovieSearchParams params = objectMapper.convertValue(parameters, MovieSearchParams.class);
        return movieService.movieSearch(title, params);
    }

    @GetMapping("/movie/latest")
    @ResponseBody
    public Movie latestMovieInfo() {
        return movieService.latestMovie();
    }

    @GetMapping("/movie/{id}")
    @ResponseBody
    public Movie getMovieInfo(@PathVariable(name = "id") Long id) {
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
