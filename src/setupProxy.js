const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function (app) {
	app.use(
		'/',
		createProxyMiddleware({
			// add athena back end address
			target: 'http://localhost:20010',
			changeOrigin: true,
		}),
	);
};