const express = require('express')
const app = express()
const port = 3000
const db = require('./db/index.js')

app.get('/', (request, response, next) => {
    response.send('Hello World');
})

app.get('/products', db.getProducts)

app.listen(port, () => {
    console.log(`Listening on port ${port}.`)
})