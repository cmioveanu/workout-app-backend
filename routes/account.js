const express = require('express');
const account = express.Router();
module.exports = account;

const dbConfig = require('../config/db');
const { Pool } = require('pg');
const pool = new Pool(dbConfig);