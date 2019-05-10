import React, {useEffect, useRef, useState} from 'react';
import {ControlBar, Player} from "video-react";
import {playbackMedia} from "../redux/actions";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {HTTP_HEADERS} from "../util/constants";
import {languages} from "../util/iso639";

import "./MediaPlayer.scss";

function CC() {
    console.log("CC");
    return <div/>
}

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

    const [subtitle, setSubtitle] = useState();

    const startTime = localStorage.getItem(`movie[${movieId}].currentTime`);

    function onTimeUpdate(event) {
        const currentTime = event.currentTarget.currentTime;
        localStorage.setItem(`movie[${movieId}].currentTime`, currentTime);
    }

    const ccRef = useRef(null);

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
                        src={`/api/videos/${encodePath(media)}`}
                        startTime={startTime}
                        onTimeUpdate={onTimeUpdate}>
                    <ControlBar>
                        <Subtitles order={7} selected={subtitle} movie={movie} onChange={setSubtitle}/>
                    </ControlBar>
                    {subtitle && <track kind="captions" srcLang="en-US" label="English" default src={subtitle.src}/>}
                </Player>
            </div>
        </div>
    } else {
        return <div>Loading...</div>
    }
}

function encodePath({path}) {
    return path.substring(3).split("\\").map(p => encodeURIComponent(p)).join("/");
}

/**
 * TODO: Investigate continuous re-rendering
 *
 * @param selected
 * @param movie
 * @param onChange
 * @returns {*}
 * @constructor
 */

function Subtitles({selected, movie, onChange}) {
    const [isOpen, setOpen] = useState();
    const [subtitles, setSubtitles] = useState([]);

    const dropupRef = useRef();

    function closeDropup(e) {
        if (!dropupRef.current.contains(e.target) && isOpen) setOpen(false);
    }

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

        document.addEventListener("mousedown", closeDropup, false);

        return function () {
            document.removeEventListener("mousedown", closeDropup, false);
        }
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
        if (!subtitle.src) {
            const src = `/api/tracks/${movie.id}`;
            await fetch(src, {
                method: "PUT",
                body: JSON.stringify(subtitle),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            subtitle.src = src;
        }
        onChange(subtitle === selected ? null : subtitle);
        setOpen(false);
    }

    return (
        <div ref={dropupRef} className="Subtitles dropup video-react-control video-react-button">
            <i className="Toggle fa fa-cc fa-2x m-2"
               style={{color: selected ? "white" : "rgba(115, 133, 159, 0.5)"}}
               onClick={() => setOpen(!isOpen)}/>
            <div className="dropdown-menu dropdown-menu-right text-white" style={{display: isOpen && "block"}}>
                {subtitles.sort((a, b) => {
                    return a.popularity < b.popularity ? 1 : a.popularity > b.popularity ? -1 : 0;
                }).map(({key, popularity, title, subtitle, languageCode}) => (
                    <button key={key} type="button"
                            className={"dropdown-item d-flex " + (selected === subtitle && "active")}
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
            <div className="Angle" style={{display: isOpen ? "block" : "none"}}/>
        </div>
    )
}

export default withRouter(connect()(MediaPlayer));
