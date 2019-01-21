package org.codebite.springmediamanager.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Collection implements Serializable {

    @JsonProperty("id")
    public Long id;
    @JsonProperty("name")
    public String name;
    @JsonProperty("poster_path")
    public String posterPath;
    @JsonProperty("backdrop_path")
    public String backdropPath;

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Part implements Serializable {
        @JsonProperty("adult")
        public Boolean adult;
        @JsonProperty("backdrop_path")
        public String backdropPath;
        @JsonProperty("genre_ids")
        public Long[] genreIds;
        @JsonProperty("id")
        public Long id;
        @JsonProperty("original_language")
        public String originalLanguage;
        @JsonProperty("original_title")
        public String originalTitle;
        @JsonProperty("overview")
        public String overview;
        @JsonProperty("release_date")
        public LocalDate releaseDate;
        @JsonProperty("poster_path")
        public String posterPath;
        @JsonProperty("popularity")
        public Number popularity;
        @JsonProperty("title")
        public String title;
        @JsonProperty("video")
        public Boolean video;
        @JsonProperty("vote_average")
        public Number voteAverage;
        @JsonProperty("vote_count")
        public Long voteCount;
    }

    @JsonProperty("parts")
    public Part[] parts;

}
