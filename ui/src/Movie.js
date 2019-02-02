import React, {Component} from 'react';
import {NavLink, withRouter} from 'react-router-dom';
import Highlighter from "react-highlight-words";

import "./Movie.scss";
import Metadata from "./Metadata";
import TitleAutosuggest from "./TitleAutosuggest";
import {playbackMovie} from "./redux/actions";
import {connect} from "react-redux";

const EMPTY_ARRAY = [];

class Movie extends Component {


    constructor(props, context) {
        super(props, context);
        this.state = {
            posterVisibility: "hidden"
        };
        this.posterLoad = this.posterLoad.bind(this);
        this.posterError = this.posterError.bind(this);
    }

    posterLoad() {
        this.setState({posterVisibility: "visible"})
    }

    posterError() {

    }

    render() {
        const {media, editable, searchWords = EMPTY_ARRAY} = this.props;
        const {movie, metadata, color, path} = media;
        const style = {backgroundColor: color};
        const {posterVisibility} = this.state;
        return (
            <div className={"Movie" + (editable ? " Edit" : "")} style={style}>
                <div className="Poster">
                    {posterVisibility==="hidden" && <div className="lds-roller">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>}
                    <img src={"/api/poster/" + movie.id + "/small"} alt="poster"
                         style={{visibility: posterVisibility}}
                         onLoad={this.posterLoad}
                         onError={this.posterError}/>
                    <NavLink className="Play fa fa-play-circle-o" to={`/watch/${movie.id}`} onClick={e=>e.stopPropagation()}/>
                </div>
                <div className="Title">
                    {editable ? (
                        <TitleAutosuggest defaultKey={movie.id} defaultValue={movie.title}
                                          onApply={this.props.onChange}/>
                    ) : (
                        <Highlighter highlightClassName="p-0" searchWords={searchWords}
                                     textToHighlight={movie.title}/>
                    )}
                </div>
                <div className="ReleaseDate">({movie.release_date && movie.release_date.substring(0, 4)})</div>
                <div className="Overview">{movie.overview}</div>
                <Metadata value={metadata}/>
                {editable && <div className="Path">{path}</div>}
            </div>
        );
    }
}

export default withRouter(connect()(Movie));