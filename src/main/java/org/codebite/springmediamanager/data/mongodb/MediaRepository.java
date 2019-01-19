package org.codebite.springmediamanager.data.mongodb;

import org.codebite.springmediamanager.data.Movie;
import org.codebite.springmediamanager.data.Media;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MediaRepository extends MongoRepository<Media, String> {

    List<Media> findByMovie_Id(String path);
}
