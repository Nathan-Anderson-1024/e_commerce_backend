const express = require('express')
const app = express()
const port = 3000
const db = require('./db/index.js')
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}))


app.get('/', (request, response, next) => {
    response.send('Hello World');
})


// Product endpoints

app.get('/products', db.getProducts)

app.get('/products/:id', db.getProductID)

app.post('/products', db.createProduct)

app.put('/products/:id', db.updateProduct)

app.delete('/products/:id', db.deleteProduct)

app.get('/register', db.getUsers)

// register user
app.post('/register', db.registerUser)

app.listen(port, () => {
    console.log(`Listening on port ${port}.`)
})