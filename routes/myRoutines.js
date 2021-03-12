const express = require('express');
const myRoutines = express.Router();
module.exports = myRoutines;

const dbConfig = require('../config/db');
const { Pool } = require('pg');
const pool = new Pool(dbConfig);


//All routines for the History page
myRoutines.get('/', (req, res) => {
    pool.query('SELECT * FROM routines', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
});


//A specific routine for the Routines page
myRoutines.get('/:routine', (req, res) => {
    pool.query(`SELECT * FROM routines`, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
});