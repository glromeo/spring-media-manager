package org.codebite.springmediamanager.util;

import org.codebite.springmediamanager.data.Poster;
import org.codebite.springmediamanager.data.mongodb.PosterRepository;
import org.codebite.springmediamanager.media.PosterService;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.AutoConfigureDataMongo;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.util.Arrays;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureDataMongo
public class QuantizeTest {

    @Autowired
    PosterRepository posterRepository;

    @Autowired
    PosterService posterService;

    @Test
    public void colors() throws Exception {
        long movieId = 1892L;
        int maxColors = 4;
        Poster poster = posterRepository.findOriginalSizeById(movieId).get();
        byte[] bytes = poster.original;
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(bytes));
        int[][] pixels = toPixelArray(image);
        int[] palette = Quantize.quantizeImage(pixels, maxColors);
        int[][] expected = Arrays.stream(palette).mapToObj(QuantizeTest::toRGB).toArray(int[][]::new);
        int[][] actual = posterService.palette(movieId, maxColors).orElse(null);
        Assert.assertArrayEquals(expected, actual);
    }

    private static int[] toRGB(int pixel) {
        int red = (pixel >> 16) & 0xff;
        int green = (pixel >> 8) & 0xff;
        int blue = (pixel) & 0xff;
        return new int[]{red, green, blue};
    }

    private static int[][] toPixelArray(BufferedImage image) {
        final int width = image.getWidth();
        final int height = image.getHeight();
        int[][] pixels = new int[height][width];
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < width; y++) {
                pixels[x][y] = image.getRGB(x, y);
            }
        }
        return pixels;
    }
}
