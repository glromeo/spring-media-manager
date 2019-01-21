package org.codebite.springmediamanager.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class MovieInfo implements Serializable {

    @JsonProperty("poster_path")
    public String posterPath;

    @JsonProperty("adult")
    public Boolean adult;

    @JsonProperty("overview")
    public String overview;

    @JsonProperty("release_date")
    public LocalDate releaseDate;

    @JsonProperty("genre_ids")
    public Long[] genreIds;

    @JsonProperty("id")
    public Long id;

    @JsonProperty("original_title")
    public String originalTitle;

    @JsonProperty("original_language")
    public String originalLanguage;

    @JsonProperty("title")
    public String title;

    @JsonProperty("backdrop_path")
    public String backdropPath;

    @JsonProperty("popularity")
    public Number popularity;

    @JsonProperty("vote_count")
    public Integer voteCount;

    @JsonProperty("video")
    public Boolean video;

    @JsonProperty("vote_average")
    public Number voteAverage;
}
