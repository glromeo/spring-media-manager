import React, {Component} from 'react';

import "./Media.scss";
import Metadata from "./Metadata";
import Movie from "./Movie";
import AutosuggestTitle from "../../ui/src/containers/AutosuggestTitle";
import {HTTP_HEADERS} from "./util/constants";

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
            headers: HTTP_HEADERS
        }).then(response => response.json()).then(movie => {
            fetch(`/api/poster/fetch/${id}`, {
                method: "POST",
                headers: HTTP_HEADERS
            }).then(() => {
                this.setState({title: movie.title, loading: false});
                if (this.props.onSave) this.props.onSave({...media, movie, draft: true, color: "gold"});
            });
        }).catch(() => console.error.bind(console)); // TODO: Handle this!
    }

    scrape = ({id, title}) => {
        const {media} = this.props;
        this.setState({title, loading: true});
        this.identifyMedia(id, media);
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
                    <AutosuggestTitle query={title} onChange={this.scrape}/>
                    <Metadata value={media.metadata}/>
                    <div className="Path">{media.path}</div>
                </div>}
            </div>
        );
    }

}

export default Media;