package org.codebite.springmediamanager.movie.kodi;

import org.codebite.springmediamanager.jaxb.LocalDateTimeXmlAdapter;

import javax.xml.bind.annotation.*;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;
import java.time.LocalDateTime;
import java.util.List;

@SuppressWarnings("ALL")
@XmlRootElement(name = "movie")
public class MovieInfo {

    @XmlElement(name = "title")
    public String title;
    @XmlElement(name = "originaltitle")
    public String originalTitle;
    @XmlElement(name = "userrating")
    public String userRating;
    @XmlElement(name = "top250")
    public String top250;
    @XmlElement(name = "outline")
    public String outline;
    @XmlElement(name = "plot")
    public String plot;
    @XmlElement(name = "tagline")
    public String tagline;
    @XmlElement(name = "runtime")
    public String runtime;
    @XmlElement(name = "thumb")
    public String thumb;
    @XmlElement(name = "fanart")
    public String fanArt;
    @XmlElement(name = "mpaa")
    public String mpaa;
    @XmlElement(name = "playcount")
    public String playCount;
    @XmlElement(name = "lastplayed")
    public String lastPlayed;
    @XmlElement(name = "id")
    public String id;
    @XmlElement(name = "genre")
    public List<String> genres;
    @XmlElement(name = "country")
    public String country;
    @XmlElement(name = "credits")
    public List<String> credits;
    @XmlElement(name = "director")
    public List<String> directors;
    @XmlElement(name = "premiered")
    public String premiered;
    @XmlElement(name = "year")
    public String year;
    @XmlElement(name = "status")
    public String status;
    @XmlElement(name = "code")
    public String code;
    @XmlElement(name = "aired")
    public String aired;
    @XmlElement(name = "studio")
    public String studio;
    @XmlElement(name = "trailer")
    public String trailer;

    @XmlRootElement(name = "uniqueid")
    public static class UniqueId {
        @XmlAttribute(name = "type")
        public String type;
        @XmlAttribute(name = "default")
        public Boolean isDefault;
        @XmlValue
        public String value;
    }

    @XmlElement(name = "uniqueid")
    public UniqueId uniqueId;

    @XmlRootElement(name = "set")
    public static class MovieSet {
        @XmlElement(name = "name")
        public String name;
        @XmlElement(name = "overview")
        public String overview;
    }

    @XmlElement(name = "set")
    public MovieSet set;

    @XmlRootElement(name = "rating")
    public static class Rating {
        @XmlAttribute(name = "name")
        public String name;
        @XmlAttribute(name = "max")
        public Float max;
        @XmlAttribute(name = "default")
        public Boolean isDefault;
        @XmlElement(name = "value")
        public Float value;
        @XmlElement(name = "votes")
        public Integer votes;
    }

    @XmlElementWrapper(name = "ratings")
    @XmlElement(name = "rating")
    public List<Rating> ratings;

    @XmlRootElement(name = "streamdetails")
    public static class StreamDetails {

        public static class Video {
            @XmlElement(name = "codec")
            public String codec;
            @XmlElement(name = "aspect")
            public Float aspect;
            @XmlElement(name = "width")
            public Integer width;
            @XmlElement(name = "height")
            public Integer height;
            @XmlElement(name = "durationinseconds")
            public Integer durationInSeconds;
            @XmlElement(name = "stereomode")
            public String stereoMode;
        }

        @XmlElement(name = "video")
        public Video video;

        public static class Audio {
            @XmlElement(name = "codec")
            public String codec;
            @XmlElement(name = "language")
            public String language;
            @XmlElement(name = "channels")
            public Integer channels;
        }

        @XmlElement(name = "audio")
        public List<Audio> audioTracks;

        public static class Subtitle {
            @XmlElement(name = "language")
            public String language;
        }

        @XmlElement(name = "subtitle")
        public List<Subtitle> subtitles;

    }

    @XmlRootElement(name = "fileinfo")
    public static class FileInfo {
        @XmlElement(name = "streamdetails")
        public StreamDetails streamDetails;
    }

    @XmlElement(name = "fileinfo")
    public FileInfo fileInfo;

    @XmlRootElement(name = "actor")
    public static class Actor {
        @XmlElement(name = "name")
        public String name;
        @XmlElement(name = "role")
        public String role;
        @XmlElement(name = "order")
        public int order;
        @XmlElement(name = "thumb")
        public String thumbnail;
    }

    @XmlElement(name = "actor")
    public List<Actor> actors;

    public static class Resume {
        @XmlElement(name = "position")
        public Float position;
        @XmlElement(name = "total")
        public Float total;
    }

    @XmlElement(name = "resume")
    public Resume resume;

    @XmlElement(name = "dateadded")
    @XmlJavaTypeAdapter(LocalDateTimeXmlAdapter.class)
    public LocalDateTime dateAdded;

}
