package org.codebite.springmediamanager.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@org.springframework.data.mongodb.core.mapping.Document
public class Track implements Serializable {

    @Id
    @JsonProperty("id")
    public Long id;

    @JsonProperty("content")
    public String content;
}
