package org.codebite.springmediamanager.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MovieSearchResult {
    @JsonProperty("page")
    public Integer page;
    @JsonProperty("results")
    public MovieInfo[] results;
    @JsonProperty("total_results")
    public Integer totalResults;
    @JsonProperty("total_pages")
    public Integer totalPages;
}
