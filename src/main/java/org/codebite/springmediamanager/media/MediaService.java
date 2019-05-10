package org.codebite.springmediamanager.media;

import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.ApplicationProperties;
import org.codebite.springmediamanager.data.*;
import org.codebite.springmediamanager.data.mongodb.BackdropRepository;
import org.codebite.springmediamanager.data.mongodb.MediaRepository;
import org.codebite.springmediamanager.data.mongodb.PosterRepository;
import org.codebite.springmediamanager.data.tmdb.ImageService;
import org.codebite.springmediamanager.data.tmdb.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

import static java.lang.System.getProperty;

@Service
@Slf4j
public class MediaService {

    private static final String[] TERMINAL_EXEC = {
        getProperty("os.name").startsWith("Windows") ? "cmd.exe" : "bash"
    };

    @Autowired
    MovieService movieService;

    @Autowired
    MetadataService metadataService;

    /**
     * @param paths
     * @return
     */
    public Stream<Media> discover(Iterable<Path> paths) throws IOException {
        return metadataService.scan(paths).map(metadata -> {
            SearchResult searchResult = movieService.findMovie(plausibleTitle(metadata));
            if (searchResult != null) {
                fetchImages(movieService.movie(searchResult.id));
            }
            return Media.builder()
                .path(Paths.get(metadata.directory, metadata.fileName).toString())
                .metadata(metadata)
                .movie(searchResult)
                .build();
        });
    }

    @Autowired
    MediaRepository mediaRepository;

    public void refresh(Iterable<Path> paths) {
        for (Path path : paths) {
            String mediaPath = path.toAbsolutePath().toString();
            mediaRepository.findById(mediaPath).orElseGet(() -> {
                log.info("missing: " + mediaPath);
                return null;
            });
        }
    }

    private String plausibleTitle(Metadata metadata) {
        return metadata.fileName.replace('_', ' ').replace('.', ' ').replaceAll("\\W+\\([^)]*\\)\\W.*", "");
    }

    @Autowired
    PosterRepository posterRepository;

    @Autowired
    BackdropRepository backdropRepository;

    @Autowired
    ImageService imageService;

    public void fetchImages(Movie movie) {
        log.info("Fetching images for: #{} {}", movie.id, movie.title);
        if (!posterRepository.existsById(movie.id)) {
            Poster poster = imageService.getPoster(movie);
            posterRepository.save(poster);
        }
        if (!backdropRepository.existsById(movie.id)) {
            Backdrop backdrop = imageService.getBackdrop(movie);
            backdropRepository.save(backdrop);
        }
    }

    @Autowired
    ApplicationProperties properties;

    public void save(Media media, Long movieId) {

        Movie movie = movieService.movie(movieId);
        media.movie = movie.getInfo();

        String titleAndDate = sanitizeFilename(movie.title) + " (" + movie.releaseDate.getYear() + ")";

        File movieDir = new File(new File(properties.path), titleAndDate);
        movieDir.mkdirs();

        File sourceFile = new File(media.path);
        File targetFilename = new File(movieDir, titleAndDate + ' ' + getResolution(media) + '.' + media.metadata.fileTypeExtension);
        sourceFile.renameTo(targetFilename);

        log.info("saved: {}", targetFilename);
    }

    private String getResolution(Media media) {
        Metadata metadata = media.metadata;
        if (metadata.imageWidth >= 1024) {
            return "HD";
        } else {
            return "SD";
        }
    }

    private String sanitizeFilename(String fileName) {
        return fileName.replaceAll("[\\\\/:*?\"<>|]", "_");
    }
}
