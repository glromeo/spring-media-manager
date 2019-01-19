package org.codebite.springmediamanager.media;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.function.BiConsumer;

import static java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME;
import static java.time.format.DateTimeFormatter.ofPattern;
import static java.util.Optional.ofNullable;

@Slf4j
public class Metadata implements Serializable {

    @MetadataProperty("ExifTool Version Number")
    @JsonProperty
    public String exifToolVersionNumber;

    @MetadataProperty("File Name")
    @JsonProperty
    public String fileName;

    @MetadataProperty("Directory")
    @JsonProperty
    public String directory;

    @MetadataProperty("File Size")
    @JsonProperty
    public String fileSize;

    @MetadataProperty(value = "File Modification Date/Time", pattern = "yyyy:MM:dd HH:mm:ssXXX")
    @JsonProperty
    public LocalDateTime fileModificationDateTime;

    @MetadataProperty(value = "File Access Date/Time", pattern = "yyyy:MM:dd HH:mm:ssXXX")
    @JsonProperty
    public LocalDateTime fileAccessDateTime;

    @MetadataProperty(value = "File Creation Date/Time", pattern = "yyyy:MM:dd HH:mm:ssXXX")
    @JsonProperty
    public LocalDateTime fileCreationDateTime;

    @MetadataProperty("File Permissions")
    @JsonProperty
    public String filePermissions;

    @MetadataProperty("File Type")
    @JsonProperty
    public String fileType;

    @MetadataProperty("File Type Extension")
    @JsonProperty
    public String fileTypeExtension;

    @MetadataProperty("MIME Type")
    @JsonProperty
    public String mimeType;

    @MetadataProperty("Major Brand")
    @JsonProperty
    public String majorBrand;

    @MetadataProperty("Minor Version")
    @JsonProperty
    public String minorVersion;

    @MetadataProperty("Compatible Brands")
    @JsonProperty
    public String compatibleBrands;

    @MetadataProperty("Movie Header Version")
    @JsonProperty
    public String movieHeaderVersion;

    @MetadataProperty(value = "Create Date", pattern = "yyyy:MM:dd HH:mm:ss")
    @JsonProperty
    public LocalDateTime createDate;

    @MetadataProperty(value = "Modify Date", pattern = "yyyy:MM:dd HH:mm:ss")
    @JsonProperty
    public LocalDateTime modifyDate;

    @MetadataProperty("Time Scale")
    @JsonProperty
    public Integer timeScale;

    @MetadataProperty("Duration")
    @JsonProperty
    public String duration;

    @MetadataProperty("Preferred Rate")
    @JsonProperty
    public String preferredRate;

    @MetadataProperty("Preferred Volume")
    @JsonProperty
    public String preferredVolume;

    @MetadataProperty("Preview Time")
    @JsonProperty
    public String previewTime;

    @MetadataProperty("Preview Duration")
    @JsonProperty
    public String previewDuration;

    @MetadataProperty("Poster Time")
    @JsonProperty
    public String posterTime;

    @MetadataProperty("Selection Time")
    @JsonProperty
    public String selectionTime;

    @MetadataProperty("Selection Duration")
    @JsonProperty
    public String selectionDuration;

    @MetadataProperty("Current Time")
    @JsonProperty
    public String currentTime;

    @MetadataProperty("Next Track ID")
    @JsonProperty
    public String nextTrackID;

    @MetadataProperty("Track Header Version")
    @JsonProperty
    public String trackHeaderVersion;

    @MetadataProperty(value = "Track Create Date", pattern = "yyyy:MM:dd HH:mm:ss")
    @JsonProperty
    public LocalDateTime trackCreateDate;

    @MetadataProperty(value = "Track Modify Date", pattern = "yyyy:MM:dd HH:mm:ss")
    @JsonProperty
    public LocalDateTime trackModifyDate;

    @MetadataProperty("Track ID")
    @JsonProperty
    public String trackID;

    @MetadataProperty("Track Duration")
    @JsonProperty
    public Duration trackDuration;

    @MetadataProperty("Track Layer")
    @JsonProperty
    public String trackLayer;

    @MetadataProperty("Track Volume")
    @JsonProperty
    public String trackVolume;

    @MetadataProperty("Image Width")
    @JsonProperty
    public Integer imageWidth;

    @MetadataProperty("Image Height")
    @JsonProperty
    public Integer imageHeight;

    @MetadataProperty("Graphics Mode")
    @JsonProperty
    public String graphicsMode;

    @MetadataProperty("Op Color")
    @JsonProperty
    public String opColor;

    @MetadataProperty("Compressor ID")
    @JsonProperty
    public String compressorID;

    @MetadataProperty("Source Image Width")
    @JsonProperty
    public Integer sourceImageWidth;

    @MetadataProperty("Source Image Height")
    @JsonProperty
    public Integer sourceImageHeight;

    @MetadataProperty("X Resolution")
    @JsonProperty
    public Integer xResolution;

    @MetadataProperty("Y Resolution")
    @JsonProperty
    public Integer yResolution;

    @MetadataProperty("Bit Depth")
    @JsonProperty
    public Integer bitDepth;

    @MetadataProperty("Pixel Aspect Ratio")
    @JsonProperty
    public String pixelAspectRatio;

    @MetadataProperty("Video Frame Rate")
    @JsonProperty
    public Float videoFrameRate;

    @MetadataProperty("Matrix Structure")
    @JsonProperty
    public String matrixStructure;

    @MetadataProperty("Media Header Version")
    @JsonProperty
    public String mediaHeaderVersion;

    @MetadataProperty(value = "Media Create Date", pattern = "yyyy:MM:dd HH:mm:ss")
    @JsonProperty
    public LocalDateTime mediaCreateDate;

