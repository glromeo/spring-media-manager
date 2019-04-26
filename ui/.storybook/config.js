import {addDecorator, configure} from '@storybook/react';
import {withKnobs} from '@storybook/addon-knobs';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import "../src/index.css";

addDecorator(withKnobs);

configure(function loadStories() {
    const req = require.context('../stories', true, /\.stories\.jsx?$/);
    req.keys().forEach(filename => req(filename));
}, module);
