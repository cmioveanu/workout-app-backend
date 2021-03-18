const express = require('express');
const myWorkout = express.Router();
module.exports = myWorkout;

const dbConfig = require('../config/db');
const { Pool } = require('pg');
const pool = new Pool(dbConfig);


//get exercises for currently selected workout
myWorkout.get('/:routineID', (req, res) => {
    const routineID = req.params.routineID;
    pool.query(`
    SELECT
    exercises.name,
    exercises_routines.id AS exercises_routines_id
    
    FROM exercises_routines
    JOIN routines
    ON exercises_routines.routine_id = routines.id
    JOIN exercises
    ON exercises_routines.exercise_id = exercises.id
    WHERE routines.id = 1
    ORDER BY exercises.name`, 
    (error, results) => {
        if(error) {
            throw error;
        }

        res.status(200).send(results.rows);
    });
});