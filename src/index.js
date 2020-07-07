const Router = require("./router")

const PORT = 8888

const app = new Router()

app.use((req, res, next) => {
    console.log('this is a test middleware')
})

app.use("/sub", (req, res) => {
    console.log("only for /sub")
})

app.get('/', (req, res, next) => {
    res.end("hello get")
})

app.post('/', (req, res) => {
    res.end("hello post")
})

app.get('/error', (req, res) => {
    throw new Error("this is an error")
})

app.use((err, req, res, next) => {
    console.log('error handler', err)
    throw new Error("another error")
})

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`)
})