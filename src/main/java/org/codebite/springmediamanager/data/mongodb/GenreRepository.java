package org.codebite.springmediamanager.data.mongodb;

import org.codebite.springmediamanager.data.Genre;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GenreRepository extends MongoRepository<Genre, Long> {
}
