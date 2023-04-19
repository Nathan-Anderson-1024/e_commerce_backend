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
app.get('/products/category/:categoryID', db.productByCategoryID)
app.get('/products', db.getProducts)

app.get('/products/:id', db.getProductID)

app.post('/products', db.createProduct)

app.put('/products/:id', db.updateProduct)

app.delete('/products/:id', db.deleteProduct)


//get all users
app.get('/user', db.getUsers)

//get user by ID
app.get('/user/:id', db.userById)

// Update user
app.put('/user/:id', db.updateUser)

// Delete user
app.delete('/user/:id', db.deleteUser)

// register user
app.post('/register', db.createUser)

app.listen(port, () => {
    console.log(`Listening on port ${port}.`)
})