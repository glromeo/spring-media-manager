package org.codebite.springmediamanager.data.mongodb;

import org.codebite.springmediamanager.data.Track;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TracksRepository extends MongoRepository<Track, Long> {
}
