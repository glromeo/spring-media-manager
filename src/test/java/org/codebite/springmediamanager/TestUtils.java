package org.codebite.springmediamanager;

import org.codebite.springmediamanager.media.MediaServiceTest;

import java.io.File;
import java.net.URISyntaxException;
import java.nio.file.Path;

public class TestUtils {
    
    public static Path resourcePath(String name) throws URISyntaxException {
        return new File(MediaServiceTest.class.getResource(name).toURI()).toPath();
    }
}
