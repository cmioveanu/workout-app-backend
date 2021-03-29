const express = require('express');
const login = express.Router();
module.exports = login;

const dbConfig = require('../config/db');
const { Pool } = require('pg');
const pool = new Pool(dbConfig);

const passport = require('passport');
const bcrypt = require('bcrypt');


login.post('/', passport.authenticate('local'), (req, res) => {
    res.status(200).send("Logged in!");
});


login.get('/logout', (req, res) => {
    req.logout();
});


login.post('/register', (req, res) => {
    const email = req.body.username;
    const password = req.body.password;


    //if username exists, send 403 unauthorized; if not, create user and add it to the DB
    pool.query(`
    SELECT * FROM users
    WHERE email = $1`, [email], (err, result) => {
        if (result.rows[0]) {
            res.status(403).send("Username already exists. Please login.");
        } else {
            bcrypt.hash(password, 5, (err, hash) => {
                pool.query(`
                INSERT INTO users (email, password)
                VALUES ($1, $2)`, [email, hash], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.status(201).send("User registered.");
                });
            });
        }
    });
});
