const AppError = require('../utils/AppError');

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational === true) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.error(err);
      res.status(err.statusCode).json({
        status: err.status,
        message: 'Somthing went wrong',
      });
    }
  }

  if (err.isOperational === true) {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  } else {
    console.error(err);
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'Please try again later.',
    });
  }
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const handelCastError = (err) =>
  new AppError(`invalid ${err.path}:${err.value}`, 400);

const handelDuplicateError = (err) =>
  new AppError(
    `duplicated field ${Object.keys(err.keyValue).join(' ')}:${Object.values(err.keyValue).join(' ')}`,
    400,
  );

const handelValidationError = (err) => {
  const message = Object.values(err.errors)
    .map((el) => el.message)
    .join('. ');

  return new AppError(message, 400);
};

const handleJWTTokenError = () =>
  new AppError('Invalid Token, Login Again and use Invalid One', 401);

const handleJWTTokenExpieredError = () =>
  new AppError('Token Expire, Login Again.', 401);

module.exports = (error, req, res, next) => {
  //   console.log(err.stack);
  // create a shallow copy of the original error object
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (error.name === 'CastError') error = handelCastError(error);
    if (error.code === 11000) error = handelDuplicateError(error);
    if (error.name === 'ValidationError') error = handelValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTTokenError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTTokenExpieredError(error);

    sendErrorProd(error, req, res);
  }
};
