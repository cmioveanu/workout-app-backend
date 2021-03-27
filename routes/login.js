const express = require('express');
const login = express.Router();
module.exports = login;
const passport = require('passport');

const dbConfig = require('../config/db');
const {Pool} = require('pg');
const pool = new Pool(dbConfig);


login.post('/', passport.authenticate('local', {
    succesRedirect: '/workout',
    failureRedirect: '/login'
}), (req, res) =>{
    res.status(200).send("Logged in!");
});





/*
login.post('/register', (req, res) => {

});
*/