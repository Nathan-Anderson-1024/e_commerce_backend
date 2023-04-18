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
    getProducts
  }