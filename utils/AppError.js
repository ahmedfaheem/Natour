class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // not add this object in stack trace when create object (this) and call this constructor(this.constructor)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
