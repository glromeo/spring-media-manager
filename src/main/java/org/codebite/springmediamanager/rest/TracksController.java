package org.codebite.springmediamanager.rest;

import com.github.wtekiela.opensub4j.response.ServerInfo;
import com.github.wtekiela.opensub4j.response.SubtitleInfo;
import fr.noop.subtitle.model.SubtitleParsingException;
import lombok.extern.slf4j.Slf4j;
import org.apache.xmlrpc.XmlRpcException;
import org.codebite.springmediamanager.data.Movie;
import org.codebite.springmediamanager.data.Track;
import org.codebite.springmediamanager.data.mongodb.TracksRepository;
import org.codebite.springmediamanager.data.tmdb.MovieService;
import org.codebite.springmediamanager.media.TracksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/tracks")
@Slf4j
public class TracksController {

    @Autowired
    private TracksService tracksService;
    @Autowired
    private TracksRepository tracksRepository;
    @Autowired
    private MovieService movieService;

    @GetMapping
    @ResponseBody
    public ServerInfo info() throws XmlRpcException {
        return tracksService.openSubtitlesInfo();
    }

    @PutMapping("/{id}")
    @ResponseBody
    public void putTrack(
        @PathVariable("id") final Long id, @RequestBody SubtitleInfo subtitleInfo
    ) throws IOException, SubtitleParsingException {
        String subtitle = tracksService.get(subtitleInfo);
        Track track = Track.builder()
            .id(id)
            .content(subtitle)
            .build();
        tracksRepository.save(track);
    }

    @GetMapping("/{id}")
    @ResponseBody
    public String getTrack(@PathVariable("id") final Long movieId) {
        return tracksRepository.findById(movieId).map(track -> track.content).orElse(null);
    }

    @GetMapping("/{id}/subtitles")
    @ResponseBody
    public List<SubtitleInfo> movieSubtitles(@PathVariable("id") final Long movieId) throws XmlRpcException {
        Movie movie = movieService.movie(movieId);
        return tracksService.findSubtitles(movie);
    }
}

