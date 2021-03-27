const dbConfig = require('../config/db');
const { Pool } = require('pg');
const pool = new Pool(dbConfig);

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    //verify callback
    (username, password, done) => {
        pool.query(`
        SELECT * FROM users
        WHERE email = $1
        AND password = $2`, [username, password], (err, result) => {
            if (err) {
                console.log("Error found!");
                return done(err);
            }
            if (!result.rows[0]) {
                console.log("User not found!");
                return done(null, false);
            }
            console.log("User found - logged in!");
            console.log(result.rows[0]);
            return done(null, result.rows[0]);
        });
    }
));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    pool.query(`
    SELECT * FROM users
    WHERE id = $1`, [id], (err, result) => {
        done(err, result.rows[0]);
    })
});