import React from "react";
import {storiesOf} from "@storybook/react";

import Autosuggest from "../components/Autosuggest";
import TitleAutosuggest from "../TitleAutosuggest";
import {HTTP_HEADERS} from "../redux/actions";

class AutosuggestWrapper extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            value: "Automata",
            suggestions: []
        };
    }

    componentDidMount() {
        this.searchMovie(this.state.value);
    }

    componentWillUnmount() {
        this.cancelPendingFetch();
    }

    searchMovie(query) {

        this.cancelPendingFetch();
        this.setState({suggestions: []});

        if (query && query.length > 0) fetch(`/api/search/movie?query=${encodeURIComponent(query)}`, {
            method: "GET",
            headers: HTTP_HEADERS,
            signal: this.controller.signal
        }).then(response => response.json()).then(page => {
            let suggestions = page.results.filter(info => info.title).map(info => ({
                key: info.id,
                value: info.title + (info.release_date ? " (" + info.release_date.substring(0, 4) + ")" : "")
            }));
            this.setState({suggestions});
            this.controller = null;
        }).catch(e => console.error.bind(console));
    }

    cancelPendingFetch() {
        if (this.controller) {
            console.log("abort previous fetch...");
            this.controller.abort();
        }
        this.controller = new AbortController();
    }

    render() {
        const {value, suggestions} = this.state;
        return (
            <div style={{padding: 20, width: 250}}>
                <Autosuggest placeholder="Title..." defaultValue={value} suggestions={suggestions}
                             onApply={({key, value}) => {
                                 console.log("onApply:", value);
                             }}
                             onChange={({value}) => this.searchMovie(value)}
                />
            </div>
        );
    }
}

storiesOf('Autosuggest', module).add('simple', () => <AutosuggestWrapper/>);

storiesOf('TitleAutosuggest', module).add('simple', () => <TitleAutosuggest defaultValue={"Automata"}
                                                                            onApply={({key, value}) => {
                                                                                console.log("onApply:", value);
                                                                            }} />);