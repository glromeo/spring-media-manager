package org.codebite.springmediamanager.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import org.springframework.data.annotation.Id;

@Builder
public class Download {

    @Id
    @JsonProperty("id")
    public String mediaId;

    @JsonProperty("torrent")
    public byte[] torrent;
}
