package org.codebite.springmediamanager.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SearchParams {
    @JsonProperty(required = false)
    public Integer page;
    @JsonProperty(required = false)
    public Boolean includeAdult;
    @JsonProperty(required = false)
    public String region;
    @JsonProperty(required = false)
    public Integer year;
    @JsonProperty(required = false)
    public Integer primaryReleaseYear;
}
