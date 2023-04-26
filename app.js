const express = require('express')
const app = express()
const port = 3000
const db = require('./db/index.js')
const bodyParser = require('body-parser');
const passport = require("passport");
require("./db/passportConfig.js")(passport);
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    info: {
      title: 'Node Swagger API',
      version: '1.0.0',
      description: 'RESTful eCommerce API',
    },
    host: 'localhost:3000',
    basePath: '/',
    servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
};
  
  // options for the swagger docs
const options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./app*.js'],
};
  
  // initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Retrieve a JSON object of all products.
 *     description: Retrieve a list of products from eCommerce API. Can be used to populate a list of fake products when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The product ID.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The product's name.
 *                         example: Amazon Fire TV 43\" 4-Series 4K UHD smart TV, stream live TV without cable
 */
app.get('/products', db.getProducts)

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Retrieve a single product.
 *     description: Retrieve a single product. Can be used to populate a product page when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A singular product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The product ID.
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: The product's name.
 *                         example: Amazon Fire TV 43\" 4-Series 4K UHD smart TV, stream live TV without cable
 */
app.get('/products/:id', db.getProductID)

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a product.
 *     parameters:
 *       - in: body
 *         name: product
 *         required: true
 *         description: name of product you would like to add
 *         schema:
 *           type: object
 *           required:
 *             - product_price
 *           properties:
 *             product_price:
 *               type: integer
 *               example: 299
 *             product_quantity:
 *               type: integer
 *               example: 10
 *             product_name:
 *               type: string
 *               example: Amazon Fire TV 43\" 4-Series 4K UHD smart TV, stream live TV without cable
 *     responses:
 *       201:
 *         description: The product created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               product_price:
 *                 type: integer
 *                 description: The product price.
 *                 example: 299
 *               product_quantity:
 *                 type: integer
 *                 description: The product quantity added.
 *                 example: 12
 *               product_name:
 *                 type: text
 *                 description: The name of the product.
 *                 example: T-shirt
 */
app.post('/products', db.createProduct)

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     description: Updates a single product
 *     produces: 
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to update.
 *         schema:
 *           type: integer
 *       - name: values
 *         in: body
 *         required: true
 *         type: object
 *         example: {"product_price": 100, "product_quantity": 1, "product_name": "product_xyz"}
 *     responses:
 *       200:
 *         description: Successfully updated
 */
app.put('/products/:id', db.updateProduct)

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     description: Deletes a single product
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Product's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
app.delete('/products/:id', db.deleteProduct)

/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - User
 *     summary: Retrieve a JSON object of all users.
 *     description: Retrieve a list of users registered on the eCommerce API. Can be used to populate a list of fake users when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 2
 *                       username:
 *                         type: string
 *                         description: The users's username.
 *                         example: Nate
 */
app.get('/user', db.getUsers)


/**
 * @swagger
 * /user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Retrieve a single user.
 *     description: Retrieve a single user by ID. Can be used to identify a user when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A singular user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The user ID.
 *                         example: 2
 *                       username:
 *                         type: string
 *                         description: The users's username.
 *                         example: nate
 */
app.get('/user/:id', db.userById)

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     tags:
 *       - User
 *     description: Updates a single user
 *     produces: 
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to update.
 *         schema:
 *           type: integer
 *       - name: values
 *         in: body
 *         required: true
 *         type: object
 *         example: {"username": "Bob", "password": "fakepassword"}
 *     responses:
 *       201:
 *         description: Successfully updated
 */
app.put('/user/:id', db.updateUser)

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     tags:
 *       - User
 *     description: Deletes a single user
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted user.
 */
app.delete('/user/:id', db.deleteUser)

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Register
 *     summary: Create a new user.
 *     parameters:
 *       - in: body
 *         name: JSON Object
 *         required: true
 *         description: username and password of the user you would like to add
 *         schema:
 *           type: object
 *           required:
 *             - username
 *           properties:
 *             username:
 *               type: text
 *               example: "Nathan"
 *             password:
 *               type: text
 *               example: "password123"
 *     responses:
 *       201:
 *         description: The user was created.
 */
app.post('/register', db.createUser)


