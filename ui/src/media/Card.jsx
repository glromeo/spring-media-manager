import React, {useState} from 'react';
import {connect} from "react-redux";
import {Movie} from "./movie/Movie";
import Metadata from "./Metadata";
import AutosuggestTitle from "./movie/AutosuggestTitle";
import {HTTP_HEADERS} from "../util/constants";

import "./Card.scss";

function extractTitle({movie, path}) {
    if (movie) {
        return movie.title;
    }
    path = path.substring(path.lastIndexOf("\\"));
    let end = path.search(/\d\d\d\d/);
    if (end) {
        path = path.substring(0, end);
    }
    return path.replace(/\W/g, " ").trim();
}

export function Card({search, media, edit, onChange}) {

    const [title, setTitle] = useState(() => extractTitle(media));
    const [loading, setLoading] = useState(false);

    async function scrape({id, title}) {
        setTitle(title);
        if (id) try {
            setLoading(true);
            const headers = HTTP_HEADERS;
            const [movie] = await Promise.all([
                fetch(`/api/movie/${id}`, {method: "GET", headers}).then(response => response.json()),
                fetch(`/api/poster/fetch/${id}`, {method: "POST", headers})
            ]).catch(console.log);
            setTitle(movie.title);
            if (onChange) {
                const rgb = media.color;
                onChange({...media, movie, draft: true, color: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.5)`});
            }
            setLoading(false);
        } catch (e) {
            console.log("error scraping, this might be safely ignored", e);
        }
    }

    async function save({id}) {
        if (id) {
            const data = {...media, color: [], draft: false};
            setLoading(true);
            const body = JSON.stringify(data);
            await fetch(`/api/media/${id}`, {
                method: "PUT",
                headers: {...HTTP_HEADERS, 'Content-Type': 'application/json'},
                body
            });
            setLoading(false);
            onChange(data);
        }
    }

    const style = {backgroundImage: `linear-gradient(to bottom right, ${media.colorLight}, ${media.colorDark})`};
    return (
        <div className="Card">
            {media.movie ? (
                <Movie movie={media.movie} edit={edit}
                       style={style}
                       searchWords={search.words}
                       onChange={scrape}
                       onSave={save}>
                    <Metadata value={media.metadata}/>
                </Movie>
            ) : (
                <div className="Unknown">
                    <div className="Background"/>
                    <div className="Letter" style={{backgroundColor: media.color}}>
                        {loading
                            ? <i className="fa fa-spinner fa-pulse fa-fw"/>
                            : <span>{media.path.charAt(3) || '?'}</span>
                        }
                    </div>
                    <div className="Title">
                        <AutosuggestTitle query={title} onChange={scrape}/>
                    </div>
                    <Metadata value={media.metadata}/>
                    <div className="Path">{media.path}</div>
                </div>
            )}
        </div>
    );
}

export default connect(state => {
    return {
        search: state.search
    }
})(Card);