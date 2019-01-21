import React, {Component} from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {Switch} from "react-router";

import Header from "./Header";
import SearchPane from "./SearchPane";
import Movies from "./Movies";

import {Provider} from "react-redux";
import store from "./redux/store";

import './App.scss';
import logo from "./logo.svg";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {};
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
        let {listWidth, headerHeight, scrollTop} = this.state;
        return (
            <Provider store={store}>
                <div className="App" style={{paddingTop: '50vh'}}>
                    <BrowserRouter>
                        <div>
                            <Header scrollTop={scrollTop}
                                    onResize={({width, height}) => {
                                        this.setState({listWidth: width, headerHeight: height});
                                    }}>
                                {({maxHeight}) => (
                                    <Switch>
                                        <Route exact path="/" render={(props) => (
                                            <SearchPane maxHeight={maxHeight}/>
                                        )}/>
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
                            <Movies width={listWidth}/>
                        </div>
                    </BrowserRouter>
                </div>
            </Provider>
        );
    }
}

export default App;
