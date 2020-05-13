const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/application',
        createProxyMiddleware({
            // add athena back end address
            target: 'http://localhost:28081',
            changeOrigin: true,
        }),
    );

    app.use(
        '/log',
        createProxyMiddleware({
            // add athena back end address
            target: 'http://localhost:28081',
            changeOrigin: true,
        }),
    );

    app.use(
        '/histories',
        createProxyMiddleware({
            // add athena back end address
            target: 'http://localhost:28081',
            changeOrigin: true,
        }),
    );
};