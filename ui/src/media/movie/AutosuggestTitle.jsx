import React, {useEffect, useState} from "react";
import Autosuggest from "../../components/autosuggest/Autosuggest";
import {HTTP_HEADERS} from "../../util/constants";

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

export default function AutosuggestTitle({query: defaultQuery, movie, timeout = 120000, style, onChange, onSave}) {

    const [query, setQuery] = useState(() => defaultQuery || (movie && movie.title) || "");
    const [suggestions, setSuggestions] = useState([]);
    const [suggestion, setSuggestion] = useState(() => createSuggestion(movie));

    const [alert, setAlert] = useState(false);
    const [pending, setPending] = useState(false);

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
        if (query && query.length > 0) try {
            return searchMovie(query);
        } catch (e) {
            console.log("error searching movie", e);
        }
    }, [query]);

    // console.log("AutosuggestTitle", defaultQuery, query, suggestion);

    return (
        <Autosuggest placeholder="Title..."
                     defaultKey={suggestion.key}
                     defaultValue={defaultQuery}
                     suggestions={suggestions}
                     onChange={({key, value}) => {
                         if (key) {
                             const suggestion = suggestions.find(suggestion => suggestion.key === key);
                             setSuggestion(suggestion);
                             onChange(suggestion.movie);
                         } else {
                             setQuery(value);
                         }
                     }}
                     style={style}>
            {pending && (
                <CSSTransition in={!!pending} timeout={300} classNames="fade" unmountOnExit>
                    <i className={"fa fa-refresh fa-spin fa-fw text-primary"}/>
                </CSSTransition>
            )}
            {alert && (
                <CSSTransition in={alert} timeout={300} classNames="fade" unmountOnExit>
                    <i className={"fa fa-exclamation-triangle text-warning"}
                       onClick={() => {
                           clear();
                           setAlert(false);
                       }}/>
                </CSSTransition>
            )}
            {movie && (
                <CSSTransition in={!!movie} timeout={200} classNames="fade" unmountOnExit>
                    <i className={"fa fa-check text-primary"}
                       onClick={() => onSave(movie)}/>
                </CSSTransition>
            )}
        </Autosuggest>
    )
}
