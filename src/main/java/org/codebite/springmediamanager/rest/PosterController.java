package org.codebite.springmediamanager.rest;

import org.codebite.springmediamanager.AppProperties;
import org.codebite.springmediamanager.data.Movie;
import org.codebite.springmediamanager.data.Poster;
import org.codebite.springmediamanager.data.mongodb.MediaRepository;
import org.codebite.springmediamanager.data.mongodb.PosterRepository;
import org.codebite.springmediamanager.data.tmdb.ImageService;
import org.codebite.springmediamanager.data.tmdb.MovieService;
import org.codebite.springmediamanager.media.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.concurrent.TimeUnit;

@Controller
public class PosterController {

    @Autowired
    AppProperties properties;

    @Autowired
    PosterRepository posterRepository;

    @Autowired
    MovieService movieService;

    @Autowired
    ImageService imageService;

    @PutMapping("/poster/{movieId}")
    @ResponseBody
    public void save(@PathVariable Long movieId) {
        Poster poster = imageService.getPoster(movieService.movie(movieId).getInfo());
        posterRepository.save(poster);
    }

    @GetMapping("/poster/{movieId}")
    @ResponseBody
    public Poster find(@PathVariable Long movieId) {
        return posterRepository.findById(movieId).orElse(null);
    }

    private static ResponseEntity<InputStreamResource> toResponseEntity(byte[] bytes) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(1, TimeUnit.DAYS))
                .contentType(MediaType.IMAGE_JPEG)
                .contentLength(bytes.length)
                .body(new InputStreamResource(new ByteArrayInputStream(bytes)));
    }

    @GetMapping("/poster/{movieId}/original")
    @ResponseBody
    public ResponseEntity<InputStreamResource> originalPoster(@PathVariable Long movieId) {
        return posterRepository.findOriginalSizeById(movieId)
                .map(poster -> poster.original)
                .map(PosterController::toResponseEntity)
                .orElse(null);
    }

    @GetMapping("/poster/{movieId}/large")
    @ResponseBody
    public ResponseEntity<InputStreamResource> largePoster(@PathVariable Long movieId) {
        return posterRepository.findLargeSizeById(movieId)
                .map(poster -> poster.large)
                .map(PosterController::toResponseEntity)
                .orElse(null);
    }

    @GetMapping("/poster/{movieId}/medium")
    @ResponseBody
    public ResponseEntity<InputStreamResource> mediumPoster(@PathVariable Long movieId) {
        return posterRepository.findMediumSizeById(movieId)
                .map(poster -> poster.medium)
                .map(PosterController::toResponseEntity)
                .orElse(null);
    }

    @GetMapping("/poster/{movieId}/small")
    @ResponseBody
    public ResponseEntity<InputStreamResource> smallPoster(@PathVariable Long movieId) {
        return posterRepository.findSmallSizeById(movieId)
                .map(poster -> poster.small)
                .map(PosterController::toResponseEntity)
                .orElse(null);
    }

    @Autowired
    MediaRepository mediaRepository;

    @Autowired
    MediaService mediaService;

    @PostMapping("/poster/fetch/{id}")
    @ResponseBody
    public void fetchPosters(@PathVariable(name = "id") Long id) {
        Movie movie = movieService.movie(id);
        mediaService.fetchImages(movie.getInfo());
    }


}
