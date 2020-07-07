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

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`)
})