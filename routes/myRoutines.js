const express = require('express');
const myRoutines = express.Router();
module.exports = myRoutines;

const dbConfig = require('../config/db');
const { Pool } = require('pg');
const pool = new Pool(dbConfig);


//get all the routines
myRoutines.get('/', (req, res) => {
    pool.query('SELECT * FROM routines ORDER BY name',
        (error, results) => {
            if (error) {
                throw error;
            }

            res.status(200).send(results.rows);
        });
});


//get the exercises that are part of routines
myRoutines.get('/exercises', (req, res) => {
    pool.query(`
        SELECT *
        FROM exercises_routines
        JOIN exercises
        ON exercises_routines.exercise_id = exercises.id`,
        (error, results) => {
            if (error) {
                throw error;
            }

            res.status(200).send(results.rows);
        });
});


//create new routine
myRoutines.post('/', async (req, res) => {
    if (!req.body.name) {
        res.status(404).send("Please enter a name before sending");
    } else {
        const user_id = 1;
        const newRawName = req.body.name;
        const newRoutineName = newRawName.charAt(0).toUpperCase() + newRawName.slice(1);

        pool.query(`
        INSERT INTO routines (name, user_id)
        VALUES ($1, $2)`, [newRoutineName, user_id])
            .then(() => {
                pool.query('SELECT * FROM routines ORDER BY name',
                    (error, results) => {
                        if (error) {
                            throw error;
                        }

                        res.status(200).send(results.rows);
                    });
            });
    }
});


//edit a routine by id
myRoutines.put('/:routineID', (req, res) => {
    const user_id = 1;
    const routineID = req.params.routineID;

    if (!req.body.newName) {
        res.status(404).send("Please enter a new name before sending");
    } else {
        //ensure the proper capitalization
        const newName = req.body.newName.charAt(0).toUpperCase() + req.body.newName.slice(1);

        pool.query(`
        UPDATE routines
        SET name = $1
        WHERE id = $2
        `, [newName, routineID])
            .then(() => {
                pool.query('SELECT * FROM routines ORDER BY name', (error, results) => {
                    if (error) {
                        throw error;
                    }
                    res.status(200).json(results.rows);
                })
            });
    }
});


//delete a routine by id
myRoutines.delete('/:routineID', (req, res) => {
    const user_id = 1;

    const routineID = req.params.routineID;

    pool.query(`
        DELETE FROM routines
        WHERE id = $1
        `, [routineID])
        .then(() => {
            pool.query('SELECT * FROM routines ORDER BY name', (error, results) => {
                if (error) {
                    throw error;
                }
                res.status(200).json(results.rows);
            })
        });
})


//delete an exercise from a routine
myRoutines.delete('/:routineID/:exerciseID', (req, res) => {
    const user_id = 1;

    const routineID = req.params.routineID;
    const exerciseID = req.params.exerciseID;

    pool.query(`
        DELETE FROM exercises_routines
        WHERE routine_id = $1 AND exercise_id = $2
        `, [routineID, exerciseID])
        .then(() => {
            pool.query(`
            SELECT *
            FROM exercises_routines
            JOIN exercises
            ON exercises_routines.exercise_id = exercises.id`,
                (error, results) => {
                    if (error) {
                        throw error;
                    }

                    res.status(200).send(results.rows);
                });
        });
})


//add an exercise to a routine
myRoutines.post('/:routineID/:exerciseID', (req, res, next) => {
    const user_id = 1;

    const routineID = req.params.routineID;
    const exerciseID = req.params.exerciseID;

    pool.query(`
        INSERT INTO exercises_routines (routine_id, exercise_id)
        VALUES ($1, $2)
        ON CONFLICT (routine_id, exercise_id) DO NOTHING
        `, [routineID, exerciseID])
        .then(() => {
            pool.query(`
            SELECT *
            FROM exercises_routines
            JOIN exercises
            ON exercises_routines.exercise_id = exercises.id`,
                (error, results) => {
                    if (error) {
                        throw error;
                    }

                    res.status(200).send(results.rows);
                });
        });
})


//get a specific routine history by ID
myRoutines.get('/:routine', (req, res) => {
    pool.query(`SELECT * FROM routines`,
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        })
});


/*
Routine history:

SELECT routines.name AS routine,
workouts.total_time AS workout_time,
workouts.date AS workout_date,
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
*/