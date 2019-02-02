import React, {Component} from 'react';
import {HTTP_HEADERS} from "./redux/actions";

import "./Media.scss";
import Metadata from "./Metadata";
import Movie from "./Movie";
import TitleAutosuggest from "./TitleAutosuggest";

const EMPTY_ARRAY = [];

class Media extends Component {

    constructor(props, context) {
        super(props, context);
        const title = this.extractTitle(props.media);
        this.state = {
            title
        };
    }

    extractTitle(media) {
        if (media.movie) {
            return media.movie.title;
        }
        let path = media.path;
        path = path.substring(path.lastIndexOf("\\"));
        let end = path.search(/\d\d\d\d/);
        if (end) {
            path = path.substring(0, end);
        }
        return path.replace(/\W/g, " ").trim();
    }

    identifyMedia(id, media) {

        if (id) fetch(`/api/movie/${id}`, {
            method: "GET",
            headers: {...HTTP_HEADERS}
        }).then(response => response.json()).then(movie => {
            fetch(`/api/poster/fetch/${id}`, {
                method: "POST",
                headers: {...HTTP_HEADERS}
            }).then(response => {
                this.setState({title: movie.title, loading: false});
                if (this.props.onSave) this.props.onSave({...media, movie, draft: true, color: "gold"});
            });
        }).catch(e => console.error.bind(console)); // TODO: Handle this!
    }

    scrape = ({key, value}) => {
        const {media} = this.props;
        this.setState({title: value, loading: true});
        this.identifyMedia(key, media);
    };

    render() {
        const {media, editable, searchWords = EMPTY_ARRAY} = this.props;
        const {title, loading} = this.state;
        let isUndefined = !media.movie;
        return (
            <div className="Media">
                {media.movie &&
                <Movie media={media} searchWords={searchWords} editable={editable} onChange={this.scrape}/>}
                {isUndefined && <div className="Undefined" style={{backgroundColor: 'lightgray'}}>
                    <div className="Letter" style={{backgroundColor: media.color}}>
                        {loading
                            ? <i className="fa fa-spinner fa-pulse fa-fw"/>
                            : <span>{media.path.charAt(3) || '?'}</span>
                        }
                    </div>
                    <TitleAutosuggest defaultValue={title} onApply={this.scrape}/>
                    <Metadata value={media.metadata}/>
                    <div className="Path">{media.path}</div>
                </div>}
            </div>
        );
    }

}

export default Media;