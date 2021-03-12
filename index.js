require('dotenv').config();
const express = require('express');
const app = express();

/****  Dependencies  ****/
/************************/

const cors = require('cors');
app.use(cors());

express.json();


/**** Session & Passport****/
/***************************/

const session = require('express-session');
//app.use(session({secret: 'mySecretKey'}));

app.use(require('cookie-parser')());

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');


//Access headers for requests
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Credentials', "true");
    next();
});



/**** Routes ****/
/**********************/




/**** Start server ****/
/**********************/

const port = process.env.PORT;
app.listen(port, () => console.log(`Listening on port ${port}...`));