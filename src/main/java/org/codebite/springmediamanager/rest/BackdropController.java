package org.codebite.springmediamanager.rest;

import org.codebite.springmediamanager.AppProperties;
import org.codebite.springmediamanager.data.Backdrop;
import org.codebite.springmediamanager.data.mongodb.BackdropRepository;
import org.codebite.springmediamanager.data.tmdb.ImageService;
import org.codebite.springmediamanager.data.tmdb.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.ByteArrayInputStream;
import java.util.concurrent.TimeUnit;

@Controller
public class BackdropController {

    @Autowired
    AppProperties properties;

    @Autowired
    BackdropRepository backdropRepository;

    @Autowired
    MovieService movieService;

    @Autowired
    ImageService imageService;

    @PutMapping("/backdrop/{movieId}")
    @ResponseBody
    public void save(@PathVariable Long movieId) {
        Backdrop backdrop = imageService.getBackdrop(movieService.movie(movieId));
        backdropRepository.save(backdrop);
    }

    @GetMapping("/backdrop/{movieId}")
    @ResponseBody
    public Backdrop find(@PathVariable Long movieId) {
        return backdropRepository.findById(movieId).orElse(null);
    }

    private static ResponseEntity<InputStreamResource> toResponseEntity(byte[] bytes) {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(1, TimeUnit.DAYS))
                .contentType(MediaType.IMAGE_JPEG)
                .contentLength(bytes.length)
                .body(new InputStreamResource(new ByteArrayInputStream(bytes)));
    }

    @GetMapping("/backdrop/{movieId}/original")
    @ResponseBody
    public ResponseEntity<InputStreamResource> originalBackdrop(@PathVariable Long movieId) {
        return backdropRepository.findOriginalSizeById(movieId)
                .map(backdrop -> backdrop.original)
                .map(BackdropController::toResponseEntity)
                .orElse(null);
    }

    @GetMapping("/backdrop/{movieId}/large")
    @ResponseBody
    public ResponseEntity<InputStreamResource> largeBackdrop(@PathVariable Long movieId) {
        return backdropRepository.findLargeSizeById(movieId)
                .map(backdrop -> backdrop.large)
                .map(BackdropController::toResponseEntity)
                .orElse(null);
    }

    @GetMapping("/backdrop/{movieId}/medium")
    @ResponseBody
    public ResponseEntity<InputStreamResource> mediumBackdrop(@PathVariable Long movieId) {
        return backdropRepository.findMediumSizeById(movieId)
                .map(backdrop -> backdrop.medium)
                .map(BackdropController::toResponseEntity)
                .orElse(null);
    }

    @GetMapping("/backdrop/{movieId}/small")
    @ResponseBody
    public ResponseEntity<InputStreamResource> smallBackdrop(@PathVariable Long movieId) {
        return backdropRepository.findSmallSizeById(movieId)
                .map(backdrop -> backdrop.small)
                .map(BackdropController::toResponseEntity)
                .orElse(null);
    }

}
