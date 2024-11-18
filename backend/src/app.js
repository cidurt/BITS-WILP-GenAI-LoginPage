const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mlRoutes = require('./routes/mlRoutes');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const fraudRoutes = require('./routes/fraudRoutes');


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/ml', mlRoutes);
app.use('/fraud', fraudRoutes)

module.exports = app;
