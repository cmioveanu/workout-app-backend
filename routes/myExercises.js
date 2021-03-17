const express = require('express');
const myExercises = express.Router();
module.exports = myExercises;

const dbConfig = require('../config/db');
const { Pool } = require('pg');
const pool = new Pool(dbConfig);


//get all exercises
myExercises.get('/', (req, res) => {
    pool.query('SELECT * FROM exercises ORDER BY name', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    })
});


//create new exercise
myExercises.post('/', async (req, res) => {
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



//edit an exercise by id
myExercises.put('/:exerciseID', (req, res) => {
    const user_id = 1;
    const exerciseID = req.params.exerciseID;

    if (!req.body.newName) {
        res.status(404).send("Please enter a new name before sending");
    } else {
        //ensure the proper capitalization
        const newName = req.body.newName.charAt(0).toUpperCase() + req.body.newName.slice(1);

        pool.query(`
        UPDATE exercises
        SET name = $1
        WHERE id = $2
        `, [newName, exerciseID])
            .then(() => {
                pool.query('SELECT * FROM exercises ORDER BY name', (error, results) => {
                    if (error) {
                        throw error;
                    }
                    res.status(200).json(results.rows);
                })
            });
    }
});



//delete an exercise by id
myExercises.delete('/:exerciseID', (req, res) => {
    const user_id = 1;

    const exerciseID = req.params.exerciseID;

    pool.query(`
        DELETE FROM exercises
        WHERE id = $1
        `, [exerciseID])
        .then(() => {
            pool.query('SELECT * FROM exercises ORDER BY name', (error, results) => {
                if (error) {
                    throw error;
                }
                res.status(200).json(results.rows);
            })
        });
})






//get the history of a specific exercise
myExercises.get('/:exerciseID/:number', (req, res) => {
    const user_id = 1;

    const exerciseID = req.params.exerciseID;
    const numberOfEntries = req.params.number;

    pool.query(`
    SELECT workouts.date,
    exercises.name,
    sets.time_under_load,
    sets.negatives

    FROM sets
    JOIN workouts
    ON sets.workout_id = workouts.id
    JOIN exercises_routines
    ON sets.exercise_routine_id = exercises_routines.id
    JOIN routines
    ON exercises_routines.routine_id = routines.id
    JOIN exercises
    ON exercises_routines.exercise_id = exercises.id
    WHERE exercise_id = ${exerciseID}
    ORDER BY sets.id DESC 
    LIMIT ${numberOfEntries}
    `,
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        }
    )
});





/*
Exercise history

`
SELECT workouts.date AS workout_date,
exercises.name AS exercise,
sets.time_under_load,
sets.negatives

FROM sets
JOIN workouts
ON sets.workout_id = workouts.id
JOIN exercises_routines
ON sets.exercise_routine_id = exercises_routines.id
JOIN routines
ON exercises_routines.routine_id = routines.id
JOIN exercises
ON exercises_routines.exercise_id = exercises.id
`

*/