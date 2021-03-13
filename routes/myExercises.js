const express = require('express');
const myExercises = express.Router();
module.exports = myExercises;

const dbConfig = require('../config/db');
const { Pool } = require('pg');
const pool = new Pool(dbConfig);


//get all exercises
myExercises.get('/', (req, res) => {
    pool.query('SELECT * FROM exercises', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
});



//get the history of a specific exercise
myExercises.get('/:exerciseId', (req, res) => {
    const user_id = 1;
    const exercise_id = 1;
    pool.query(`
        SELECT date, time_under_load, negatives FROM exercises_routines
        WHERE user_id = 1 AND exercise_id = 1`,
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        }
    )
});



//Create new exercise
myExercises.post('/', async (req, res) => {
    console.log(req.body);

    
    if (!req.body.name) {
        res.status(404).send("Please enter a name before sending");
    } else {
        const user_id = 1;
        const newRawName = req.body.name;
        const newExerciseName = newRawName.charAt(0).toUpperCase() + newRawName.slice(1);

        pool.query(`
        INSERT INTO exercises (name, user_id)
        VALUES ($1, $2)`, [newExerciseName, user_id])
            .then(() => {
                pool.query('SELECT * FROM exercises', (error, results) => {
                    if (error) {
                        throw error;
                    }
                    res.status(200).json(results.rows);
                })
            });
    }
});