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
public class Backdrop implements Serializable {

    @Id
    @JsonProperty("movie_id")
    public Long movieId;

    @JsonProperty("small")
    public byte[] small; /* w300 */

    @JsonProperty("medium")
    public byte[] medium; /* w780 */

    @JsonProperty("large")
    public byte[] large; /* w1280 */

    @JsonProperty("original")
    public byte[] original;
}
