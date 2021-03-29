const express = require('express');
const login = express.Router();
module.exports = login;
const passport = require('passport');

const dbConfig = require('../config/db');
const { Pool } = require('pg');
const pool = new Pool(dbConfig);


login.post('/', passport.authenticate('local'), (req, res) => {
    res.status(200).send("Logged in!");
});


login.post('/register', (req, res) => {
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
