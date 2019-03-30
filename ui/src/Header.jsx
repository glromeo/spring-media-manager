import {Route, Switch, withRouter} from "react-router";
import SearchPane from "./containers/SearchPane";
import MovieDetails from "./MovieDetails";
import MediaPlayer from "./MediaPlayer";
import logo from "./logo.svg";
import React from "react";

import './Header.scss';

export default withRouter(function ({location, width, height, scrollTop}) {

    const player = location.pathname.startsWith("/watch");

    const topHeight = width * 9 / 16;

    return (
        <div className={"Header" + (scrollTop > 0 ? " scrolling" : "") + (player ? " player" : "")}
             style={{top: 68 - topHeight}}>
            <Switch>
                <Route exact path="/" render={() => (
                    <SearchPane height={topHeight} scrollTop={scrollTop}/>
                )}/>
                <Route exact path="/edit" render={() => (
                    <SearchPane height={topHeight} scrollTop={0}/>
                )}/>
                <Route path="/movie/:id" component={MovieDetails}/>
                <Route path="/watch/:id" component={MediaPlayer}/>
                <Route path="/logo" component={() => (
                    <div style={{backgroundColor: '#282c34'}}>
                        <img className="Logo" style={{height: topHeight}} src={logo} alt="logo"/>
                    </div>
                )}/>
            </Switch>
        </div>
    )
});
