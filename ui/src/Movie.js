import React, {Component} from 'react';
import Highlighter from "react-highlight-words";

import "./Movie.scss";
import Metadata from "./Metadata";
import TitleAutosuggest from "./TitleAutosuggest";

const EMPTY_ARRAY = [];

class Movie extends Component {

    render() {
        const {media, editable, searchWords = EMPTY_ARRAY} = this.props;
        const {movie, metadata, color, path} = media;
        const style = {backgroundColor: color};

        return (
            <div className="view Movie" style={style}>
                <div className="Poster">
                    <img src={"/api/poster/" + movie.id + "/small"} alt="movie tickets"
                         style={{boxShadow: `3px 3px 6px rgba(0,0,0,0.66)`}}/>
                </div>
                <div className="Details">
                    {editable ? (
                        <div className="Title">
                            <TitleAutosuggest defaultKey={movie.id} defaultValue={movie.title}
                                              onApply={this.props.onChange}/>
                            <div className="ReleaseDate">({movie.release_date && movie.release_date.substring(0, 4)})
                            </div>
                        </div>
                    ) : (
                        <div className="Title">
                            <Highlighter highlightClassName="p-0" searchWords={searchWords}
                                         textToHighlight={movie.title}/>
                            <div className="ReleaseDate">({movie.release_date && movie.release_date.substring(0, 4)})
                            </div>
                        </div>
                    )}
                    <div className="Overview">
                        <div>{movie.overview}</div>
                    </div>
                    <Metadata value={metadata}/>
                    {editable && <div className="Info">
                        <div>{path}</div>
                    </div>}
                </div>
            </div>
        );
    }
}

export default Movie;