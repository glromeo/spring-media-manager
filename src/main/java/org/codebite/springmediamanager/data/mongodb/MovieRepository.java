package org.codebite.springmediamanager.data.mongodb;

import org.codebite.springmediamanager.data.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MovieRepository extends MongoRepository<Movie, Long> {

    List<Movie> findByTitle(String title);
}
