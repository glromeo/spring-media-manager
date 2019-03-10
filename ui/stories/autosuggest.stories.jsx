import React, {useEffect, useState} from "react";
import {storiesOf} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import Autosuggest from "../src/components/autosuggest/Autosuggest";
import AutosuggestTitle from "../src/containers/AutosuggestTitle";
import {text} from "@storybook/addon-knobs";

storiesOf("Autosuggest", module)

    .add("autosuggest movie (tmbd api)", () => {

        function AutosuggestMovie(props) {

            const [query, setQuery] = useState(text("title", "Automata"));
            const [suggestions, setSuggestions] = useState([]);

            let controller;

            function searchMovie() {

                cancelPendingFetch();

                const {signal} = controller = new AbortController();

                if (query && query.length > 0) {
                    fetch("https://api.themoviedb.org/3/search/movie" +
                        "?query=" + encodeURIComponent(query) +
                        "&api_key=150dc7265c37ec9e671958360d92dcf6" +
                        "&page=1", {signal})
                        .then(response => response.json())
                        .then(page => {
                            let suggestions = page.results.filter(info => info.title).map(info => ({
                                key: info.id,
                                value: info.title + (info.release_date ? " (" + info.release_date.substring(0, 4) + ")" : "")
                            }));
                            setSuggestions(suggestions);
                            controller = null;
                        }).catch(e => console.error.bind(console));
                }

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
                                onApply={({key, value}) => action("onApply:", value)}
                                onChange={setQuery}/>
        }

        return (
            <AutosuggestMovie/>
        );
    })

    .add("autosuggest title (spring-media-manager)", () => {
        return (
            <AutosuggestTitle defaultValue={text("title", "Automata")} onApply={(options) => action("onApply:", options)}/>
        );
    });