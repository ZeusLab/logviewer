const {createProxyMiddleware} = require('http-proxy-middleware');

const onTagError = function (err, req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json',
	});
	let body = JSON.stringify({
		code: 200,
		message: 'OK',
		data: [
			'application 1',
			'application 2',
			'application 3'
		],
	});
	res.end(body);
};
const onTagResponse = function (proxyRes, req, res) {
	let _write = res.write;
	let output = undefined;
	proxyRes.on('data', function (data) {
		data = data.toString('utf-8');
		output = JSON.parse(data);
		if (output.code === 200) {
			if (!output.data || output.data.length === 0) {
				output = {
					code: 200,
					message: 'OK',
					data: [
						'application 1',
						'application 2',
						'application 3'
					],
				};
			}
		} else {
			output = {
				code: 200,
				message: 'OK',
				data: [
					'application 1',
					'application 2',
					'application 3'
				],
			};
		}
	});
	res.write = function (data) {
		try {
			let body = JSON.stringify(output);
			res.writeHead(200, {
				'Content-Type': 'application/json',
				'Content-Length': body.length,
			});
			_write.call(res, body);
		} catch (err) {
		}
	}
};

module.exports = function (app) {
	app.use(
		'/api/tag',
		createProxyMiddleware({
			// add athena back end address
			target: 'http://localhost:8080',
			changeOrigin: true,
			onProxyRes: onTagResponse,
			onError: onTagError,
		}),
	);
};