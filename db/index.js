const { Pool } = require('pg')

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
    pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password], (error, results) => {
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
    const {product_id, qty} = request.body
    pool.query('INSERT INTO cart (product_id, qty) VALUES ($1, $2) RETURNING *', [product_id, qty], (error, results) => {
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
    updateCart
  }