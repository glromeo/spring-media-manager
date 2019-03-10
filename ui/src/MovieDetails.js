import React, {Component} from 'react';

import "./MovieDetails.scss";
import Metadata from "./Metadata";
import {HTTP_HEADERS} from "./util/constants";

class Movie extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        const {match} = this.props;
        const {id} = match.params;

        Promise.all([
            fetch(`/api/movie/${id}`, {
                method: "GET",
                headers: HTTP_HEADERS
            }).then(response => response.json()),
            fetch(`/api/media/${id}`, {
                method: "GET",
                headers: HTTP_HEADERS
            }).then(response => response.json())
        ]).then(([movie, media]) => {
            this.setState({movie, media});
        }).catch(e => console.error.bind(console)); // TODO: Handle this!
    }

    render() {
        const {movie, media} = this.state;
        if (!movie) {
            return <div>NOTHING TO SEE HERE!!!</div>;
        }
        const {metadata, color, path} = media;
        const style = {backgroundColor: color};

        return (
            <div className="view Movie" style={style}>
                <div className="Poster">
                    <img src={"/api/poster/" + movie.id + "/small"} alt="movie tickets"
                         style={{boxShadow: `3px 3px 6px rgba(0,0,0,0.66)`}}/>
                </div>
                <div className="Details">
                    <div className="Title">
                        <div>{movie.title}</div>
                        <div className="ReleaseDate">({movie.release_date && movie.release_date.substring(0, 4)})</div>
                    </div>
                    <div className="Overview">
                        <div>{movie.overview}</div>
                    </div>
                    <Metadata value={metadata}/>
                    <div className="Info">
                        <div>{path}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Movie;