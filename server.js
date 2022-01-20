// Global Config
global.__config = require('./config');
global.__basedir = __dirname;

// INIT
const express = require('express');
const app = express();

// Modules
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportJwt = require('passport-jwt');
const jwtStrategy = passportJwt.Strategy;
const extractJwt = passportJwt.ExtractJwt;
const jwt = require('jsonwebtoken');

// Models
const User = require('./server/models/user');

// DB Connection
mongoose.connect('mongodb://localhost:27017/confetti');

// Middlewares
app.use(bodyParser.json());
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.use(new jwtStrategy({
  jwtFromRequest: extractJwt.fromHeader('token'),
  secretOrKey: require('./server/routes/api/v1/frontend/auth/controllers/jwt-secret')
}, (jwtPayload, cb) => {
  return User.findOne({ _id: jwtPayload._id })
          .then(user => cb(null, user))
          .catch(err => cb(err));
}));

// API
const API_V1 = require('./server/routes/api/v1');
app.use('/api/v1', API_V1);

// CLIENT
app.use(express.static('client/dist'));
app.use("*", (req, res) => res.sendFile(__dirname + '/client/dist/index.html'));

// Server
app.listen(__config.PORT, __config.HOST, () => console.log('Confetti IWMS Application server has started'));