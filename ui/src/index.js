import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'react-virtualized/styles.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import 'font-awesome/css/font-awesome.min.css';
import 'react-contexify/dist/ReactContexify.min.css';

import "video-react/dist/video-react.css";

import './index.css';

import $ from 'jquery';
import _ from 'lodash';

window.jQuery = window.$ = $;
window.lodash = window._ = _;

ReactDOM.render(React.createElement(App), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
