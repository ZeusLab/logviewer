const {createProxyMiddleware} = require('http-proxy-middleware');

const onApplicationError = function (err, req, res) {
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

const onDateError = function (err, req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json',
    });
    let body = JSON.stringify({
        code: 200,
        message: 'OK',
        data: [
            {
                key: '20200110',
                value: '2020-01-10'
            },
            {
                key: '20200109',
                value: '2020-01-09'
            },
            {
                key: '20200108',
                value: '2020-01-08'
            },
            {
                key: '20200107',
                value: '2020-01-07'
            },
            {
                key: '20200106',
                value: '2020-01-06'
            }
        ],
    });
    res.end(body);
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
                    {
                        key: '20200110',
                        value: '2020-01-10'
                    },
                    {
                        key: '20200109',
                        value: '2020-01-09'
                    },
                    {
                        key: '20200108',
                        value: '2020-01-08'
                    },
                    {
                        key: '20200107',
                        value: '2020-01-07'
                    },
                    {
                        key: '20200106',
                        value: '2020-01-06'
                    }
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

const onLogError = function (err, req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json',
    });
    let body = JSON.stringify({
        code: 200,
        message: 'OK',
        data: [
            {
                id: 1,
                fluentd_time: 1,
                message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            },
            {
                id: 2,
                fluentd_time: 2,
                message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            },
            {
                id: 3,
                fluentd_time: 3,
                message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            },
            {
                id: 4,
                fluentd_time: 4,
                message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
            }
        ],
    });
    res.end(body);
};

const onLogResponse = function (proxyRes, req, res) {
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
                    {
                        id: 1,
                        fluentd_time: 1,
                        message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
                    },
                    {
                        id: 2,
                        fluentd_time: 2,
                        message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
                    },
                    {
                        id: 3,
                        fluentd_time: 3,
                        message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
                    },
                    {
                        id: 4,
                        fluentd_time: 4,
                        message: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
                    }
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
        '/api/tag',
        createProxyMiddleware({
            // add athena back end address
            target: 'http://localhost:28081',
            changeOrigin: true,
            onProxyRes: onApplicationResponse,
            onError: onApplicationError,
        }),
    );

    app.use(
        '/api/logs',
        createProxyMiddleware({
            // add athena back end address
            target: 'http://localhost:28081',
            changeOrigin: true,
            onProxyRes: onLogResponse,
            onError: onLogError,
        }),
    );

    app.use(
        '/api/histories',
        createProxyMiddleware({
            // add athena back end address
            target: 'http://localhost:28081',
            changeOrigin: true,
            onProxyRes: onDateResponse,
            onError: onDateError,
        }),
    );
};