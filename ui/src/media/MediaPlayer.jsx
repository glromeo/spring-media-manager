import React, {useEffect, useState} from 'react';
import {Player} from "video-react";
import {playbackMedia} from "../redux/actions";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {HTTP_HEADERS} from "../util/constants";

import "./MediaPlayer.scss";
import {languages} from "../util/iso639";

export function MediaPlayer({match, dispatch, plain = true}) {

    const movieId = match.params.id;
    const [media, setMedia] = useState();
    const [movie, setMovie] = useState();

    useEffect(() => {
        Promise.all([
            fetch(`/api/movie/${movieId}`, {
                method: "GET",
                headers: HTTP_HEADERS
            }).then(response => response.json()),
            fetch(`/api/media/${movieId}`, {
                method: "GET",
                headers: HTTP_HEADERS
            }).then(response => response.json())
        ]).then(([movie, media]) => {
            setMedia(media);
            setMovie(movie);
            dispatch(playbackMedia(movie, media));
        });
    }, [movieId]);

    const [trackUrl, setTrackUrl] = useState();

    if (movie) {
        return <div className="MediaPlayer" style={
            plain ? {
                backgroundColor: `rgba(${media.color[0]},${media.color[1]},${media.color[2]},.9)`
            } : {
                backgroundImage: `url(/api/backdrop/${movie.id}/large)`,
                backgroundPosition: "center",
                backgroundSize: "cover"
            }
        }>
            <div className="PlayerContainer">
                <Player playsInLine={true} autoPlay={false}
                        poster={`/api/poster/${movie.id}/large`}
                        src={`/api/videos/${encodePath(media)}`}>
                    {trackUrl && <track kind="captions" srcLang="en-US" label="English" default src={trackUrl}/>}
                </Player>
            </div>
            <Subtitles movie={movie} onChange={setTrackUrl}/>
        </div>
    } else {
        return <div>Loading...</div>
    }
}

function encodePath({path}) {
    return path.substring(3).split("\\").map(p => encodeURIComponent(p)).join("/");
}

function Subtitles({movie, onChange}) {
    const [isOpen, setOpen] = useState();
    const [subtitles, setSubtitles] = useState([]);
    useEffect(() => {
        fetch(`/api/tracks/${movie.id}/subtitles`).then(response => response.json()).then(list => {
            const maxDownloadsNo = list.reduce((value, subtitle) => Math.max(value, Number(subtitle.downloadsNo)), 0);
            setSubtitles(list.map(subtitle => ({
                key: subtitle.id,
                popularity: 100 * Number(subtitle.downloadsNo) / maxDownloadsNo,
                title: subtitle.fileName.substring(0, subtitle.fileName.lastIndexOf(".")),
                languageCode: languages[subtitle.language],
                subtitle
            })));
        }).catch(console.error);
    }, []);

    function colorClass(popularity) {
        if (popularity > 75) {
            return "success"
        } else if (popularity > 50) {
            return "info"
        } else if (popularity > 25) {
            return "warning"
        } else {
            return "danger"
        }
    }

    async function selectSubtitle(subtitle) {
        const src = `/api/tracks/${movie.id}`;
        await fetch(src, {
            method: "PUT",
            body: JSON.stringify(subtitle),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        onChange(src);
        setOpen(false);
    }

    return (
        <div className="dropdown" style={{position: "absolute", top: 70, left: 20}}>
            <button className="btn btn-secondary dropdown-toggle" type="button" onClick={() => setOpen(!isOpen)}>
                Subtitles
            </button>
            <div className="dropdown-menu" style={{display: isOpen && "block"}}>
                {subtitles.sort((a, b) => {
                    return a.popularity < b.popularity ? 1 : a.popularity > b.popularity ? -1 : 0;
                }).map(({key, popularity, title, subtitle, languageCode}) => (
                    <button key={key} className="dropdown-item d-flex" type="button"
                            onClick={() => selectSubtitle(subtitle)}>
                        <span className={`badge badge-pill badge-${colorClass(popularity)}`}
                              style={{
                                  fontSize: ".8em",
                                  textTransform: "uppercase",
                                  margin: "2px 12px 2px 0",
                                  opacity: popularity / 100
                              }}>{languageCode}</span>
                        <div className="flex-fill">{title}</div>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default withRouter(connect()(MediaPlayer));
