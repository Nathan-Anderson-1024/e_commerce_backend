const { Pool } = require('pg')

const pool = new Pool({
    user: 'dbuser',
    host: 'localhost',
    database: 'eCommerce',
    password: 'password',
    port: 5432,
})

const getProducts = (request, response) => {
    pool.query('SELECT * FROM products', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getProductID = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
    
}

const createProduct = (request, response) => {
    const {product_price, product_quantity, product_name, product_category} = request.body

    pool.query('INSERT INTO products (product_price, product_quantity, product_name, product_category) VALUES ($1, $2, $3, $4) RETURNING *', [product_price, product_quantity, product_name, product_category], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`Product added with Product ID: ${results.rows[0].id}`)
    })
}



// pool.query('SELECT * FROM products WHERE id = $1', [1], (err, res) => {
//     if (err) {
//         throw err
//     }
//     console.log('user:', res.rows[0])
// })

module.exports = {
    query: (text, params, callback) => {
      return pool.query(text, params, callback)
    },
    getProducts,
    getProductID,
    createProduct
  }