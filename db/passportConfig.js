const bcrypt = require("bcryptjs")
const LocalStrategy = require("passport-local");
// const { createUser } = require("./index");
const db = require('./index')

const matchPassword = async (password, hashPassword) => {
    const match = await bcrypt.compare(password, hashPassword);
    return match
};

const emailExists = async (username) => {
    const data = await db.pool.query("SELECT * FROM users WHERE username=$1", [
    username,
    ]);
    
    if (data.rowCount == 0) return false; 
    return data.rows[0];
    };


module.exports = (passport) => {
    passport.use('local-login', new LocalStrategy(function verify(username, password, cb) {
        db.pool.query('SELECT * FROM users WHERE username = $1', [username], async function (error, user) {
            const isEmail = await emailExists(username)
            if (!isEmail) return cb(null, false, {message: 'Incorrect username or password.'})

            if (error) {
                return cb(error);
            }
            if (!user) {
                return cb(null, false, {message: 'Incorrect username or password.'})
            }
            const matchedPasswords = await matchPassword(password, user.rows[0].password)
            if (!matchedPasswords) return cb(null, false, {message: 'Incorrect username or password'})
            return cb(null, user)
        })
    }))
}

// passport.use('local-login', new LocalStrategy(function verify(username, password, cb) {
//     db.get('SELECT * FROM users WHERE username = $1', [username], (error, user) => (error, user) => {
//         if (error) {
//             return cb(err);
//         }
//         if (!user) {
//             return cb(null, false, {message: 'Incorrect username or password.'})
//         }
//     })
// }))

// module.exports = (passport) => {
//     db.get('local-login', new LocalStrategy(function verify(username, password, cb) {
//         ('SELECT * FROM users WHERE username = $1', [username], (error, user) => (error, user) => {
//             if (error) {
//                 return cb(err);
//             }
//             if (!user) {
//                 return cb(null, false, {message: 'Incorrect username or password.'})
//             }
//         })
//     }))
// }
