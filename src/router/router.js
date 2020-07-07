const http = require('http')
const Route = require('./route')

const httpMethods = ["GET", "POST", "PUT", "DELETE"];

const defaultErrorHandler = (req, res) => {
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
        if (typeof path !== 'string') {
            throw new Error("Path must be a string")
        }
        if (method !== "*" && !httpMethods.includes(method)) {
            throw new Error("Method mus be on of the following: " + httpMethods)
        }
        if (typeof handler !== 'function') {
            throw new Error("Handler must be a function")
        }
        const route = new Route({ path, handler, method })
        this._routes.push(route)
    }

    _handler(req, res) {
        let error = null;
        for (let route of this._routes) {
            if (route.matches(req)) {
                try {
                    route.handle(req, res)
                } catch (e) {
                    error = e
                }
            }
        }
    }
}

module.exports = Router