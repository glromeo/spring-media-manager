package org.codebite.springmediamanager.media;

import org.codebite.springmediamanager.ApplicationProperties;
import org.codebite.springmediamanager.TestUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.*;
import java.net.URISyntaxException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class MetadataServiceTest {

    @Autowired
    MetadataService metadataService;

    @Test
    public void testProcesFile() throws IOException {

        Optional<Metadata> metadata = metadataService.read(
            new File("V:\\55 Steps (2018)\\55 Steps (2018) h264-720p AAC-2ch.mp4").toPath()
        );
        assertTrue(metadata.isPresent());
    }

    @Test(expected = Metadata.ParseException.class)
    public void test55StepsMetadata() throws URISyntaxException, IOException {
        Path path = TestUtils.resourcePath("/exiftool/55steps-metadata.txt");
        try (BufferedReader stdout = new BufferedReader(new InputStreamReader(new FileInputStream(path.toFile())))) {
            metadataService.consumeMetadata(stdout, metadata -> {
                assertEquals("55 Steps (2018) h264-720p AAC-2ch.mp4", metadata.fileName);
                assertEquals(new Integer(1280), metadata.imageWidth);
                assertNull(metadata.createDate);
                assertEquals(LocalDateTime.of(2018, 11, 22, 21, 10, 35), metadata.fileCreationDateTime);
                assertEquals(LocalDateTime.of(2018, 10, 20, 19, 14, 31), metadata.fileModificationDateTime);
            });
        }
    }

    @Autowired
    ApplicationProperties app;

    @Test
    public void testRefresh() throws IOException {
        try (DirectoryStream<Path> paths = Files.newDirectoryStream(Paths.get(app.path))) {
            metadataService.scan(paths).forEach(System.out::println);
        }
    }

}