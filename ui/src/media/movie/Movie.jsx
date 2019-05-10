import React, {useEffect, useState} from 'react';
import {withRouter} from 'react-router-dom';
import Highlighter from "react-highlight-words";
import AutosuggestTitle from "./AutosuggestTitle";
import {connect} from "react-redux";

import "./Movie.scss";
import {Poster} from "./Poster";
import {HTTP_HEADERS} from "../../util/constants";

const EMPTY_ARRAY = [];

// function Y([R, G, B]) {
//     return 0.299 * R + 0.587 * G + 0.114 * B;
// }

export const Movie = withRouter(connect()(({style, movie, searchWords = EMPTY_ARRAY, edit, onChange, onSave, children}) => {

    const [palette, setPalette] = useState([]);

    // TEMP PALETTE
    useEffect(() => {
        fetch(`/api/poster/${movie.id}/palette-vertical?size=6`, {headers: HTTP_HEADERS})
            .then(res => res.json())
            // .then(palette => palette.sort((p1, p2) => Y(p1) - Y(p2)))
            .then(setPalette)
    }, []);

    const colors = palette.map(([R, G, B]) => `rgba(${R},${G},${B}, .25)`);
    const css = {
        ...style,
        backgroundImage: `radial-gradient(
                circle at top left,
                ${colors[0]},
                transparent ${.33*window.innerWidth}px
            ),
            radial-gradient(
                circle at top,
                ${colors[1]},
                transparent ${.33*window.innerWidth}px
            ),
            radial-gradient(
                circle at top right,
                ${colors[2]},
                transparent ${.33*window.innerWidth}px
            ),
            radial-gradient(
                circle at bottom left,
                ${colors[3]},
                transparent ${.33*window.innerWidth}px
            ),
            radial-gradient(
                circle at bottom,
                ${colors[4]},
                transparent ${.33*window.innerWidth}px
            ),
            radial-gradient(
                circle at bottom right,
                ${colors[5]},
                transparent ${.33*window.innerWidth}px
            )`
    };
    // TEMP PALETTE

    return (
        <div className="Movie" data-id={movie.id} style={css}>
            <Poster movie={movie}/>
            <div className="Title">
                {edit ? (
                    <AutosuggestTitle query={movie.title} movie={movie} onChange={onChange} onSave={onSave}/>
                ) : (
                    <Highlighter highlightClassName="p-0" searchWords={searchWords}
                                 textToHighlight={movie.title}/>
                )}
            </div>
            <div className="ReleaseDate">({movie.release_date && movie.release_date.substring(0, 4)})</div>
            <div className="Info">
                {movie.popularity > 6.66 ?
                    movie.popularity > 3.33 ? (
                        <span className="Popularity">
                                <i className="fa fa-user" aria-hidden="true"/>
                                <i className="fa fa-user" aria-hidden="true"/>
                                <i className="fa fa-user" aria-hidden="true"/>
                            </span>
                    ) : (
                        <span className="Popularity">
                                <i className="fa fa-user" aria-hidden="true"/>
                                <i className="fa fa-user" aria-hidden="true"/>
                            </span>
                    ) : (
                        <span className="Popularity">
                                <i className="fa fa-user" aria-hidden="true"/>
                            </span>
                    )}
                {movie.vote_average > 6.66 ?
                    movie.vote_average > 3.33 ? (
                        <span className="Stars">
                                <i className="fa fa-star" aria-hidden="true"/>
                                <i className="fa fa-star" aria-hidden="true"/>
                                <i className="fa fa-star" aria-hidden="true"/>
                            </span>
                    ) : (
                        <span className="Stars">
                                <i className="fa fa-star" aria-hidden="true"/>
                                <i className="fa fa-star" aria-hidden="true"/>
                            </span>
                    ) : (
                        <span className="Stars">
                                <i className="fa fa-star" aria-hidden="true"/>
                            </span>
                    )}
                <span className="VoteAverage">
                    {movie.vote_average}
                    </span>
                <span className="VoteCount">
                    ({movie.vote_count})
                    </span>
            </div>
            <div className="Overview">{movie.overview}</div>
            {children}
        </div>
    )
}))