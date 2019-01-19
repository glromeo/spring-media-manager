package org.codebite.springmediamanager.media;

import org.codebite.springmediamanager.TestUtils;
import org.junit.Test;

import java.io.*;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.Assert.*;

public class MediaServiceTest {

    private MediaService mediaService = new MediaService();

    @Test
    public void testProcesFile() throws IOException {

        Optional<Metadata> metadata = mediaService.read(new File(new File(new File("V:\\"),
                "55 Steps (2018)"),
                "55 Steps (2018) h264-720p AAC-2ch.mp4").toPath());
        assertTrue(metadata.isPresent());
    }

    @Test(expected = Metadata.ParseException.class)
    public void test55StepsMetadata() throws URISyntaxException, IOException {
        Path path = TestUtils.resourcePath("/exiftool/55steps-metadata.txt");
        try (BufferedReader stdout = new BufferedReader(new InputStreamReader(new FileInputStream(path.toFile())))) {
            mediaService.consumeMetadata(stdout, metadata -> {
                assertEquals("55 Steps (2018) h264-720p AAC-2ch.mp4", metadata.fileName);
                assertEquals(new Integer(1280), metadata.imageWidth);
                assertNull(metadata.createDate);
                assertEquals(LocalDateTime.of(2018, 11, 22, 21, 10, 35), metadata.fileCreationDateTime);
                assertEquals(LocalDateTime.of(2018, 10, 20, 19, 14, 31), metadata.fileModificationDateTime);
            });
        }
    }

}