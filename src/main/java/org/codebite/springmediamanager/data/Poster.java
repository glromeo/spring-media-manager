package org.codebite.springmediamanager.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class Poster implements Serializable {

    @Id
    @JsonProperty("movie_id")
    public Long movieId;

    @JsonProperty("small")
    public byte[] small;

    @JsonProperty("medium")
    public byte[] medium;

    @JsonProperty("large")
    public byte[] large;

    @JsonProperty("original")
    public byte[] original;
}
