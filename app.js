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
 *     tags: Products
 *     description: Updates a single product
 *     produces: application/json
 *     parameters:
 *       name: id
 *       in: body
 *       description: Fields for the Product resource
 *       schema:
 *         type: array
 *         $ref: '#/definitions/Products'
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