const express = require('express');
const myAccount = express.Router();
module.exports = myAccount;

const dbConfig = require('../config/db');
const { Pool } = require('pg');
const pool = new Pool(dbConfig);