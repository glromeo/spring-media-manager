import React, {useEffect, useState} from "react";
import {storiesOf} from "@storybook/react";
import {action} from "@storybook/addon-actions";
import Autosuggest from "../src/components/autosuggest/Autosuggest";
import AutosuggestTitle from "../src/media/movie/AutosuggestTitle";
import {boolean, number, text} from "@storybook/addon-knobs";
import {CSSTransition} from "react-transition-group";

storiesOf("Autosuggest", module)

    .add("autosuggest movie (tmbd api)", () => {

        function AutosuggestMovie({query}) {

            const [suggestions, setSuggestions] = useState([]);
            const [selected, setSelected] = useState(null);

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

            const alert = boolean("alert", false);
            const pending = boolean("pending", false);

            return <Autosuggest style={{fontSize: text("font-size", "1em")}}
                                maxWidth={number("max width", 200)}
                                maxHeight={number("max height", 200)}
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
                                maxHeight={200}>
                {pending && (
                    <CSSTransition in={!!pending} timeout={300} classNames="fade" unmountOnExit>
                        <i className={"fa fa-refresh fa-spin fa-fw text-primary"}/>
                    </CSSTransition>
                )}
                {alert && (
                    <CSSTransition in={alert} timeout={300} classNames="fade" unmountOnExit>
                        <i className={"fa fa-exclamation-triangle text-warning"} onClick={action("clear_alert")}/>
                    </CSSTransition>
                )}
            </Autosuggest>
        }

        return (
            <AutosuggestMovie query={text("title", "Automata")}/>
        );
    })

    .add("autosuggest title (spring-media-manager)", () => {
        return (
            <AutosuggestTitle style={{minWidth: 250}} query={text("title", "Automata")}
                              onChange={(movie) => action("movie:", movie)}/>
        );
    })
