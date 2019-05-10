import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {HTTP_HEADERS} from "../../util/constants";

import "./Details.scss";

const PALETTE_SIZE = 8;

function Y([R, G, B]) {
    return 0.299 * R + 0.587 * G + 0.114 * B;
}

function toRGB([R, G, B]) {
    return `rgb(${R},${G},${B})`;
}

function toRGBA([R, G, B], alpha) {
    return `rgba(${R},${G},${B},${alpha})`;
}

export function Details({media}) {

    if (!media) return null;

    const movie = media.movie;

    const [palette, setPalette] = useState(null);
    useEffect(() => {
        if (movie) fetch(`/api/poster/${movie.id}/palette?size=${PALETTE_SIZE}`, {headers: HTTP_HEADERS})
            .then(res => res.json())
            .then(palette => palette.sort((p1, p2) => Y(p1) - Y(p2)))
            .then(setPalette)
    }, [movie]);

    if (!palette) return null;

    const [R, G, B] = palette[Math.round(palette.length / 2)];
    const height = 400;
    const width = 2.4 * height;

    const color = Y([R, G, B]) < 50 ? "white" : "black";

    const backgroundColor = toRGBA([R, G, B], .75);
    const colors = palette.map(toRGB);
    const backgroundImage = `linear-gradient(to bottom right, ${colors[Math.round(colors.length / 2 + 1)]}, ${colors[Math.round(colors.length / 2 - 1)]})`;

    console.log("backgroundImage:", backgroundImage);

    const {
        fileType,
        duration,
        fileSize,
        imageSize,
        audioChannels,
        audioSampleRate
    } = media.metadata;

    return (
        <div className="Details d-flex"
             style={{
                 width,
                 boxShadow: `1px 1px 5px ${toRGBA(palette[4], .5)}`
             }}>
            <div className="Poster" style={{
                backgroundImage: `url(/api/poster/${movie.id}/large)`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                width: height / 1.5,
                height: height,
                boxShadow: `1px 1px 5px ${toRGBA(palette[2], .5)}`
            }}/>
            <div className="Details flex-fill d-flex flex-column">
                <div className="Title text-white px-4 py-2"
                     style={{
                         backgroundColor: colors[1],
                         boxShadow: `0px 1px 5px ${toRGBA(palette[0], .5)}`,
                         fontSize: height / 12
                     }}>{movie.title} {movie.id}</div>
                <div className="Summary flex-fill px-4 py-2"
                     style={{
                         color,
                         backgroundImage,
                         fontSize: height / 12 / 2
                     }}>
                    {movie.title}
                </div>
                <div className="Metadata d-flex">
                    <div className="FileType">
                        <span>Type:</span>
                        <span>{fileType}</span>
                    </div>
                    <div className="Duration">
                        <span>Duration:</span>
                        <span>{duration}</span>
                    </div>
                    <div className="FileSize">
                        <span>Size:</span>
                        <span>{fileSize}</span>
                    </div>
                    <div className="Resolution">
                        <span>Resolution:</span>
                        <span>{imageSize}</span>
                    </div>
                    <div className="Audio">
                        <span>Audio:</span>
                        <span>{audioChannels} CH {audioSampleRate} Hz</span>
                    </div>
                </div>
            </div>
        </div>
    )
}