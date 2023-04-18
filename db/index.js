const { Pool } = require('pg')

const pool = new Pool({
    user: 'dbuser',
    host: 'localhost',
    database: 'eCommerce',
    password: 'password',
    port: 5432,
})
// get all products
const getProducts = (request, response) => {
    pool.query('SELECT * FROM products', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
// get one product by id
const getProductID = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
    
}
// create a product
const createProduct = (request, response) => {
    const {product_price, product_quantity, product_name} = request.body

    pool.query('INSERT INTO products (product_price, product_quantity, product_name) VALUES ($1, $2, $3) RETURNING *', [product_price, product_quantity, product_name], (error, results) => {
        if (error) {
            throw error
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
            throw error
        }
        response.status(204).send(`Product updated with Product ID: ${id}`)
    })
}

// delete a product

const deleteProduct = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM products WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`Product DELETED with Product ID: ${id}`)
    })
}

// get registered users

const getUsers = (request, response) => {
    // const id = parseInt(request.params.id)
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(results.rows)
    })
}

// register users
const createUser = (request, response) => {
    const {username, password } = request.body
    pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [username, password], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${results.rows[0].user_id}`).end()
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
    createUser,
    getUsers,
  }