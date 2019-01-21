import React, {Component} from 'react';
import Highlighter from "react-highlight-words";

import "./Movie.scss";

const EMPTY_ARRAY = [];

class Movie extends Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        let {movie, metadata, searchWords = EMPTY_ARRAY} = this.props;
        return (
            <div className="Movie">
                <div className="Poster">
                    <img src={"/api/poster/" + movie.id + "/small"} alt="movie tickets"
                         style={{boxShadow: "3px 3px 6px gray"}}/>
                </div>
                <div className="Details">
                    <div className="Title">
                        <div><Highlighter
                            highlightClassName="p-0"
                            searchWords={searchWords}
                            textToHighlight={movie.title}
                        /></div>
                        <div>({movie.release_date && movie.release_date.substring(0, 4)})</div>
                    </div>
                    <div className="Overview">
                        <div>{movie.overview}</div>
                    </div>
                    <div className="Info">
                        <div>
                            <span style={{fontWeight: 'normal', marginLeft: 10}}>Type:</span>
                            <span style={{fontWeight: 'bold', marginLeft: 10}}>{metadata.fileType}</span>
                        </div>
                        <div>
                            <span style={{fontWeight: 'normal', marginLeft: 10}}>Duration:</span>
                            <span style={{fontWeight: 'bold', marginLeft: 10}}>{metadata.duration}</span>
                        </div>
                        <div>
                            <span style={{fontWeight: 'normal', marginLeft: 10}}>Size:</span>
                            <span style={{fontWeight: 'bold', marginLeft: 10}}>{metadata.fileSize}</span>
                        </div>
                        <div>
                            <span style={{fontWeight: 'normal', marginLeft: 10}}>Resolution:</span>
                            <span style={{fontWeight: 'bold', marginLeft: 10}}>{metadata.imageSize}</span>
                        </div>
                        <div>
                            <span style={{fontWeight: 'normal', marginLeft: 10}}>Audio:</span>
                            <span style={{
                                fontWeight: 'bold',
                                marginLeft: 10
                            }}>{metadata.audioChannels} CH {metadata.audioSampleRate} Hz</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Movie;