import React, {Component} from 'react';
import {Player} from "video-react";

import "./MediaPlayer.scss";
import {HTTP_HEADERS} from "./redux/actions";

class MediaPlayer extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        this.fetchMovie(this.props.match.params.id);
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        const movieId = nextProps.match.params.id;
        if (movieId !== this.props.match.params.id) {
            this.fetchMovie(movieId);
        }
    }

    fetchMovie(movieId) {
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
            this.setState({movie, media});
        }).catch(e => console.error.bind(console)); // TODO: Handle this!
    }

    render() {
        const {movie, media} = this.state;
        return movie ? (
            <div className="MediaPlayer">
                <Player playsInLine={true} autoPlay={true}
                        poster={"/api/poster/" + movie.id + "/large"}
                        src={"http://192.168.1.11:8800/" + this.mediaFile(media.path)}
                />
            </div>
        ) : (
           <div>Loading...</div>
        );
    }

    mediaFile(path) {
        return path.substring(3).split("\\").map(p=>encodeURIComponent(p)).join("/");
    }
}

export default MediaPlayer;