package org.codebite.springmediamanager.data.elasticsearch;

// import org.codebite.springmediamanager.data.Movie;
// import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;


// public interface MovieIndexer extends ElasticsearchRepository<Movie, Long> {
// }

import org.codebite.springmediamanager.data.Movie;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
public class MovieIndexer {
    public void saveAll(Page<Movie> page) {

    }

    public void index(Movie movie) {

    }
}
