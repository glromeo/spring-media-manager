import { configure } from '@storybook/react';

const stories = require.context('../src/stories', true, /\.stories\.jsx?$/);

function loadStories() {
    require('../src/stories/index.js');
    stories.keys().forEach(filename => stories(filename));
}

configure(loadStories, module);