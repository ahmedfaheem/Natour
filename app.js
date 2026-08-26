const express = require('express');

const app = express();
const morgan = require('morgan');
const Path = require('path');
const qs = require('qs');
const compression = require('compression');
const ErrorGlobalHandeler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const AppError = require('./utils/AppError');
const reateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongooseSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');

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

// Init View Engine in Express

app.set('view engine', 'pug');

app.set('views', Path.join(__dirname, 'views'));

//1- Gloval Middleware

app.set('trust proxy', 1);

// static middleware to access files
app.use(express.static(Path.join(__dirname, 'public')));

// make browser allow any origins requests   it also allowed in postman and another agents
app.use(cors());

// add many http security headers
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],

//         scriptSrc: ["'self'", 'https://api.mapbox.com'],

//         styleSrc: [
//           "'self'",
//           "'unsafe-inline'",
//           'https://api.mapbox.com',
//           'https://fonts.googleapis.com',
//         ],

//         imgSrc: ["'self'", 'data:', 'blob:', 'https://*.mapbox.com'],

//         connectSrc: [
//           "'self'",
//           'https://api.mapbox.com',
//           'https://*.mapbox.com',
//         ],

//         workerSrc: ["'self'", 'blob:'],
//       },
//     },
//   }),
// );

// Body Parser: any req body must be json so we can get req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// parse req.query so can use price[gte]=100 which will be {price: {gte: 100}} and need to replce with $gte
app.set('query parser', (str) => qs.parse(str));

// HTTP Parameter Pollution which prevent send 2 query with same name and if sent get last one unless add whitelist
app.use(
  hpp({
    whitelist: [
      'duration',
      'difficulty',
      'ratingsAverage',
      'price',
      'ratingsQuantity',
      'maxGroupSize',
    ],
  }),
);

//Data sanitization against NoSQL query injection express@4 only
app.use(mongooseSanitize());

//Data sanitization against XSS
app.use(xss());

// development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// implement ratelimiting
const rateLimter = reateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000, // in mille
});

app.use('/api', rateLimter); // apply for all /api requests

// compression middleware for compress responses for performance

app.use(compression());

// test middleware
// app.use((req, res, next) => {
//   req.TimeRequest = new Date().toISOString();
//   // console.log(req.cookies);
//   next(); // next middleware
// });

// app.use((req, res, next) => {
//   console.log('First Middleware - applied to all routes');

//   next(); // next middleware
// })

// 3- Routes

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

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
