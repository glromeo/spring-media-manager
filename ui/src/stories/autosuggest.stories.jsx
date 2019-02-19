import React, {useEffect, useState} from "react";
import {storiesOf} from "@storybook/react";

import Autosuggest from "../components/Autosuggest";
import TitleAutosuggest from "../TitleAutosuggest";
import {HTTP_HEADERS} from "../redux/actions";

function AutosuggestMovie(props) {

    const [query, setQuery] = useState("Automata");
    const [suggestions, setSuggestions] = useState([]);

    let controller;

    function searchMovie() {

        cancelPendingFetch();

        const {signal} = controller = new AbortController();

        if (query && query.length > 0) fetch(`/api/search/movie?query=${encodeURIComponent(query)}`, {
            method: "GET",
            headers: HTTP_HEADERS,
            signal
        }).then(response => response.json()).then(page => {
            let suggestions = page.results.filter(info => info.title).map(info => ({
                key: info.id,
                value: info.title + (info.release_date ? " (" + info.release_date.substring(0, 4) + ")" : "")
            }));
            setSuggestions(suggestions);
            controller = null;
        }).catch(e => console.error.bind(console));

        setSuggestions([]);
    }

    function cancelPendingFetch() {
        if (controller) {
            console.log("aborting previous fetch...");
            controller.abort();
        }
    }

    useEffect(() => {
        searchMovie();
        return cancelPendingFetch;
    }, [query]);

    return <Autosuggest placeholder="Title..." defaultValue={query} suggestions={suggestions}
                        onApply={({key, value}) => {
                            console.log("onApply:", value);
                        }}
                        onChange={setQuery}/>
}

storiesOf('Autosuggest', module)
    .add('autosuggest movie (react hooks version)', () => {
        return (
            <div style={{padding: 20, width: 500, backgroundColor: 'lightgrey'}}>
                <AutosuggestMovie/>
            </div>
        );
    })
    .add('using title autosuggest', () => {
        return (
            <div style={{padding: 20, width: 500, backgroundColor: 'lightgrey'}}>
                <TitleAutosuggest defaultValue={"Automata"}
                                  onApply={({key, value}) => {
                                      console.log("onApply:", value);
                                  }}/>
            </div>
        );
    });