import React, {Component} from 'react';
import {HTTP_HEADERS} from "./redux/actions";

const EMPTY_ARRAY = [];

class Media extends Component {

    constructor(props, context) {
        super(props, context);
        const title = this.extractTitle(props.media);
        this.state = {
            title,
            suggestions: [title]
        };
    }

    extractTitle(media) {
        let path = media.path;
        path = path.substring(path.lastIndexOf("\\"));
        let end = path.search(/\d\d\d\d/);
        if (end) {
            path = path.substring(0, end);
        }
        return path.replace(/\W/g, " ");
    }

    onSuggestionsFetchRequested = ({value}) => {
        const {title} = this.state;
        fetch(`/api/search/movie?title=${encodeURIComponent(title)}`, {method: "GET", headers: HTTP_HEADERS})
            .then(response => response.json())
            .then(page => {
                this.setState({
                    suggestions: page.results
                })
            });
    };

    onSuggestionsClearRequested = (value) => {
        this.setState({
            suggestions: []
        })
    };

    getSuggestionValue(movie) {
        return movie.title;
    }

    renderSuggestion = movie => (
        <div>
            {movie.title}
        </div>
    );

    render() {
        const {media, editable, searchWords = EMPTY_ARRAY} = this.props;
        const {movie, metadata, color, path} = media;

        const {suggestions, title} = this.state;

        return (editable||true) ? (
            <div className="Unknown" style={{backgroundColor: 'lightgray'}}>
                <div className="Letter" style={{backgroundColor: color}}>{media.path.charAt(3) || '?'}</div>
                <div className="Info">
                    <div className="Row">
                        <div className="Label">Path:</div>
                        <div className="Value">{media.path}</div>
                    </div>
                    <div className="Row d-flex flex-row">
                        <div className="Label">Title:</div>
                        <div className="Value" style={{flex: "1 1 auto"}}>
                            <input className="form-control" type="text" placeholder="Search movie by title..." defaultValue={title}/>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="Unknown" style={{backgroundColor: 'lightgray'}}>
                <div className="Letter" style={{backgroundColor: color}}>{media.path.charAt(3) || '?'}</div>
                <div className="Info">
                    <div className="Row">
                        <div className="Label">Path:</div>
                        <div className="Value">{media.path}</div>
                    </div>
                    <div className="Row d-flex flex-row">
                        <div className="Label">Title:</div>
                        <div className="Value" style={{flex: "1 1 auto"}}>{title}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Media;