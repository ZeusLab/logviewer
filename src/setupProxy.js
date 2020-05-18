const {createProxyMiddleware} = require('http-proxy-middleware');


const onApplicationResponse = function (proxyRes, req, res) {
    let _write = res.write;
    let output = undefined;
    proxyRes.on('data', function (data) {
        data = data.toString('utf-8');
        output = JSON.parse(data);
        if (output.code === 200) {

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
            _write.call(res, body);
        } catch (err) {
        }
    }
};

const onDateResponse = function (proxyRes, req, res) {
    let _write = res.write;
    let output = undefined;
    proxyRes.on('data', function (data) {
        data = data.toString('utf-8');
        output = JSON.parse(data);
        if (output.code === 200) {

        } else {
            output = {
                code: 200,
                message: 'OK',
                data: [
                    '2020-01-10',
                    '2020-01-09',
                    '2020-01-08',
                    '2020-01-07',
                    '2020-01-06',
                    '2020-01-05',
                    '2020-01-04',
                    '2020-01-03',
                    '2020-01-02',
                    '2020-01-01'
                ],
            };
        }
    });
    res.write = function (data) {
        try {
            let body = JSON.stringify(output);
            _write.call(res, body);
        } catch (err) {
        }
    }
};

module.exports = function (app) {
    app.use(
        '/application',
        createProxyMiddleware({
            // add athena back end address
            target: 'http://localhost:28081',
            changeOrigin: true,
            onProxyRes: onApplicationResponse,
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
            onProxyRes: onDateResponse,
        }),
    );
};