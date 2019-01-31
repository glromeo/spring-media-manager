import React, {Component} from "react";
import Autosuggest from "./components/Autosuggest";
import {HTTP_HEADERS} from "./redux/actions";

class TitleAutosuggest extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            suggestions: []
        };
    }

    componentDidMount() {
        const {defaultValue} = this.props;
        this.searchMovie(defaultValue);
    }

    searchMovie(query) {

        if (query && query.length > 0) {
            this.cancelPendingFetch();
            this.setState({suggestions: []});

            fetch(`/api/search/movie?query=${encodeURIComponent(query)}`, {
                method: "GET",
                headers: HTTP_HEADERS,
                signal: this.pending.signal
            }).then(response => response.json()).then(page => {
                this.setState({
                    suggestions: page.results.map(function ({id, title, release_date}) {
                        return {
                            key: id,
                            value: title,
                            suffix: release_date ? "(" + release_date.substring(0, 4) + ")" : ""
                        }
                    }),
                });
                this.pending = null;
            }).catch(e => console.error.bind(console)); // TODO: Handle this!
        }
    }

    cancelPendingFetch() {
        if (this.pending) {
            this.pending.abort();
        }
        this.pending = new AbortController();
    }

    render() {
        const {defaultKey, defaultValue} = this.props;
        const {suggestions} = this.state;
        return (
            <div className="TitleAutosuggest">
                <Autosuggest placeholder="Title..." defaultKey={defaultKey} defaultValue={defaultValue}
                             suggestions={suggestions}
                             onChange={({value}) => this.searchMovie(value)}
                             onApply={this.props.onApply}
                />
            </div>
        );
    }
}

export default TitleAutosuggest;