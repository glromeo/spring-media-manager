package org.codebite.springmediamanager.data.tmdb;

import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.data.MovieSearchResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class SearchService {

    @Autowired
    private ApiClient apiClient;

    public MovieSearchResult searchMovie(
            String query,
            String language,
            Integer page,
            Boolean includeAdult,
            String region,
            Integer year,
            Integer primaryReleaseYear
    ) {
        StringBuilder url = new StringBuilder(256);

        List<Object> urlVars = new ArrayList<>();
        url.append("/search/movie?query={query}");
        urlVars.add(query);

        if (language != null) {
            url.append("&language={language}");
            urlVars.add(language);
        }
        if (page != null) {
            url.append("&page={page}");
            urlVars.add(page);
        }
        if (includeAdult != null) {
            url.append("&includeAdult={includeAdult}");
            urlVars.add(includeAdult);
        }
        if (region != null) {
            url.append("&region={region}");
            urlVars.add(region);
        }
        if (year != null) {
            url.append("&year={year}");
            urlVars.add(year);
        }
        if (primaryReleaseYear != null) {
            url.append("&primaryReleaseYear={primaryReleaseYear}");
            urlVars.add(primaryReleaseYear);
        }

        return apiClient.get(url.toString(), MovieSearchResult.class, urlVars);
    }

}
