const express = require('express');
const myLogin = express.Router();
module.exports = myLogin;
const passport = require('passport');

const dbConfig = require('../config/db');
const { Pool } = require('pg');
const pool = new Pool(dbConfig);


myLogin.post('/', passport.authenticate('local', {
    successRedirect: '/workout',
    failureRedirect: '/login'
}), (req, res) => {
    res.status(200).send("Logged in!");
});


myLogin.post('/register', (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    pool.query(`SELECT * FROM users
    WHERE email = $1`, [email], (err, result) => {
        if (result.rows[0]) {
            res.status(404).send("Username already exists. Please login.");
        } else {
            pool.query(`
            INSERT INTO users (email, password)
            VALUES ($1, $2)`, [email, password], (err, result) => {
                if (err) {
                    throw err;
                }
                res.status(201).send("User registered.");
            });
        }
    });
});
