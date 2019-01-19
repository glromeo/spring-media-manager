package org.codebite.springmediamanager.data.mongodb;

import org.codebite.springmediamanager.data.Backdrop;
import org.codebite.springmediamanager.data.Poster;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface BackdropRepository extends MongoRepository<Backdrop, Long> {

    @Query(value = "{'_id': ?0}", fields = "{'small': 1, '_id': 0}")
    Optional<Poster> findSmallSizeById(Long id);

    @Query(value = "{'_id': ?0}", fields = "{'medium': 1, '_id': 0}")
    Optional<Poster> findMediumSizeById(Long id);

    @Query(value = "{'_id': ?0}", fields = "{'large': 1, '_id': 0}")
    Optional<Poster> findLargeSizeById(Long id);

    @Query(value = "{'_id': ?0}", fields = "{'original': 1, '_id': 0}")
    Optional<Poster> findOriginalSizeById(Long id);
}
