const {tmdbSlowDown, tmdbProxy} = require('./middleware/tmdb-proxy');

module.exports = function (config) {

    config.devServer.before = function (app, server) {
        app.use(tmdbSlowDown);
        app.use(tmdbProxy('/tmdb', '150dc7265c37ec9e671958360d92dcf6'));
    };

    config.devServer.proxy = [
        {path: '/api/**', target: 'http://localhost:8080', changeOrigin: true}
    ];
}