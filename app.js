const expres = require('express');
const app = expres();
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
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

//1- Middleware
app.use(expres.json()); // any req body must be json so we can get req.body
// app.use((req, res, next) => {
//   console.log('First Middleware - applied to all routes');

//   next(); // next middleware
// });

app.use((req, res, next) => {
  req.TimeRequest = new Date().toISOString();
  next(); // next middleware
});

app.use(morgan('dev'));

// 3- Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// 4- Server Configuration
module.exports = app;
