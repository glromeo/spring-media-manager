package org.codebite.springmediamanager.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchResultsPage implements Serializable {
    @JsonProperty("page")
    public Integer page;
    @JsonProperty("results")
    public SearchResult[] results;
    @JsonProperty("total_results")
    public Integer totalResults;
    @JsonProperty("total_pages")
    public Integer totalPages;
}
