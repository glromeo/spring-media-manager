import { configure } from '@storybook/react';

function loadStories() {
  require('../src/stories/index.stories.jsx');
  const req = require.context('../src/stories', true, /\.stories\.jsx?$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
