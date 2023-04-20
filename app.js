const express = require('express')
const app = express()
const port = 3000
const db = require('./db/index.js')
const bodyParser = require('body-parser');
const passport = require('passport')
const LocalStrategy = require('passport-local')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}))

passport.use(new LocalStrategy(function verify(username, password, cb) {
    db.get('SELECT * FROM users WHERE username = $1', [username], (error, user) => (error, user) => {
        if (error) {
            return cb(err);
        }
        if (!user) {
            return cb(null, false, {message: 'Incorrect username or password.'})
        }
    })
}))

// app.post('/login', (request, response, next) => {
//     const {username, password} = request.body
//     passport.authenticate('local', {failureRedirect: '/login', failureMessage: true}),
//     function (request, response) {
//         response.send(`Successfully logged in as ${username} with password: ${password}`)
//     }
// })


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

// cart routes

app.get('/cart/:id', db.getCartID)

app.post('/cart', db.createCart)

app.put('/cart/:id', db.updateCart)

// orders routes
app.get('/orders', db.getOrders)

app.get('/orders/:id', db.getOrdersByID)

// checkout
app.post('/cart/:cartId/checkout', db.checkoutCart)

app.listen(port, () => {
    console.log(`Listening on port ${port}.`)
})