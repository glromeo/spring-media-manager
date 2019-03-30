import React, {useEffect, useState} from "react";
import {storiesOf} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import Autosuggest from "../src/components/autosuggest/Autosuggest";
import AutosuggestTitle from "../src/containers/AutosuggestTitle";
import {text} from "@storybook/addon-knobs";

storiesOf("Autosuggest", module)

    .add("autosuggest movie (tmbd api)", () => {

        function AutosuggestMovie({query}) {

            const [suggestions, setSuggestions] = useState([]);
            const [selected, setSelected] = useState();

            function searchMovie(query) {
                if (query && query.length > 0) {
                    fetch("https://api.themoviedb.org/3/search/movie" +
                        "?query=" + encodeURIComponent(query) +
                        "&api_key=150dc7265c37ec9e671958360d92dcf6" +
                        "&page=1")
                        .then(response => response.json())
                        .then(page => {
                            let suggestions = page.results.filter(info => info.title).map(info => ({
                                key: info.id,
                                value: info.title,
                                suffix: info.release_date ? " (" + info.release_date.substring(0, 4) + ")" : ""
                            }));
                            setSuggestions(suggestions);
                        });
                }
            }

            useEffect(() => {
                searchMovie(query);
            }, [query]);

            return <Autosuggest style={{minWidth: 250}}
                                placeholder="Title..."
                                defaultKey={selected}
                                defaultValue={query}
                                suggestions={suggestions}
                                onChange={({key, value}) => {
                                    if (key) {
                                        setSelected(key);
                                        action("selected")({key, value});
                                    } else {
                                        searchMovie(value);
                                    }
                                }}
                                maxHeight={200}/>
        }

        return (
            <AutosuggestMovie query={text("title", "Automata")}/>
        );
    })

    .add("autosuggest title (spring-media-manager)", () => {
        return (
            <AutosuggestTitle style={{minWidth: 250}} query={text("title", "Automata")} onChange={(movie) => action("movie:", movie)}/>
        );
    })