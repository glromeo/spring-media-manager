package org.codebite.springmediamanager.data.mongodb;

import org.codebite.springmediamanager.media.Metadata;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ExiftoolRepository extends MongoRepository<Metadata, Long> {

}
