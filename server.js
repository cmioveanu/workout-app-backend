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
const workoutRouter = require('./routes/workout');
const exercisesRouter = require('./routes/exercises');
const routinesRouter = require('./routes/routines');
const accountRouter = require('./routes/account');
const loginRouter = require('./routes/account');

app.use('/api/workout', workoutRouter);
app.use('/api/exercises', exercisesRouter);
app.use('/api/routines', routinesRouter);
app.use('/api/account', accountRouter);




/* Start Server */
const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));