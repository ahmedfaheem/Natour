const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const JWT = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const getToken = async function (id) {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIERS_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
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
