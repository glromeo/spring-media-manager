package org.codebite.springmediamanager.media;

import lombok.extern.slf4j.Slf4j;
import org.codebite.springmediamanager.data.Media;
import org.codebite.springmediamanager.data.mongodb.MediaRepository;
import org.codebite.springmediamanager.data.mongodb.PosterRepository;
import org.codebite.springmediamanager.util.Quantize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.util.*;

import static java.util.Collections.max;
import static java.util.Comparator.comparing;

@Service
@Slf4j
public class PosterService {

    @Autowired
    MediaRepository mediaRepository;

    @Autowired
    PosterRepository posterRepository;

    public Optional<int[][]> palette(long movieId, int size) {
        return posterRepository.findOriginalSizeById(movieId)
            .map(p -> p.original)
            .map(PosterService::toImage)
            .map(image -> quantize(image, size));
    }

    public Optional<int[][]> paletteVertical(long movieId, int size) {
        return posterRepository.findOriginalSizeById(movieId)
            .map(p -> p.original)
            .map(PosterService::toImage)
            .map(image -> quantizeVertically(image, size));
    }

    public void populateMediaColor() {
        List<Media> all = mediaRepository.findAll();
        for (Media media : all) {
            if (media.movie != null) {
                log.info("populating color for: {}", media.movie.title);
                posterDominantColor(media.movie.id).ifPresent(rgb -> media.color = rgb);
            }
        }
        mediaRepository.saveAll(all);
    }

    public void populateMovieColor(Long movieId) {
        posterDominantColor(movieId).ifPresent(rgb -> {
            mediaRepository.findByMovie_Id(movieId).forEach(media -> media.color = rgb);
        });
    }

    private Optional<int[]> posterDominantColor(Long movieId) {
        return posterRepository.findSmallSizeById(movieId)
            .map(p -> p.small)
            .map(PosterService::toImage)
            .map(PosterService::computeDominantColor)
            .map(PosterService::toRGB);
    }

    private static BufferedImage toImage(byte[] bytes) {
        try {
            return ImageIO.read(new ByteArrayInputStream(bytes));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private static int computeDominantColor(BufferedImage image) {
        return maxColor(computeColorMap(image));
    }

    private static Integer maxColor(Map<Integer, Integer> colorMap) {
        return max(colorMap.entrySet(), comparing(Map.Entry::getValue)).getKey();
    }

    private static Map<Integer, Integer> computeColorMap(BufferedImage image) {
        final int height = image.getHeight();
        final int width = image.getWidth();

        Map<Integer, Integer> m = new HashMap<>();
        for (int i = 0; i < width; i++) {
            for (int j = 0; j < height; j++) {
                int rgb = image.getRGB(i, j);
                if (!isGray(rgb)) {
                    m.put(rgb, m.getOrDefault(rgb, 0) + 1);
                }
            }
        }
        if (m.isEmpty()) {
            int rgb = image.getRGB(width / 2, height / 2);
            m.put(rgb, m.getOrDefault(rgb, 0) + 1);
        }
        return m;
    }

    private static Integer computeMaxColor(BufferedImage image, int bands, int band) {
        final int height = image.getHeight();
        final int width = image.getWidth();

        int bandHeight = (int) Math.floor(height/bands);
        int from = band * bandHeight;

        Map<Integer, Integer> m = new HashMap<>();
        for (int i = 0; i < width; i++) {
            for (int j = 0; j < bandHeight; j++) {
                int rgb = image.getRGB(i, from+j);
                if (!isGray(rgb)) {
                    m.put(rgb, m.getOrDefault(rgb, 0) + 1);
                }
            }
        }
        if (m.isEmpty()) {
            int rgb = image.getRGB(width / 2, from + (bandHeight / 2));
            m.put(rgb, m.getOrDefault(rgb, 0) + 1);
        }
        return maxColor(m);
    }

    private static int[] toRGB(int pixel) {
        int red = (pixel >> 16) & 0xff;
        int green = (pixel >> 8) & 0xff;
        int blue = (pixel) & 0xff;
        return new int[]{red, green, blue};
    }

    private static boolean isGray(int pixel) {
        int rgDiff = (pixel >> 16 & 0xFF) - (pixel >> 8 & 0xFF);
        int rbDiff = (pixel >> 16 & 0xFF) - (pixel & 0xFF);
        int tolerance = 10; // Filter out black, white and grays...... (tolerance within 10 pixels)
        return (rgDiff <= tolerance && rgDiff >= -tolerance) || (rbDiff <= tolerance && rbDiff >= -tolerance);
    }

    private static int[][] quantize(BufferedImage image, int maxColors) {
        int[] rgb = Quantize.quantizeImage(getPixels(image), maxColors);
        return Arrays.stream(rgb).mapToObj(PosterService::toRGB).toArray(int[][]::new);
    }

    private static int[][] getPixels(BufferedImage image) {
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

    private static int[][] quantizeVerticallyAlt(BufferedImage image, int bands) {
        int[][] pixels = getPixels(image);
        int bandHeight = (int) Math.floor(pixels.length / bands);
        int[] rgb = new int[bands];
        for (int i = 0; i < bands; i++) {
            int[][] band = new int[bandHeight][];
            System.arraycopy(pixels, i * bandHeight, band, 0, bandHeight);
            rgb[i] = Quantize.quantizeImage(band, 1)[0];
        }
        return Arrays.stream(rgb).mapToObj(PosterService::toRGB).toArray(int[][]::new);
    }

    private static int[][] quantizeVertically(BufferedImage image, int bands) {
        int[][] palette = new int[bands][];
        for (int i = 0; i < bands; i++) {
            palette[i] = toRGB(computeMaxColor(image, bands, i));
        }
        return palette;
    }

}
