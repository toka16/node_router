class Route {
    constructor({ path, method, handler }) {
        this.path = path;
        this.method = method;
        this.handler = handler;
    }

    matches(request) {
        return (this.path === '*' || this.path === request.url)
            && (this.method === '*' || this.method === request.method)
    }

    handle(req, res, next) {
        this.handler(req, res, next)
    }
}

module.exports = Route