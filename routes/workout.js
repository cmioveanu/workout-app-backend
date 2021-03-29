const express = require('express');
const workout = express.Router();
module.exports = workout;

const dbConfig = require('../config/db');
const { Pool } = require('pg');
const pool = new Pool(dbConfig);

const checkAuth = require('../utils/checkAuth');
workout.use(checkAuth);


//get exercises for currently selected workout
workout.get('/:routineID', (req, res) => {
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
    WHERE routines.id = $1
    ORDER BY exercises.name`, [routineID],
        (error, results) => {
            if (error) {
                throw error;
            }

            res.status(200).send(results.rows);
        });
});


//record new workout
workout.post('/', (req, res) => {
    const totalTime = req.body.totalWorkoutTime;
    const exercises = req.body.exercises;

    const recordPermission = exercises.some(exercise => exercise.timeUnderLoad > 0);

    if (recordPermission) {

        //create a new workout with the current date
        pool.query(`
        INSERT INTO workouts(user_id, date, total_time)
        VALUES($1, current_timestamp, $2)
        RETURNING id;
        `, [req.user.id, totalTime], (error, results) => {
            if (error) {
                throw error;
            }

            workoutID = results.rows[0].id;

            //record the sets of exercises to the database with the above workout ID
            exercises.forEach(exercise => {
                if (exercise.timeUnderLoad > 0) {
                    pool.query(`
                INSERT INTO sets(workout_id, exercise_routine_id, time_under_load, negatives)
                VALUES($1, $2, $3, $4)
                `, [workoutID, exercise.id, exercise.timeUnderLoad, exercise.negatives], (err, res) => {
                        if (err) {
                            throw err;
                        }
                    })
                }
            })

        });
    }
});