const passport = require("passport");
const LocalStrategy = require("passport-local");
const { emailExists, createUser, matchPassword } = require("./index");
const db = require('./index')


module.exports = (passport) => {
    passport.use('local-login', new LocalStrategy(function verify(username, password, cb) {
        db.pool.query('SELECT * FROM users WHERE username = $1', [username], (error, user) => (error, user) => {
            if (error) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false, {message: 'Incorrect username or password.'})
            }
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
