const Router = require("./router")

const PORT = 8888

const app = new Router()

app.use((req, res, next) => {
    console.log('this is a test middleware')
    next()
})

app.get('/', (req, res, next) => {
    console.log('get /')
    res.send("hello world")
})

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`)
})