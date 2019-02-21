package org.codebite.springmediamanager.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.data.Media;
import org.codebite.springmediamanager.data.MovieSearchResult;
import org.codebite.springmediamanager.data.mongodb.MediaRepository;
import org.codebite.springmediamanager.data.tmdb.MovieService;
import org.codebite.springmediamanager.media.DownloadService;
import org.codebite.springmediamanager.media.MediaService;
import org.codebite.springmediamanager.media.PosterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/media/{id}")
    @ResponseBody
    public Media getMedia(@PathVariable Long id) {
        List<Media> list = mediaRepository.findByMovie_Id(id);
        return list.isEmpty() ? null : list.get(0);
    }

    @Autowired
    MediaService mediaService;

    @PostMapping(value = "/discover/media")
    public void discover(@RequestParam String path) throws IOException {
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
    public MovieSearchResult searchMulti(@RequestParam String query) {
        return movieService.multiSearch(query);
    }

    @Autowired
    private DownloadService downloadService;

    private enum DownloadActions {
        START,
        STOP,
        DELETE
    }

    @PostMapping(value = "/download/magnet", consumes = "text/plain", produces = "text/plain")
    public void download(@RequestBody String magnetUri,
                           @RequestParam(required = true) String action,
                           @RequestParam(required = false, defaultValue = "false") boolean keepSeeding) {
        switch (DownloadActions.valueOf(action.toUpperCase())) {
            case START:
                downloadService.downloadTorrent(magnetUri, keepSeeding);
                return;
            case STOP:
                downloadService.stopTorrent(magnetUri);
                return;
            case DELETE:
                downloadService.deleteTorrent(magnetUri);
        }
    }
}
