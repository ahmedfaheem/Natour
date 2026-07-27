const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const JWT = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { promisify } = require('util');

const getToken = async function (id) {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIERS_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangeAt: req.body.passwordChangeAt,
  });

  const token = await getToken(newUser._id.toString());

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body || {};

  //1 check is email or password Exists
  if (!email || !password) {
    return next(new AppError('Must Provide Email and Password', 400));
  }

  //2 check if email and password  correct
  // we add select:false in model for password so use +password to add in request
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid Email or Password', 401));
  }
  const token = await getToken(user._id.toString());

  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // gettign token and check if exist
  let token = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('Your Are not Loged In, Please Login to get access', 401),
    );
  }

  //2 verify token

  // most usage
  //  const decodedData = JWT.verify(token, process.env.JWT_SECRET);

  // not always
  // JWT.verify(token, process.env.JWT_SECRET, (error, decoded) => {
  //   console.log(error, decoded);
  // });

  // optional
  // to ceheck 2 error (optional) invalid token or expire token can make JWT.verify to be promise so
  // can catch error in global handler

  const decodedData = await promisify(JWT.verify)(
    token,
    process.env.JWT_SECRET,
  );

  //3 check if user is exist
  const user = await User.findById(decodedData.id);
  if (!user) {
    return next(
      new AppError('The user belonging to this token, no longer exist', 401),
    );
  }

  // 4 check if user changed password after the token issued
  if (user.isPasswordChanged(decodedData.iat)) {
    return next(
      new AppError('User Recently Changed Password! please login again.', 401),
    );
  }

  // 5 Grant Access to Protected User
  req.user = user;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to do this action", 403),
      );
    }
    next();
  };
