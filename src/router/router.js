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

        this.handler = this.handler.bind(this)
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
        this.server = http.createServer(this.handler).listen({ port }, callback)
        return this.server
    }

    address() {
        return this.server.address()
    }

    setDefaultErrorHandler(handler) {
        if (typeof handler !== 'function') {
            throw new Error("Handler must be a function")
        }
        this._default_error_handler = handler
    }

    _addRoute({ path = "*", method = "*", handler }) {
        const route = new Route({ path, handler, method })
        this._routes.push(route)
    }

    handler(req, res) {
        let i = 0;
        const next = (error) => {
            // look for a next route which matches the request
            while (i < this._routes.length && (!error === this._routes[i].isErrorHandler() || !this._routes[i].matches(req))) {
                i++
            }
            // if there are no more routes left
            if (i >= this._routes.length) {
                // if we have an existing error, call the default error handler
                if (error) {
                    this._default_error_handler(error, req, res)
                }
                return
            }
            const route = this._routes[i++]
            try {
                if (error) {
                    route.handle(error, req, res, next)
                } else {
                    route.handle(req, res, next)
                }
            } catch (e) {
                next(e)
            }
        }
        next()
    }
}

module.exports = Router