    @MetadataProperty(value = "Media Modify Date", pattern = "yyyy:MM:dd HH:mm:ss")
    @JsonProperty
    public LocalDateTime mediaModifyDate;

    @MetadataProperty("Media Time Scale")
    @JsonProperty
    public Integer mediaTimeScale;

    @MetadataProperty("Media Duration")
    @JsonProperty
    public Duration mediaDuration;

    @MetadataProperty("Media Language Code")
    @JsonProperty
    public String mediaLanguageCode;

    @MetadataProperty("Handler Description")
    @JsonProperty
    public String handlerDescription;

    @MetadataProperty("Balance")
    @JsonProperty
    public String balance;

    @MetadataProperty("Audio Format")
    @JsonProperty
    public String audioFormat;

    @MetadataProperty("Audio Channels")
    @JsonProperty
    public String audioChannels;

    @MetadataProperty("Audio Bits Per Sample")
    @JsonProperty
    public String audioBitsPer;

    @MetadataProperty("Audio Sample Rate")
    @JsonProperty
    public String audioSampleRate;

    @MetadataProperty("Handler Type")
    @JsonProperty
    public String handlerType;

    @MetadataProperty("Handler Vendor ID")
    @JsonProperty
    public String handlerVendorId;

    @MetadataProperty("Encoder")
    @JsonProperty
    public String encoder;

    @MetadataProperty("Movie Data Size")
    @JsonProperty
    public String movieDataSize;

    @MetadataProperty("Movie Data Offset")
    @JsonProperty
    public String movieDataOffset;

    @MetadataProperty("Avg Bitrate")
    @JsonProperty
    public String avgBitrate;

    @MetadataProperty("Image Size")
    @JsonProperty
    public String imageSize;

    @MetadataProperty("Megapixels")
    @JsonProperty
    public String megapixels;

    @MetadataProperty("Rotation")
    @JsonProperty
    public String rotation;

    private static final Map<String, BiConsumer<Metadata, String>> setters = new HashMap<>();

    static {
        for (Field field : Metadata.class.getFields()) {
            MetadataProperty annotation = field.getAnnotation(MetadataProperty.class);
            String pattern = annotation.pattern();
            final DateTimeFormatter formatter = pattern.length() > 0 ? ofPattern(pattern) : null;
            switch (field.getType().getSimpleName()) {
                case "LocalDateTime":
                    setters.put(annotation.value(), (metadata, text) -> {
                        if (!text.startsWith("0000")) try {
                            field.set(metadata, LocalDateTime.parse(text, ofNullable(formatter).orElse(ISO_LOCAL_DATE_TIME)));
                        } catch (Exception e) {
                            log.warn("Unable to set <LocalDateTime> field: " + field.getName() + " to: " + text);
                        }
                    });
                    break;
                case "Duration":
                    setters.put(annotation.value(), (metadata, text) -> {
                        try {
                            String[] split = text.split(":");

                            Duration duration = Duration.ofSeconds(Long.parseLong(split[split.length - 1]))
                                    .plus(Duration.ofMinutes(Long.parseLong(split[split.length - 2])))
                                    .plus(Duration.ofHours(Long.parseLong(split[split.length - 3])));

                            field.set(metadata, duration);
                        } catch (Exception e) {
                            log.warn("Unable to set <LocalTime> field: " + field.getName() + " to: " + text);
                        }
                    });
                    break;
                case "Float":
                    setters.put(annotation.value(), (metadata, text) -> {
                        try {
                            field.set(metadata, Float.parseFloat(text));
                        } catch (Exception e) {
                            log.warn("Unable to set <Float> field: " + field.getName() + " to: " + text);
                        }
                    });
                    break;
                case "Integer":
                    setters.put(annotation.value(), (metadata, text) -> {
                        try {
                            field.set(metadata, Integer.parseInt(text));
                        } catch (Exception e) {
                            log.warn("Unable to set <Integer> field: " + field.getName() + " to: " + text);
                        }
                    });
                    break;
                case "String":
                default:
                    setters.put(annotation.value(), (metadata, text) -> {
                        try {
                            field.set(metadata, text);
                        } catch (Exception e) {
                            log.warn("Unable to set <String> field: " + field.getName() + " to: " + text);
                        }
                    });
            }
        }
    }

    static Optional<Metadata> parseVideoMetadata(Map<String, String> map) {
        if (map == null || map.isEmpty()) {
            return Optional.empty();
        }
        if (map.containsKey("Error")) {
            // throw new ParseException(map.get("Error"), map);
            log.warn("{}: {}", map.get("Error"), map.get("File Name"));
        }
        String mimeType = map.get("MIME Type");
        if (mimeType != null && mimeType.startsWith("video")) {
            return Optional.of(fromMap(map)).map(md -> {
                log.info("Found: {}", Paths.get(md.directory, md.fileName));
                return md;
            });
        } else {
            log.info("Ignored {}: {} {}", mimeType, map.get("File Name"), map.get("File Size"));
            return Optional.empty();
        }
    }

    public static Metadata fromMap(Map<String, String> map) {
        Metadata metadata = new Metadata();
        map.forEach(metadata::set);
        return metadata;
    }

    public void set(String key, String value) {
        try {
            BiConsumer<Metadata, String> setter = setters.get(key);
            if (setter == null) {
                log.warn("No field found for {} : {}", key, value);
            } else {
                setter.accept(this, value);
            }
        } catch (Exception e) {
            log.warn("Unable to assign: {} to: {}", value, key);
        }
    }

    public static class ParseException extends RuntimeException {

        private Map<String, String> properties;

        public ParseException(String message, Map<String, String> properties) {
            super(message);
            this.properties = properties;
        }

        public Map<String, String> getProperties() {
            return properties;
        }
    }

}