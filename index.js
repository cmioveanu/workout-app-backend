require('dotenv').config();
const express = require('express');
const app = express();



/* Basic Dependencies */
const cors = require('cors');
app.use(cors());
app.use(express.json({
    type: 'application/json',
}));



/* Authentication */
const session = require('express-session');
app.use(session({secret: 'mySecretKey'}));
app.use(require('cookie-parser')());

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');



/* Routes */
const workoutRouter = require('./routes/myWorkout');
const exercisesRouter = require('./routes/myExercises');
const routinesRouter = require('./routes/myRoutines');
const accountRouter = require('./routes/myAccount');
const loginRouter = require('./routes/myLogin');

app.use('/myWorkout', workoutRouter);
app.use('/myExercises', exercisesRouter);
app.use('/myRoutines', routinesRouter);
app.use('/myAccount', accountRouter);
app.use('/myLogin', loginRouter);





/* Start Server */
const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));