package org.codebite.springmediamanager.data.mongodb;

import org.codebite.springmediamanager.data.bt.TorrentConfig;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TorrentConfigRepository extends MongoRepository<TorrentConfig, String> {

    TorrentConfig findTopByOrderByCreatedDesc();
}
