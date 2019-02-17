package org.codebite.springmediamanager.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.data.MovieSearchResult;
import org.codebite.springmediamanager.data.tmdb.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@Slf4j
public class SearchController {

    @Autowired
    SearchService searchService;

    @GetMapping("/search/movie")
    @ResponseBody
    public MovieSearchResult movieSearch(
            @RequestParam(name="query", required = true) String query,
            @RequestParam(name="language", required = false) String language,
            @RequestParam(name="page", required = false) Integer page,
            @RequestParam(name="include_adult", required = false) Boolean includeAdult,
            @RequestParam(name="region", required = false) String region,
            @RequestParam(name="year", required = false) Integer year,
            @RequestParam(name="primary_release_year", required = false) Integer primaryReleaseYear
    ) {
        return searchService.searchMovie(query, language, page, includeAdult, region, year, primaryReleaseYear);
    }
}
