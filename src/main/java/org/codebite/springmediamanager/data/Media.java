package org.codebite.springmediamanager.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.codebite.springmediamanager.media.Metadata;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.nio.file.Path;

@NoArgsConstructor
@Document
public class Media implements Serializable {

    @JsonProperty
    @Id
    public String path;

    @JsonProperty
    public Movie movie;

    @JsonProperty
    public Metadata metadata;

    @Builder
    public Media(String path, Movie movie, Metadata metadata) {
        this.path = path.toString();
        this.movie = movie;
        this.metadata = metadata;
    }
}
