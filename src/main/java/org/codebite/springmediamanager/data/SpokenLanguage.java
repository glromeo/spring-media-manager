package org.codebite.springmediamanager.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SpokenLanguage {
    @JsonProperty("iso_639_1")
    public String iso;
    @JsonProperty("name")
    public String name;
}
