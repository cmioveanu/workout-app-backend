const express = require('express');
const myExercises = express.Router();
module.exports = myExercises;

const dbConfig = require('../config/db');
const { Pool } = require('pg');
const pool = new Pool(dbConfig);


myExercises.get('/', (req, res) => {
    pool.query('SELECT * FROM exercises', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
});