import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Switch} from "react-router";

import SearchPane from "./containers/SearchPane";
import MediaList from "./containers/MediaList";
import MovieDetails from "./MovieDetails";
import MediaPlayer from "./MediaPlayer";

import {Provider} from "react-redux";
import configureStore from "../../ui/src/redux/store";

import './App.scss';
import logo from "./logo.svg";

const store = configureStore();


function Header({width, height}) {
    // console.log("rendering header", width, width * 9 / 16);
    return (
        <Switch key={"header"}>
            <Route exact path="/" render={() => (
                <SearchPane height={width * 9 / 16}/>
            )}/>
            <Route exact path="/edit" render={() => (
                <SearchPane height={width * 9 / 16}/>
            )}/>
            <Route path="/movie/:id" component={MovieDetails}/>
            <Route path="/watch/:id" component={MediaPlayer}/>
            <Route path="/logo" component={() => (
                <div style={{backgroundColor: '#282c34'}}>
                    <img className="Logo" style={{height}} src={logo} alt="logo"/>
                </div>
            )}/>
        </Switch>
    )
}

export default function App() {

    return (
        <Provider store={store}>
            <div className="App">
                <Router>
                    <div>
                        <MediaList header={Header} editable={false}/>
                    </div>
                </Router>
            </div>
        </Provider>
    )
}
