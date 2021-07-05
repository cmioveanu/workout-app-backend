require('dotenv').config();
const express = require('express');
const app = express();


/* Basic Dependencies */
const path = require('path');
const cors = require('cors');
app.use(cors());
app.use(express.json({
    type: 'application/json',
}));



/* Authentication */
const dbConfig = require('./config/db');
const { Pool } = require('pg');
const pool = new Pool(dbConfig);

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);


app.use(session({
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'none',
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000 
    } // 30 days
  }));

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

app.use('/api/workout', workoutRouter);
app.use('/api/exercises', exercisesRouter);
app.use('/api/routines', routinesRouter);
app.use('/api/account', accountRouter);


app.use(express.static(path.join(__dirname, 'build')));


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


/* Start Server */
const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));