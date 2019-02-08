import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Switch} from "react-router";

import Header from "./Header";
import SearchPane from "./SearchPane";
import MediaList from "./MediaList";

import {Provider} from "react-redux";
import store from "./redux/store";

import './App.scss';
import logo from "./logo.svg";
import MovieDetails from "./MovieDetails";
import MediaPlayer from "./MediaPlayer";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playback:{}
        };
        this.onScroll = this.onScroll.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScroll);
    }

    onScroll({scrollTop}) {
        if (!this.pendingAnimation) {
            this.pendingAnimation = true;
            requestAnimationFrame(time => {
                this.setState({scrollTop: window.scrollY});
                this.pendingAnimation = false;
            });
        }
    };

    render() {
        const {listWidth, scrollTop, paddingTop} = this.state;
        return (
            <Provider store={store}>
                <div className="App" style={{paddingTop: paddingTop || "28.125vw"}}>
                    <Router>
                        <div>
                            <Header scrollTop={scrollTop}
                                    onResize={({width, height, paddingTop}) => {
                                        this.setState({listWidth: width, paddingTop: paddingTop});
                                    }}>
                                {({maxHeight}) => (
                                    <Switch>
                                        <Route exact path="/" render={(props) => (
                                            <SearchPane maxHeight={maxHeight}/>
                                        )}/>
                                        <Route exact path="/edit" render={(props) => (
                                            <SearchPane maxHeight={maxHeight}/>
                                        )}/>
                                        <Route path="/movie/:id" component={MovieDetails}/>
                                        <Route path="/watch/:id" component={MediaPlayer}/>
                                        <Route path="/logo" component={() => (
                                            <div style={{
                                                backgroundColor: '#282c34'
                                            }}>
                                                <img className="Logo" style={{maxHeight}} src={logo} alt="logo"/>
                                            </div>
                                        )}/>
                                    </Switch>
                                )}
                            </Header>
                            <Switch>
                                <Route path="/">
                                    <MediaList width={listWidth} editable={false}/>
                                </Route>
                                <Route exact path="/edit">
                                    <MediaList width={listWidth} editable={true}/>
                                </Route>
                            </Switch>
                        </div>
                    </Router>
                </div>
            </Provider>
        );
    }
}

export default App;
