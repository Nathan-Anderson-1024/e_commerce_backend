const { Pool } = require('pg')
const bcrypt = require("bcryptjs")



const pool = new Pool({
    user: 'dbuser',
    host: 'localhost',
    database: 'eCommerce',
    password: 'password',
    port: 5432,
})

// get all products
const getProducts = (request, response, next) => {
    pool.query('SELECT * FROM products', (error, results) => {
        if (error) {
            return response.status(400).send(error)
        }
        response.status(200).json(results.rows)
        next()
    })
}
// get one product by id
const getProductID = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
        if (error) {
            return response.status(400).send(error)
        }
        response.status(200).json(results.rows)
    })
    
}
// create a product
const createProduct = (request, response) => {
    const {product_price, product_quantity, product_name} = request.body

    pool.query('INSERT INTO products (product_price, product_quantity, product_name) VALUES ($1, $2, $3) RETURNING *', [product_price, product_quantity, product_name], (error, results) => {
        if (error) {
            return response.status(400).send(error)
        }
        response.status(201).send(`Product added with Product ID: ${results.rows[0].id}`)
    })
}

//update a product
const updateProduct = (request, response) => {
    const {product_price, product_quantity, product_name} = request.body
    const id = parseInt(request.params.id)
    pool.query('UPDATE products SET product_price = $2, product_quantity = $3, product_name = $4 WHERE id = $1 RETURNING *', [id, product_price, product_quantity, product_name], (error, results) => {
        if (error) {
            return response.status(400).send(error)
        }
        response.status(204).send(`Product updated with Product ID: ${id}`)
    })
}

// delete a product

const deleteProduct = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM products WHERE id = $1', [id], (error, results) => {
        if (error) {
            return response.status(400).send(error)
        }
        response.status(200).send(`Product DELETED with Product ID: ${id}`)
    })
}

// get products by category

const productByCategoryID = (request, response) => {
    const categoryID = request.params.categoryID
    pool.query('SELECT * FROM products WHERE category_id = $1', [categoryID], (error, results) => {
        if (error) {
            return response.status(400).send(error)
        }
        response.status(200).json(results.rows)
    })
}


// register users
const createUser = (request, response) => {
    const {username, password } = request.body
    const salt = bcrypt.genSalt(10)
    const hash = bcrypt.hash(password, salt)
    pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, hash], (error, results) => {
        if (error) {
            return response.status(400).send(error) 
        }
        response.status(201).send(`User added with ID: ${results.rows[0].user_id}`).end()
    })
}


//get all users
const getUsers = (request, response) => {
    // const id = parseInt(request.params.id)
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            return response.status(400).send(error)
        }
        response.status(200).json(results.rows)
    })
}

//get user byID

const userById = (request, response) => {
    const user_id = parseInt(request.params.id)
    pool.query('SELECT * FROM users WHERE user_id = $1', [user_id], (error, results) => {
        if (error) {
            return response.status(400).send(error)
        }
        response.status(200).json(results.rows)
    })
}

// update user by ID

const updateUser = (request, response) => {
    const {username, password} = request.body
    const user_id = request.params.id
    pool.query('UPDATE users SET username = $1, password = $2 WHERE user_id = $3 RETURNING *', [username.toLowerCase(), password, user_id], (error, results) => {
        if (error) {
            return response.status(400).send(error)
        }
        response.status(201).send(`User updated with user_id: ${user_id}`)
    })
}

const deleteUser = (request, response) => {
    const user_id = request.params.id
    pool.query('DELETE FROM users WHERE user_id = $1', [user_id], (error, results) => {
        if (error) {
            return response.status(400).send(error)
        }
        response.status(200).send(`User deleted with ID: ${user_id}`)
    })
}

// cart functions
const getCartID = (request, response) => {
    const cart_id = request.params.id
    pool.query('SELECT * FROM cart WHERE cart_id = $1', [cart_id], (error, results) => {
        if (error) {
            return response.status(400).send(error)
        }
        response.status(200).json(results.rows)
    })
}

const createCart = (request, response) => {
    const {product_id, qty, user_id} = request.body
    pool.query('INSERT INTO cart (product_id, qty, session_id, user_id) VALUES ($1, $2, CURRENT_DATE, $3) RETURNING *', [product_id, qty, user_id], (error, results) => {
        if (error) {
            return response.status(400).send(error)
        }
        response.status(201).json(results.rows)
    })
}
//update the cart based on cart ID
const updateCart = (request, response) => {
    const {product_id, qty} = request.body
    const id = request.params.id
    pool.query('UPDATE cart SET product_id = $1, qty = $2 WHERE cart_id = $3 RETURNING *', [product_id, qty, id], (error, result) => {
        if (error) {
            return response.status(400).send(error)
        }
        response.status(200).send(`Cart updated with ID: ${id}`)
    })
}

// order endpoints

const getOrders = (request, response) => {
    pool.query('SELECT * FROM orders', (error, results) => {
        if (error) {
            return response.status(400).send(error)
        }
        response.status(200).json(results.rows)
    })
}

const getOrdersByID = (request, response) => {
    const order_id = request.params.id
    pool.query('SELECT * FROM orders WHERE order_id = $1', [order_id], (error, results) => {
        if (error) {
            return response.status(400).send(error)
        }
        response.status(200).json(results.rows)
    })
}

// checkout (POST /cart/cartID/checkout)

// validate cart to ensure it exists
    const checkoutCart = (request, response) => {
        const cart_id = request.params.cartId
        const {cc_number, security_code, expiration, first_name, last_name, street, city, state, zip} = request.body

        pool.query('INSERT INTO orders (user_id, product_id, cart_id, qty, order_date) SELECT user_id, product_id, cart_id, qty, session_id FROM cart WHERE cart_id = $1', [cart_id], (error, results) => {
            if (error) {
                return response.status(400).send(error)
            }

            const visaPattern = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
            const mastPattern = /^(?:5[1-5][0-9]{14})$/;
            const amexPattern = /^(?:3[47][0-9]{13})$/;
            const discPattern = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/

            if (!visaPattern.test(cc_number) && !mastPattern.test(cc_number) && !amexPattern.test(cc_number) && !discPattern.test(cc_number)) {
                return response.status(500).send('Invalid credit card number')
            }

            if (security_code.length !== 4 && amexPattern.test(cc_number)) {
                return response.status(500).send('Invalid security code.')
            }
            if (security_code.length > 3 && !amexPattern.test(cc_number)) {
                return response.status(500).send('Invalid security code.')
            }

            //response.status(200).send(`Order placed for Cart ID: ${cart_id}`)
            pool.query('UPDATE cart SET order_id = (SELECT order_id FROM orders WHERE cart_id = $1) WHERE cart_id = $1', [cart_id], (error, results) => {
               if (error) {
                   return response.status(400).send(error)
               }
               response.status(200).send(`Order placed for Cart ID: ${cart_id} and your cart has been cleared.`)
            })
       })


        
    }




module.exports = {
    query: (text, params, callback) => {
      return pool.query(text, params, callback)
    },
    getProducts,
    getProductID,
    createProduct,
    updateProduct,
    deleteProduct,
    productByCategoryID,
    createUser,
    getUsers,
    userById,
    updateUser,
    deleteUser,
    getCartID,
    createCart,
    updateCart,
    getOrders,
    getOrdersByID,
    checkoutCart,
    pool
  }