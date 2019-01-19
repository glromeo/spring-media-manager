package org.codebite.springmediamanager.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
//@org.springframework.data.elasticsearch.annotations.Document(indexName = "movies", type = "movie", shards = 1, replicas = 0, refreshInterval = "-1")
@org.springframework.data.mongodb.core.mapping.Document
public class Movie implements Serializable {

    @Id
    @JsonProperty("id")
    public Long id;

    @JsonProperty("adult")
    public boolean adult;

    @JsonProperty("backdrop_path")
    public String backdropPath;

    @JsonProperty("belongs_to_collection")
    public Collection belongsToCollection;

    @JsonProperty("budget")
    public BigDecimal budget;

    @JsonProperty("genres")
    public List<Genre> genres;

    @JsonProperty("homepage")
    public String homepage;

    @JsonProperty("imdb_id")
    public String imdbId;

    @JsonProperty("original_language")
    public String originalLanguage;

    @JsonProperty("original_title")
    public String originalTitle;

    @JsonProperty("overview")
    public String overview;

    @JsonProperty("popularity")
    public String popularity;

    @JsonProperty("poster_path")
    public String posterPath;

    @JsonProperty("production_companies")
    public List<ProductionCompany> productionCompanies;

    @JsonProperty("production_countries")
    public List<ProductionCountry> productionCountries;

    @JsonProperty("release_date")
    public String releaseDate;

    @JsonProperty("revenue")
    public BigDecimal revenue;

    @JsonProperty("runtime")
    public String runtime;

    @JsonProperty("spoken_languages")
    public List<SpokenLanguage> spokenLanguages;

    @JsonProperty("status")
    public String status;

    @JsonProperty("tagline")
    public String tagline;

    @JsonProperty("title")
    public String title;

    @JsonProperty("video")
    public boolean video;

    @JsonProperty("vote_average")
    public Double voteAverage;

    @JsonProperty("vote_count")
    public Long voteCount;
}