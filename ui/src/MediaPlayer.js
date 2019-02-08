import React, {Component} from 'react';
import {Player} from "video-react";

import "./MediaPlayer.scss";
import {HTTP_HEADERS, playbackMedia} from "./redux/actions";
import {connect} from "react-redux";
import {withRouter} from "react-router";

class MediaPlayer extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        this.fetchMovie(this.props.match.params.id);
    }


    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !this.state.movie || nextProps.match.params.id !== this.state.movie.id;
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        const movieId = nextProps.match.params.id;
        if (movieId !== this.props.match.params.id) {
            this.fetchMovie(movieId);
        }
    }

    fetchMovie(movieId) {
        const {dispatch} = this.props;
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
            dispatch(playbackMedia(movie, media));
            this.setState({movie, media});
        }).catch(e => console.error.bind(console)); // TODO: Handle this!
    }

    render() {
        const {movie, media} = this.state;
        return movie ? (
            <div className="MediaPlayer" style={{backgroundColor: `rgb(${media.color[0]},${media.color[1]},${media.color[2]})`}}>
                <div className="PlayerContainer">
                    <Player playsInLine={true} autoPlay={true}
                            poster={"/api/poster/" + movie.id + "/large"}
                            src={"http://192.168.1.11:8800/" + this.mediaFile(media.path)}
                    />
                </div>
            </div>
        ) : (
            <div>Loading...</div>
        );
    }

    mediaFile(path) {
        return path.substring(3).split("\\").map(p => encodeURIComponent(p)).join("/");
    }
}

export default withRouter(connect()(MediaPlayer));