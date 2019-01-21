package org.codebite.springmediamanager.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MovieSearchParams {
    public Integer page;
    public Boolean includeAdult;
    public String region;
    public Integer year;
    public Integer primaryReleaseYear;
}
