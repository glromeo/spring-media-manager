package org.codebite.springmediamanager;

import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.data.Movie;
import org.codebite.springmediamanager.data.elasticsearch.MovieIndexer;
import org.codebite.springmediamanager.data.mongodb.MovieRepository;
import org.codebite.springmediamanager.data.tmdb.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.RecursiveAction;

import static java.util.Arrays.asList;

// import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@SpringBootApplication
@EnableConfigurationProperties(ApplicationProperties.class)
@EnableMongoRepositories(basePackages = {"org.codebite.springmediamanager.data.mongodb"})
// @EnableElasticsearchRepositories(basePackages = {"org.codebite.springmediamanager.data.elasticsearch"})
@Slf4j
public class SpringMediaManagerApplication implements ApplicationRunner {

    @Autowired
    MovieService movieService;

    @Autowired
    MovieRepository movieRepository;

    @Autowired
    MovieIndexer movieIndexer;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (args.containsOption("fetch")) {
            Movie latestMovie = movieService.latestMovie();
            Long latestMovieId = latestMovie.id;
            log.info("fetching movie info from themoviedb.org");
            ForkJoinPool.commonPool().invoke(new FetchMovies(latestMovieId, 0L));
            log.info("fetching finished");
        }
        if (args.containsOption("index")) {
            log.info("indexing movies");
            ForkJoinPool.commonPool().invoke(new IndexMovies());
            log.info("indexing finished");
        }
    }

    private class IndexMovies extends RecursiveAction {

        private Page<Movie> page;

        IndexMovies() {
            this(0);
        }

        IndexMovies(int pageNumber) {
            page = movieRepository.findAll(PageRequest.of(pageNumber, 100));
        }

        @Override
        protected void compute() {
            if (page.hasNext()) {
                invokeAll(new IndexMovies(page.getNumber()+1));
            }
            if (page.hasContent()) {
                movieIndexer.saveAll(page);
            }
        }
    }

    private class FetchMovies extends RecursiveAction {

        private static final long JOB_SIZE = 100;

        private final Long fromMovieId;
        private final Long toMovieId;

        FetchMovies(Long fromMovieId, Long toMovieId) {
            this.fromMovieId = fromMovieId;
            this.toMovieId = toMovieId;
        }

        @Override
        protected void compute() {
            if (fromMovieId - toMovieId > JOB_SIZE) {
                invokeAll(asList(
                        new FetchMovies(fromMovieId, fromMovieId - JOB_SIZE),
                        new FetchMovies(fromMovieId - JOB_SIZE + 1, toMovieId)
                ));
            } else {
                for (long movieId = fromMovieId; movieId >= toMovieId; movieId--) {
                    movieService.movie(movieId);
                }
            }
        }

    }

    /**
     * --populate
     *
     * @param args
     */
    public static void main(String[] args) {
        SpringApplication.run(SpringMediaManagerApplication.class, args);
    }

}
