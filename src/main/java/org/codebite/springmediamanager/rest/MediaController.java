package org.codebite.springmediamanager.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.data.Media;
import org.codebite.springmediamanager.data.MovieSearchResult;
import org.codebite.springmediamanager.data.mongodb.MediaRepository;
import org.codebite.springmediamanager.data.tmdb.MovieService;
import org.codebite.springmediamanager.media.MediaService;
import org.codebite.springmediamanager.media.PosterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Controller
@Slf4j
public class MediaController {

    @Autowired
    MediaRepository mediaRepository;

    @GetMapping("/media")
    @ResponseBody
    public List<Media> listAll() {
        return mediaRepository.findAll();
    }

    @Autowired
    MediaService mediaService;

    @PostMapping(value = "/discover/media")
    public void discover(@RequestParam("path") String path) throws IOException {
        try (DirectoryStream<Path> paths = Files.newDirectoryStream(Paths.get(path))) {
            mediaService.discover(paths).forEach(mediaRepository::save);
        }
    }

    @Autowired
    PosterService posterService;

    @PostMapping(value = "/populate/media/color")
    public void populateMediaColor() throws IOException {
        posterService.populateMediaColor();
    }

    @Autowired
    MovieService movieService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/search/multi")
    @ResponseBody
    public MovieSearchResult searchMulti(@RequestParam(name = "query") String query) {
        return movieService.multiSearch(query);
    }
}
