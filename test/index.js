const Router = require('../src/router');
const assert = require('assert');
const axios = require('axios');


describe('Basic functionality', () => {
    let server;
    afterEach(function () {
        server && server.close();
    });

    it('works with simple middleware', async () => {
        const app = new Router();
        app.use((req, res, next) => {
            res.end('Hello, world!');
        });
        server = app.listen(8765)

        const res = await axios.get('http://localhost:8765');
        assert.equal(res.data, 'Hello, world!');
    });

    it('works with simple middleware with path', async () => {
        const app = new Router();
        app.use('/subpath', (req, res, next) => {
            res.end('subpath content');
        });
        server = app.listen(8765)

        const res = await axios.get('http://localhost:8765/subpath');
        assert.equal(res.data, 'subpath content');
    })


    it('works with get method', async () => {
        const app = new Router();
        app.get('/endpoint', (req, res, next) => {
            res.end('get result');
        });
        server = app.listen(8765)

        const res = await axios.get('http://localhost:8765/endpoint');
        assert.equal(res.data, 'get result');
    })

    it('works with post method', async () => {
        const app = new Router();
        app.post('/endpoint', (req, res, next) => {
            res.end('post result');
        });
        server = app.listen(8765)

        const res = await axios.post('http://localhost:8765/endpoint');
        assert.equal(res.data, 'post result');
    })


    it('works with get and post on same endpoint', async () => {
        const app = new Router();
        app.get('/endpoint', (req, res, next) => {
            res.end('get result');
        });
        app.post('/endpoint', (req, res, next) => {
            res.end('post result');
        });
        server = app.listen(8765)

        let res = await axios.get('http://localhost:8765/endpoint');
        assert.equal(res.data, 'get result');

        res = await axios.post('http://localhost:8765/endpoint');
        assert.equal(res.data, 'post result');
    })
});

describe('Middleware chaining', () => {
    let server;
    afterEach(function () {
        server && server.close();
    });

    it('works with a simple middleware', async () => {
        const app = new Router();
        let middlewareCalled = false
        app.use((req, res, next) => {
            middlewareCalled = true
            next()
        });
        app.get('/endpoint', (req, res, next) => {
            res.end('get result');
        });
        server = app.listen(8765)

        let res = await axios.get('http://localhost:8765/endpoint');
        assert.equal(res.data, 'get result');
        assert.equal(middlewareCalled, true)
    })

    it('works with middleware on path', async () => {
        const app = new Router();
        let endpointMiddlewareCalled = false
        let otherMiddlewareCalled = false
        app.use('/endpoint', (req, res, next) => {
            endpointMiddlewareCalled = true
            next()
        });
        app.use('/other-path', (req, res, next) => {
            otherMiddlewareCalled = true
            next()
        });
        app.get('/endpoint', (req, res, next) => {
            res.end('get result');
        });
        server = app.listen(8765)

        let res = await axios.get('http://localhost:8765/endpoint');
        assert.equal(res.data, 'get result');
        assert.equal(endpointMiddlewareCalled, true);
        assert.equal(otherMiddlewareCalled, false);
    })

    it('works with multiple middleware chain', async () => {
        const app = new Router();
        const testdatas = [];
        app.use((req, res, next) => {
            req.testdata = "testdata1"
            next()
        });
        app.use('/endpoint', (req, res, next) => {
            testdatas.push(req.testdata)
            req.testdata = "testdata2"
            next()
        });
        app.use((req, res, next) => {
            testdatas.push(req.testdata)
            res.testdata = "resdata"
            next()
        });
        app.get('/endpoint', (req, res, next) => {
            testdatas.push(res.testdata)
            res.end('get result');
        });
        server = app.listen(8765)

        let res = await axios.get('http://localhost:8765/endpoint');
        assert.equal(res.data, 'get result');
        assert.equal(testdatas.length, 3)
        assert.equal(testdatas[0], 'testdata1')
        assert.equal(testdatas[1], 'testdata2')
        assert.equal(testdatas[2], 'resdata')
    })
})

describe('Error handling', () => {
    let server;
    afterEach(function () {
        server && server.close();
    });

    it('works with a simple error handling', async () => {
        const app = new Router();
        let errorHandlerCalled = false
        app.get('/endpoint', (req, res, next) => {
            next(new Error("error"))
        });
        app.use((err, req, res, next) => {
            errorHandlerCalled = true
            res.end("result from error handler")
        });
        server = app.listen(8765)

        let res = await axios.get('http://localhost:8765/endpoint');
        assert.equal(res.data, 'result from error handler');
        assert.equal(errorHandlerCalled, true)
    })

    it('works with throwing an error', async () => {
        const app = new Router();
        let errorHandlerCalled = false
        app.get('/endpoint', (req, res, next) => {
            throw new Error("error")
        });
        app.use((err, req, res, next) => {
            errorHandlerCalled = true
            res.end("result from error handler")
        });
        server = app.listen(8765)

        let res = await axios.get('http://localhost:8765/endpoint');
        assert.equal(res.data, 'result from error handler');
        assert.equal(errorHandlerCalled, true)
    })

    it('works with a middleware chaining with errors', async () => {
        const app = new Router();
        let errorHandlerCalled = false
        let endpointHandlerCalled = false
        app.use((req, res, next) => {
            next("err1")
        });
        app.get('/endpoint', (req, res, next) => {
            endpointHandlerCalled = true
            res.end("get result")
        });
        app.use((err, req, res, next) => {
            errorHandlerCalled = true
            res.end("result from error handler")
        });
        server = app.listen(8765)

        let res = await axios.get('http://localhost:8765/endpoint');
        assert.equal(res.data, 'result from error handler');
        assert.equal(errorHandlerCalled, true)
        assert.equal(endpointHandlerCalled, false)
    })
})