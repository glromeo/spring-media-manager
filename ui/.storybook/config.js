import {addDecorator, configure} from '@storybook/react';
import {withKnobs} from '@storybook/addon-knobs';

addDecorator(withKnobs);

configure(function loadStories() {
    const req = require.context('../stories', true, /\.stories\.jsx?$/);
    req.keys().forEach(filename => req(filename));
}, module);
