
const httpMethods = ["GET", "POST", "PUT", "DELETE"];

class Route {
    constructor({ path, method, handler }) {
        if (typeof path !== 'string') {
            throw new Error("Path must be a string")
        }
        if (method !== "*" && !httpMethods.includes(method)) {
            throw new Error("Method mus be on of the following: " + httpMethods)
        }
        if (typeof handler !== 'function') {
            throw new Error("Handler must be a function")
        }
        this.path = path;
        this.method = method;
        this.handler = handler;
    }

    isErrorHandler() {
        // check if number of arguments is 4 (err, req, res, next)
        return this.handler.length === 4
    }

    matches(request) {
        // if path matches and method metches
        return (this.path === '*' || this.path === request.url)
            && (this.method === '*' || this.method === request.method)
    }

    handle(...args) {
        this.handler(...args)
    }
}

module.exports = Route