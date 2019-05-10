package org.codebite.springmediamanager.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.io.Serializable;
import java.time.LocalDate;
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
    public Boolean adult;

    @JsonProperty("backdrop_path")
    public String backdropPath;

    @JsonProperty("belongs_to_collection")
    public Collection belongsToCollection;

    @JsonProperty("budget")
    public Number budget;

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
    public Number popularity;

    @JsonProperty("poster_path")
    public String posterPath;

    @JsonProperty("production_companies")
    public List<ProductionCompany> productionCompanies;

    @JsonProperty("production_countries")
    public List<ProductionCountry> productionCountries;

    @JsonProperty("release_date")
    public LocalDate releaseDate;

    @JsonProperty("revenue")
    public Number revenue;

    @JsonProperty("runtime")
    public Number runtime;

    @JsonProperty("spoken_languages")
    public List<SpokenLanguage> spokenLanguages;

    @JsonProperty("status")
    public String status;

    @JsonProperty("tagline")
    public String tagline;

    @JsonProperty("title")
    public String title;

    @JsonProperty("video")
    public Boolean video;

    @JsonProperty("vote_average")
    public Number voteAverage;

    @JsonProperty("vote_count")
    public Integer voteCount;

    public SearchResult getInfo() {
        return SearchResult.builder()
                .id(id)
                .posterPath(posterPath)
                .adult(adult)
                .overview(overview)
                .releaseDate(releaseDate)
                .genreIds(genres.stream().map(genre -> genre.id).toArray(Long[]::new))
                .originalTitle(originalTitle)
                .originalLanguage(originalLanguage)
                .title(title)
                .backdropPath(backdropPath)
                .popularity(popularity)
                .voteCount(voteCount)
                .video(video)
                .voteAverage(voteAverage)
                .build();
    }
}