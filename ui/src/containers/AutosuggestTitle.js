import React, {useEffect, useState} from "react";
import Autosuggest from "../components/autosuggest/Autosuggest";
import {HTTP_HEADERS} from "../util/constants";

import "./AutosuggestTitle.scss";
import {CSSTransition} from "react-transition-group";

function createSuggestion(movie = {}) {
    /** @namespace movie.id */
    /** @namespace movie.title */
    /** @namespace movie.release_date */
    return {
        key: movie.id,
        value: movie.title,
        suffix: movie.release_date && "(" + movie.release_date.substring(0, 4) + ")",
        movie
    }
}

export default function AutosuggestTitle({query: initialQuery, movie: defaultMovie, timeout = 120000, style, onChange}) {

    const [query, setQuery] = useState();
    const [suggestions, setSuggestions] = useState();
    const [suggestion, setSuggestion] = useState(createSuggestion(defaultMovie));

    const [alert, setAlert] = useState();
    const [pending, setPending] = useState();

    let fetchTimeout;

    function searchMovie(query) {

        if (pending) {
            clearTimeout(fetchTimeout);
            pending.abort();
        }

        const controller = new AbortController();

        console.log("searching:", `/api/search/movie?query=${encodeURIComponent(query)}`);

        fetch(`/api/search/movie?query=${encodeURIComponent(query)}`, {
            method: "GET",
            headers: HTTP_HEADERS,
            signal: controller.signal
        })
            .then(response => response.json())
            .then(page => {
                setSuggestions(page.results.filter(info => info.title).map(createSuggestion));
            })
            .catch(e => {
                console.error(e);
            })
            .finally(clear);

        setPending(controller);
        fetchTimeout = setTimeout(() => setAlert("timeout"), timeout);

        return clear;
    }

    function clear() {
        clearTimeout(fetchTimeout);
        setTimeout(setPending, 50);
    }

    useEffect(() => {
        if (query && query.length > 0) {
            return searchMovie(query);
        }
    }, [query]);

    console.log("AutosuggestTitle", initialQuery, query, suggestion);

    return (
        <Autosuggest placeholder="Title..."
                     defaultKey={suggestion.key}
                     defaultValue={initialQuery}
                     suggestions={suggestions}
                     onChange={({key, value}) => {
                         if (key) {
                             const suggestion = suggestions.find(suggestion => suggestion.key === key);
                             setSuggestion(suggestion);
                             onChange(suggestion.movie);
                         } else {
                             setQuery(value);
                         }
                     }}>
            {pending && (
                <CSSTransition in={!!pending} timeout={300} classNames="fade" unmountOnExit>
                    <i className={"fa fa-refresh fa-spin fa-fw"}/>
                </CSSTransition>
            )}
            {alert && (
                <CSSTransition in={alert} timeout={300} classNames="fade" unmountOnExit>
                    <i className={"fa fa-exclamation-triangle"} onClick={() => {
                        clear();
                        setAlert(false);
                    }}/>
                </CSSTransition>
            )}
        </Autosuggest>
    )
}
