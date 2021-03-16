const express = require('express');
const myRoutines = express.Router();
module.exports = myRoutines;

const dbConfig = require('../config/db');
const { Pool } = require('pg');
const pool = new Pool(dbConfig);


//All routines for the History page
myRoutines.get('/', (req, res) => {
    pool.query('SELECT * FROM routines ORDER BY name', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
});

/* Routines history

SELECT *
FROM exercises_routines
JOIN exercises
ON exercises.id = exercises_routines.exercise_id
WHERE routine_id = 2;

*/

//A specific routine for the Routines page
myRoutines.get('/:routine', (req, res) => {
    pool.query(`SELECT * FROM routines`, (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
});