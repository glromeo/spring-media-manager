import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Switch} from "react-router";

import Header from "./Header";
import SearchPane from "./SearchPane";
import MediaList from "./MediaList";
import MovieDetails from "./MovieDetails";
import MediaPlayer from "./MediaPlayer";

import {Provider} from "react-redux";
import configureStore from "../../ui/src/redux/store";

import './App.scss';
import logo from "./logo.svg";

const store = configureStore();

export default function App() {

    const [scrollTop, setScrollTop] = useState(0);
    const [listWidth, setListWidth] = useState(window.innerWidth);
    const [paddingTop, setPaddingTop] = useState("28.125vw");

    useEffect(() => {
        let pendingAnimation = false;
        function onScroll({scrollTop}) {
            if (!pendingAnimation) {
                pendingAnimation = true;
                requestAnimationFrame(time => {
                    setScrollTop(window.scrollY);
                    pendingAnimation = false;
                });
            }
        }
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
        }
    }, []);


    return (
        <Provider store={store}>
            <div className="App" style={{paddingTop}}>
                <Router>
                    <div>
                        <Header scrollTop={scrollTop}
                                onResize={({width, height, paddingTop}) => {
                                    setListWidth(width);
                                    setPaddingTop(paddingTop);
                                }}>
                            {({maxHeight}) => (
                                <Switch>
                                    <Route exact path="/" render={() => (
                                        <SearchPane maxHeight={maxHeight}/>
                                    )}/>
                                    <Route exact path="/edit" render={() => (
                                        <SearchPane maxHeight={maxHeight}/>
                                    )}/>
                                    <Route path="/movie/:id" component={MovieDetails}/>
                                    <Route path="/watch/:id" component={MediaPlayer}/>
                                    <Route path="/logo" component={() => (
                                        <div style={{backgroundColor: '#282c34'}}>
                                            <img className="Logo" style={{maxHeight}} src={logo} alt="logo"/>
                                        </div>
                                    )}/>
                                </Switch>
                            )}
                        </Header>
                        <MediaList width={listWidth} editable={false}/>
                    </div>
                </Router>
            </div>
        </Provider>
    );
}
