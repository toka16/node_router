const http = require('http')
const Route = require('./route')

const defaultErrorHandler = (err, req, res) => {
    res.writeHead(500);
    res.end('Internal Server Error');
}

class Router {

    constructor() {
        this._routes = []
        this._default_error_handler = defaultErrorHandler
    }

    use(path, handler) {
        if (!handler) {
            handler = path
            path = "*"
        }
        this._addRoute({ path, handler })
    }

    get(path, handler) {
        this._addRoute({ path, handler, method: "GET" })
    }

    post(path, handler) {
        this._addRoute({ path, handler, method: "POST" })
    }

    put(path, handler) {
        this._addRoute({ path, handler, method: "PUT" })
    }

    delete(path, handler) {
        this._addRoute({ path, handler, method: "DELETE" })
    }

    listen(port, callback) {
        http.createServer(this._handler.bind(this)).listen({ port }, callback)
    }

    _addRoute({ path = "*", method = "*", handler }) {
        const route = new Route({ path, handler, method })
        this._routes.push(route)
    }

    _handler(req, res) {
        let error = null;
        for (let route of this._routes) {
            if (!!error === route.isErrorHandler()) {
                if (route.matches(req)) {
                    try {
                        if (error) {
                            route.handle(error, req, res)
                        } else {
                            route.handle(req, res)
                        }
                        error = null
                    } catch (e) {
                        error = e
                    }
                }
            }
        }
        if (error) {
            this._default_error_handler(error, req, res)
        }
    }
}

module.exports = Router