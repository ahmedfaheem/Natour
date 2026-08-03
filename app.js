const express = require('express');

const app = express();
const morgan = require('morgan');
const Path = require('path');
const qs = require('qs');
const ErrorGlobalHandeler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/AppError');
const reateLimit = require('express-rate-limit');

/*
200 ok and return data   get
201 created     create
204 no content  for patch delete update
404 find by get
400  invalid input
401  unauthrized
403 forbidden
404 not found 
500 connection error

*/

//1- Gloval Middleware
app.use(express.json()); // any req body must be json so we can get req.body
// app.use((req, res, next) => {
//   console.log('First Middleware - applied to all routes');

//   next(); // next middleware
// });
// parse req.query
app.set('query parser', (str) => qs.parse(str));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// static middleware to access files
app.use(express.static(Path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.TimeRequest = new Date().toISOString();
  next(); // next middleware
});

// implement ratelimiting

const rateLimter = reateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000, // in mille
});

app.use('/api', rateLimter); // apply for all /api requests

// 3- Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// not found routes
app.use((req, res, next) => {
  // const err = new Error(
  //   `The Route ${req.originalUrl}, you tried to fetch not found`,
  // );
  // err.statusCode = 404;
  // err.status = 'fail';
  // instead of do all of this on each time, create Class for Error
  next(
    new AppError(
      `The Route ${req.originalUrl}, you tried to fetch not found`,
      404,
    ),
  );
});

app.use(ErrorGlobalHandeler);
// 4- Server Configuration
module.exports = app;
