const http = require('http')

const defaultErrorHandler = (req, res) => {
    res.writeHead(500);
    res.end('Internal Server Error');
}

class Router {

    constructor() {
        console.log('router initialized')
        this._routes = []
        this._default_error_handler = defaultErrorHandler
    }

    use(path, fn) {
        console.log('router use')
    }

    get(path, fn) {
        console.log('get', path)
    }

    listen(port, callback) {
        const handler = (req, res) => {
            res.end("hello")
        }
        http.createServer(handler).listen({ port }, callback)
    }
}

module.exports = Router