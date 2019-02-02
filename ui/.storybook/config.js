import { configure } from '@storybook/react';

function loadStories() {
  require('../src/stories/index.stories');
  const req = require.context('../src/stories', true, /\.stories\.js$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