/**
 * @swagger
 * /cart/{id}:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Retrieve a single cart by ID.
 *     description: Retrieve a single cart by ID. Can be used to identify items in a cart when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the cart to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A singular cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The cart ID.
 *                         example: 2
 *                       order_id:
 *                         type: integer
 *                         description: The order id associated with the cart if the order has been placed.
 *                         example: 1
 *                       product_id:
 *                         type: integer
 *                         description: The product id in the cart.
 *                       qty:
 *                         type: integer
 *                         description: The quantity of the item in the cart.
 *                       session_id:
 *                         type: date
 *                         description: The date the cart was created
 *                       user_id:
 *                         type: integer
 *                         description: The user ID who owns the cart
 */
app.get('/cart/:id', db.getCartID)

/**
 * @swagger
 * /cart:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Create a new cart.
 *     parameters:
 *       - in: body
 *         name: JSON Object
 *         required: true
 *         description: Cart info that must be added to create a new cart.
 *         schema:
 *           type: object
 *           required:
 *             - product_id
 *           properties:
 *             product_id:
 *               type: integer
 *               example: 1
 *             qty:
 *               type: integer
 *               example: 10
 *             user_id:
 *               type: integer
 *               example: 2
 *     responses:
 *       201:
 *         description: The cart was created.
 */
app.post('/cart', db.createCart)

/**
 * @swagger
 * /cart/{id}:
 *   put:
 *     tags:
 *       - Cart
 *     description: Updates a single cart by ID
 *     produces: 
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the cart to update.
 *         schema:
 *           type: integer
 *       - name: values
 *         in: body
 *         required: true
 *         type: object
 *         example: {"product_id": 1, "qty": 10}
 *     responses:
 *       201:
 *         description: Successfully updated cart
 */
app.put('/cart/:id', db.updateCart)

/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Retrieve a JSON object of all orders.
 *     description: Retrieve a list of orders on the eCommerce API. Can be used to populate a list of fake orders when prototyping or testing an API.
 *     responses:
 *       200:
 *         description: A list of orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       order_id:
 *                         type: integer
 *                         description: The order ID.
 *                         example: 2
 *                       user_id:
 *                         type: integer
 *                         description: The user ID of the user who placed the order.
 *                         example: 2
 *                       order_date:
 *                         type: date
 *                         description: The date the order was placed.
 *                         example: '2015-01-01'
 *                       cart_id:
 *                         type: integer
 *                         description: The cart ID associated with the order.
 *                         example: 2
 *                       qty:
 *                         type: integer
 *                         description: The quantity of items purchased.
 *                         example: 10
 *                       product_id:
 *                         type: integer
 *                         description: The product ID of the items purchased
 *                         example: 2
 */
app.get('/orders', db.getOrders)

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Retrieve a single order by ID.
 *     description: Retrieve a single order by ID. Can be used to identify items in an order when prototyping or testing an API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the order to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A singular order.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       order_id:
 *                         type: integer
 *                         description: The order ID.
 *                         example: 2
 *                       user_id:
 *                         type: integer
 *                         description: The user ID of the user who placed the order.
 *                         example: 2
 *                       order_date:
 *                         type: date
 *                         description: The date the order was placed.
 *                         example: '2015-01-01'
 *                       cart_id:
 *                         type: integer
 *                         description: The cart ID associated with the order.
 *                         example: 2
 *                       qty:
 *                         type: integer
 *                         description: The quantity of items purchased.
 *                         example: 10
 *                       product_id:
 *                         type: integer
 *                         description: The product ID of the items purchased
 *                         example: 2
 */
app.get('/orders/:id', db.getOrdersByID)

/**
 * @swagger
 * /cart/{cartId}/checkout:
 *   post:
 *     tags:
 *       - Checkout
 *     summary: Checkout the cart.
 *     parameters:
 *       - in: body
 *         name: JSON Object
 *         required: true
 *         description: Checkout info that must be added to checkout items.
 *         schema:
 *           type: object
 *           required:
 *             - cc_number
 *           properties:
 *             cc_number:
 *               type: integer
 *               example: 5555555555554444
 *             security_code:
 *               type: integer
 *               example: 333
 *       - in: path
 *         name: cartId
 *         required: true
 *         description: Cart ID of the cart to checkout.
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Order placed and order ID associated with cart.
 */
app.post('/cart/:cartId/checkout', db.checkoutCart)

app.listen(port, () => {
    console.log(`Listening on port ${port}.`)
})