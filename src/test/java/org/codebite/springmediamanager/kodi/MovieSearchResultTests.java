package org.codebite.springmediamanager.kodi;

import org.codebite.springmediamanager.movie.kodi.MovieInfo;
import org.junit.Assert;
import org.junit.Test;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.Arrays;

public class MovieSearchResultTests extends Assert {

    @Test
    public void _REC__2007__h264_1080p_AAC_6ch_nfo() throws JAXBException {

        JAXBContext context = JAXBContext.newInstance(MovieInfo.class);
        Unmarshaller unmarshaller = context.createUnmarshaller();
        URL url = getClass().getClassLoader().getResource("kodi/samples/[REC] (2007) h264-1080p AAC-6ch.nfo");
        MovieInfo nfo = (MovieInfo) unmarshaller.unmarshal(url);

        assertEquals("[REC]", nfo.title);
        assertEquals("[REC]", nfo.originalTitle);
        assertEquals("default", nfo.ratings.get(0).name);
        assertEquals(new Float(10), nfo.ratings.get(0).max);
        assertEquals(Boolean.TRUE, nfo.ratings.get(0).isDefault);
        assertEquals(new Float(7.1), nfo.ratings.get(0).value);
        assertEquals(new Integer(1572), nfo.ratings.get(0).votes);
        assertEquals(1, nfo.ratings.size());
        assertEquals("0", nfo.userRating);
        assertEquals("0", nfo.top250);
        assertEquals("A television reporter and cameraman follow emergency workers into a dark apartment building and are quickly locked inside with something terrifying.", nfo.outline);
        assertEquals("A television reporter and cameraman follow emergency workers into a dark apartment building and are quickly locked inside with something terrifying.", nfo.plot);
        assertEquals("One witness. One camera", nfo.tagline);
        assertEquals("75", nfo.runtime);
        assertEquals("http://image.tmdb.org/t/p/w500/lLSXs26iZe0aIzYrobr3FruUG36.jpg", nfo.thumb);
        assertEquals("http://image.tmdb.org/t/p/original/haJIKsWFhOHACq6meNFIxUEouTV.jpg", nfo.fanArt);
        assertEquals("Rated R", nfo.mpaa);
        assertEquals("0", nfo.playCount);
        assertEquals("", nfo.lastPlayed);
        assertEquals("tt1038988", nfo.id);
        assertEquals("unknown", nfo.uniqueId.type);
        assertEquals(Boolean.TRUE, nfo.uniqueId.isDefault);
        assertEquals("tt1038988", nfo.uniqueId.value);
        assertEquals(Arrays.asList("Horror", "Mystery"), nfo.genres);
        assertEquals("Spain", nfo.country);
        assertEquals("[REC] Collection", nfo.set.name);
        assertEquals("Spanish horror film series created by Jaume Balagueró and Paco Plaza, consisting of four movies.  The films center around a viral demonic possession originated by a young girl named Tristana Medeiros who was sexually assaulted by a group of priests. The first two movies are presented in a found footage format, although the last two installments have ventured into traditional cinematography. The series has received high critical acclaim worldwide.", nfo.set.overview);
        assertEquals(Arrays.asList("Jaume Balagueró", "Paco Plaza", "Luis Berdejo"), nfo.credits);
        assertEquals(Arrays.asList("Jaume Balagueró", "Paco Plaza"), nfo.directors);
        assertEquals("2007-04-10", nfo.premiered);
        assertEquals("2007", nfo.year);
        assertEquals("", nfo.status);
        assertEquals("", nfo.code);
        assertEquals("", nfo.aired);
        assertEquals("Filmax", nfo.studio);
        assertEquals("plugin://plugin.video.youtube/?action=play_video&videoid=YQUkX_XowqI", nfo.trailer);

        assertEquals("h264", nfo.fileInfo.streamDetails.video.codec);
        assertEquals(new Float(1.780000), nfo.fileInfo.streamDetails.video.aspect);
        assertEquals(new Integer(1920), nfo.fileInfo.streamDetails.video.width);
        assertEquals(new Integer(1080), nfo.fileInfo.streamDetails.video.height);
        assertEquals(new Integer(4547), nfo.fileInfo.streamDetails.video.durationInSeconds);
        assertEquals("", nfo.fileInfo.streamDetails.video.stereoMode);
        assertEquals("aac", nfo.fileInfo.streamDetails.audioTracks.get(0).codec);
        assertEquals("spa", nfo.fileInfo.streamDetails.audioTracks.get(0).language);
        assertEquals(new Integer(6), nfo.fileInfo.streamDetails.audioTracks.get(0).channels);
        assertEquals("aac", nfo.fileInfo.streamDetails.audioTracks.get(1).codec);
        assertEquals("spa", nfo.fileInfo.streamDetails.audioTracks.get(1).language);
        assertEquals(new Integer(2), nfo.fileInfo.streamDetails.audioTracks.get(1).channels);
        assertEquals(2, nfo.fileInfo.streamDetails.audioTracks.size());
        assertEquals("eng", nfo.fileInfo.streamDetails.subtitles.get(0).language);
        assertEquals("fra", nfo.fileInfo.streamDetails.subtitles.get(1).language);
        assertEquals("por", nfo.fileInfo.streamDetails.subtitles.get(2).language);
        assertEquals("spa", nfo.fileInfo.streamDetails.subtitles.get(3).language);
        assertEquals("swe", nfo.fileInfo.streamDetails.subtitles.get(4).language);
        assertEquals(5, nfo.fileInfo.streamDetails.subtitles.size());
        assertEquals("Manuela Velasco", nfo.actors.get(0).name);
        assertEquals("Ángela Vidal", nfo.actors.get(0).role);
        assertEquals(0, nfo.actors.get(0).order);
        assertEquals("http://image.tmdb.org/t/p/w185/sCZkCryaoVy63fbHCQrfc4q4Pbs.jpg", nfo.actors.get(0).thumbnail);
        assertEquals("Manuel Bronchud", nfo.actors.get(10).name);
        assertEquals("Abuelo", nfo.actors.get(10).role);
        assertEquals(10, nfo.actors.get(10).order);
        assertEquals("http://image.tmdb.org/t/p/w185/2eDk9SMUmlfFgo3LYVYNRw3o8T9.jpg", nfo.actors.get(10).thumbnail);
        assertEquals("Pep Sais", nfo.actors.get(19).name);
        assertEquals("(voice) (uncredited)", nfo.actors.get(19).role);
        assertEquals(19, nfo.actors.get(19).order);
        assertEquals("http://image.tmdb.org/t/p/w185/1mhJXAuuwN0tjFmHpz5QcCnZyfj.jpg", nfo.actors.get(19).thumbnail);
        assertEquals(20, nfo.actors.size());
        assertEquals(new Float(0.0), nfo.resume.position);
        assertEquals(new Float(0.0), nfo.resume.total);
        assertEquals(LocalDateTime.of(2017, 1, 31, 19, 34, 58), nfo.dateAdded);
    }
}
