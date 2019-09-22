const expressSlowDown = require('express-slow-down');
const httpProxyMiddleware = require('http-proxy-middleware');

module.exports = {

    tmdbSlowDown: expressSlowDown({
        windowMs: 10 * 1000, // 10 seconds
        delayAfter: 40, // limit each IP to 40 requests per windowMs,
        delayMs: 10 * 1000 / 40
    }),

    tmdbProxy: function (context, apiKey) {

        function stripTmdbContext(path) {
            return path.substring(context.length);
        }

        return httpProxyMiddleware(context, {
            target: 'https://api.themoviedb.org/3',
            changeOrigin: true,
            pathRewrite: function (path) {
                path = stripTmdbContext(path);
                if (path.indexOf('api_key') < 0) {
                    return `${path}${path.indexOf("?") > 0 ? "&" : "?"}api_key=${apiKey}`;
                } else {
                    return path;
                }
            }
        });
    }
};