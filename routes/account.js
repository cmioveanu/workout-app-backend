const express = require('express');
const account = express.Router();
module.exports = account;

const dbConfig = require('../config/db');
const { Pool } = require('pg');
const pool = new Pool(dbConfig);

const passport = require('passport');
const bcrypt = require('bcrypt');


account.post('/register', (req, res) => {
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


account.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).send("Logged in!");
});


account.get('/logout', (req, res) => {
    req.logout();
    res.json({ status: "logout" });
});


//change email
account.put('/email', (req, res) => {
    const password = req.body.password;
    const newEmail = req.body.newEmail;

    pool.query(`
    SELECT password FROM users
    WHERE id = $1`, [req.user.id], (err, result) => {
        if (err) {
            throw err;
        }

        //password from the database
        const DBPassword = result.rows[0].password;

        //if submitted password and DB password match, update to the new email
        bcrypt.compare(password, DBPassword, (err, check) => {
            if (err) {
                throw err;
            }

            if (check) {
                pool.query(`
                UPDATE users
                SET email = $1
                WHERE id = $2`, [newEmail, req.user.id], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.status(200).send('Email changed.');
                });
            } else {
                res.status(403).send('Incorrect password.');
            }
        });

    });
});


//change password
account.put('/password', (req, res) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;


    pool.query(`
        SELECT password FROM users
        WHERE id = $1
        `, [req.user.id], (err, result) => {
        if (err) {
            return done(err);
        }

        //password from the database
        const DBPassword = result.rows[0].password;

        //if old password and db password match, update to the new password
        bcrypt.compare(oldPassword, DBPassword, (err, check) => {
            if (err) {
                throw err;
            }

            if (check) {
                bcrypt.hash(newPassword, 5, (err, hash) => {
                    if (err) {
                        throw err;
                    }

                    pool.query(`
                    UPDATE users 
                    SET password = $1
                    WHERE id = $2
                    `, [hash, req.user.id], (err, result) => {
                        if (err) {
                            throw err;
                        }
                        res.status(200).send("Password changed.");
                    });
                });
            } else {
                res.status(403).send("Passwords don't match.");
            }
        })
    });
});