import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {Media} from "./media/Media";
import {Route, Switch, withRouter} from "react-router";
import {Home} from "./components/svg/Home";
import {MIN_HEIGHT, SearchPanel} from "./search/SearchPanel";
import MovieDetails from "./media/movie/MovieDetails";
import MediaPlayer from "./media/MediaPlayer";
import {Chevron} from "./components/Chevron";
import {searchTorrents} from "./redux/actions";
import {includesTorrents} from "./redux/selectors";
import {unless} from "./util/conditionals";

import {Provider} from "react-redux";
import configureStore from "../../ui/src/redux/store";

import logo from "./logo.svg";
import './App.scss';

export default function App() {
    const store = configureStore();
    return (
        <Provider store={store}>
            <div className="App">
                <Router>
                    <Media edit={false}
                           panel={withRouter(({location, width, height, scrollTop}) => {
                               const panelHeight = Math.min(width / 2.5, height / 2);
                               const sticky = scrollTop >= panelHeight - MIN_HEIGHT;
                               const player = location.pathname.startsWith("/watch");
                               return (
                                   <div className={["Panel", sticky && "sticky", player && "player"].join(" ")}
                                        style={{top: player ? 0 : MIN_HEIGHT - panelHeight}}>
                                       <Switch>
                                           <Route exact path="/" render={() => (
                                               <SearchPanel height={panelHeight} scrollTop={scrollTop}/>
                                           )}/>
                                           <Route exact path="/edit" render={() => (
                                               <SearchPanel height={panelHeight} scrollTop={0}/>
                                           )}/>
                                           <Route path="/movie/:id" component={MovieDetails}/>
                                           <Route path="/watch/:id" component={MediaPlayer}/>
                                           <Route path="/logo" component={() => (
                                               <div style={{backgroundColor: '#282c34'}}>
                                                   <img className="Logo" style={{height: panelHeight}} src={logo}
                                                        alt="logo"/>
                                               </div>
                                           )}/>
                                       </Switch>
                                       <Home/>
                                   </div>
                               )
                           })}
                           footer={unless(includesTorrents(store),
                               <Chevron onClick={() => store.dispatch(searchTorrents())}/>
                           )}/>
                </Router>
            </div>
        </Provider>
    )
}
