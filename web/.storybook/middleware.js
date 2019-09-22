const proxy = require('http-proxy-middleware');
const {tmdbSlowDown, tmdbProxy} = require('../middleware/tmdb-proxy');

module.exports = function (app) {
    app.use(tmdbSlowDown);
    app.use(tmdbProxy('/tmdb', '150dc7265c37ec9e671958360d92dcf6'));
    app.use(proxy('/api', {target: 'http://localhost:8080', changeOrigin: true}));
};