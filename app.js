const express = require('express')
const app = express()
const port = 3000
const db = require('./db/index.js')
const bodyParser = require('body-parser');
const passport = require("passport");
require("./db/passportConfig.js")(passport);
const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
    info: {
      title: 'Node Swagger API',
      version: '1.0.0',
      description: 'Demonstrating how to describe a RESTful API with Swagger',
    },
    host: 'localhost:3000',
    basePath: '/',
};
  
  // options for the swagger docs
const options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./routes/*.js'],
};
  
  // initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}))



app.post(
    "/login",
    passport.authenticate("local-login", { session: false }),
    (req, res, next) => {
    res.json({ user: req.user });
    }
)


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