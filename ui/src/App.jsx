import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import MediaList from "./containers/MediaList";
import Header from "./Header";
import {Provider} from "react-redux";

import './App.scss';

import configureStore from "../../ui/src/redux/store";

const store = configureStore();

export default function App() {

    return (
        <Provider store={store}>
            <div className="App">
                <Router>
                    <MediaList header={Header} editable={false}/>
                </Router>
            </div>
        </Provider>
    )
}
