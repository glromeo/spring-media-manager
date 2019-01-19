package org.codebite.springmediamanager.data.tmdb;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Configuration {

    public static class Images {

        @JsonProperty("base_url")
        public String baseUrl;

        @JsonProperty("secure_base_url")
        public String secureBaseUrl;

        @JsonProperty("backdrop_sizes")
        public String[] backdropSizes;

        @JsonProperty("logo_sizes")
        public String[] logoSizes;

        @JsonProperty("poster_sizes")
        public String[] posterSizes;

        @JsonProperty("profile_sizes")
        public String[] profileSizes;

        @JsonProperty("still_sizes")
        public String[] stillSizes;
    }

    @JsonProperty("images")
    public Images images;

    @JsonProperty("change_keys")
    public String[] changeKeys;
}
