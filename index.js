require('dotenv').config();
const express = require('express');
const app = express();



/**** Basic Dependencies ****/
/****************************/
const cors = require('cors');
app.use(cors());
app.use(express.json({
    type: 'application/json',
}));



/**** Authentication ****/
/***************************/
const session = require('express-session');
app.use(session({secret: 'mySecretKey'}));
app.use(require('cookie-parser')());

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');


app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});



/**** Routes ****/
/**********************/
const exercisesRouter = require('./routes/myExercises');
const routinesRouter = require('./routes/myRoutines');
const accountRouter = require('./routes/myAccount');

app.use('/myExercises', exercisesRouter);
app.use('/myRoutines', routinesRouter);
app.use('/myAccount', accountRouter);



/**** Start Server ****/
/**********************/
const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));