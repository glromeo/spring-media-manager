package org.codebite.springmediamanager.data.tmdb;

import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.data.Backdrop;
import org.codebite.springmediamanager.data.Movie;
import org.codebite.springmediamanager.data.Poster;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ImageService {

    @Autowired
    private ApiClient apiClient;

    public Poster getPoster(Movie movie) {

        Configuration.Images imagesConfig = apiClient.configuration.images;

        String originalSize = imagesConfig.posterSizes[imagesConfig.posterSizes.length - 1];
        String largeSize = imagesConfig.posterSizes[imagesConfig.posterSizes.length - 2];
        String mediumSize = imagesConfig.posterSizes[imagesConfig.posterSizes.length / 2];
        String smallSize = imagesConfig.posterSizes[0];

        return Poster.builder()
                .movieId(movie.id)
                .original(apiClient.image(originalSize, movie.posterPath))
                .large(apiClient.image(largeSize, movie.posterPath))
                .medium(apiClient.image(mediumSize, movie.posterPath))
                .small(apiClient.image(smallSize, movie.posterPath))
                .build();
    }

    public Backdrop getBackdrop(Movie movie) {

        Configuration.Images imagesConfig = apiClient.configuration.images;

        String originalSize = imagesConfig.backdropSizes[imagesConfig.backdropSizes.length - 1];
        String largeSize = imagesConfig.backdropSizes[imagesConfig.backdropSizes.length - 2];
        String mediumSize = imagesConfig.backdropSizes[imagesConfig.backdropSizes.length / 2];
        String smallSize = imagesConfig.backdropSizes[0];

        return Backdrop.builder()
                .movieId(movie.id)
                .original(apiClient.image(originalSize, movie.backdropPath))
                .large(apiClient.image(largeSize, movie.backdropPath))
                .medium(apiClient.image(mediumSize, movie.backdropPath))
                .small(apiClient.image(smallSize, movie.backdropPath))
                .build();
    }

}
