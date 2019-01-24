import React from 'react';

import "../index";

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {linkTo} from '@storybook/addon-links';

import {Button, Welcome} from '@storybook/react/demo';

import Dropdown from "../components/Dropdown";
import Autosuggest from "../components/Autosuggest";
import {HTTP_HEADERS} from "../redux/actions";

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')}/>);

storiesOf('Button', module)
    .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
    .add('with some emoji', () => (
        <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
        </Button>
    ));

storiesOf('Dropdown', module)
    .add('simple', () => (
        <div style={{padding: 20}}>
            <Dropdown>Simple</Dropdown>
        </div>
    ));

let controller = new AbortController();

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

    searchMovie(query) {
        if (this.state.fetching) {
            console.log("abort previous fetch...");
            controller.abort();
            controller = new AbortController();
        }
        if (query && query.length > 0) fetch(`/api/search/movie?query=${encodeURIComponent(query)}`, {
            method: "GET",
            headers: HTTP_HEADERS,
            signal: controller.signal
        }).then(response => response.json()).then(page => {
            let suggestions = page.results.filter(info => info.title).map(info => ({
                key: info.id,
                value: info.title + (info.release_date ? " (" + info.release_date.substring(0, 4) + ")" : "")
            }));
            this.setState({defaultValue: suggestions[0].text, suggestions, fetching: false});
        }).catch(e => console.error.bind(console));
        this.setState({suggestions: [], fetching: true});
    }

    render() {
        const {value, suggestions, fetching} = this.state;
        return (
            <div style={{padding: 20, width: 250}}>
                <Autosuggest placeholder="Title..." value={value} suggestions={suggestions} onApply={({key, value}) => {
                    console.log("onApply:", value);
                    this.setState({value});
                }} onChange={({query}) => this.searchMovie(query)} fetching={fetching}/>
            </div>
        );
    }
}

storiesOf('Autosuggest', module).add('simple', () => <AutosuggestWrapper/>);