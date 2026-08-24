const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const JWT = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { promisify } = require('util');
const { sendMail } = require('../utils/email');
const crypto = require('crypto');

const getToken = async function (id) {
  return JWT.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIERS_IN,
  });
};

const createSendToken = async (user, statusCode, res) => {
  const token = await getToken(user._id.toString());
  const cookieOptions = {
    httpOnly: true, // client can not modify or add it
    secure: process.env.NODE_ENV === 'development' ? false : true, // send in  http in dev and https in prod
    expires: new Date(
      Date.now() + process.env.JWT_COOKIES_EXPIERS_IN * 24 * 60 * 60 * 1000, // in milleseconds
    ),
  };
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
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
  newUser.password = undefined;
  await createSendToken(newUser, 201, res);
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
  await createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // gettign token and check if exist
  let token = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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
  res.locals.user = user;
  req.user = user;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decodedData = await promisify(JWT.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      const user = await User.findById(decodedData.id);
      if (!user) {
        return next();
      }

      if (user.isPasswordChanged(decodedData.iat)) {
        return next();
      }

      res.locals.user = user;
    }
  } catch (err) {
    return next();
  }

  return next();
};

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    httpOnky: true,
    expires: new Date(Date.now() + 10 * 1000),
  });
  res.status(200).json({
    status: 'success',
  });
};
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1 check if email is exist
  const { email } = req.body || {};
  if (!email)
    return next(new AppError('Please Provide Email to Reset Password', 400));

  // 2 check if user is exist
  const user = await User.findOne({ email: email });
  if (!user) return next(new AppError('There is no user with This Email', 404));

  // 3 generate random token and save user
  const token = user.setPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // disable validation becasue without it, password confierm validation work

  // 4 send mail and response
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${token}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.
If you didn't forget your password, please ignore this email!`;

  const emailOptions = {
    email,
    subject: 'Reset Password <Expire In 10 Min>',
    message,
  };

  try {
    await sendMail(emailOptions);

    res.status(200).json({
      status: 'success',
      message: 'Token Sent to Email',
    });
  } catch (e) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error in sending Email', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body || {};
  //1 check if password and passwordConfirm exists
  if (!password || !passwordConfirm) {
    return next(
      new AppError('Must provide password and passwordConfirm fields', 400),
    );
  }

  //2 hash provided Token First
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  //3 get user with this token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gte: Date.now() },
  });

  //4 if token is valid, set passwordResetToken and passwordResetExpire undefined and update password
  if (!user) {
    return next(new AppError('Invalid or Expired Token', 400));
  }
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save(); // use save to run all validators

  //5 update passwordChangeAt

  //6 login with jwt
  await createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword, passwordConfirm } = req.body || {};
  //1 check if password and passwordConfirm exists
  if (!newPassword || !passwordConfirm || !oldPassword) {
    return next(
      new AppError(
        'Must provide oldPassword, newPassword and passwordConfirm fields',
        400,
      ),
    );
  }

  //2 if oldpassword == stored password
  const user = await User.findById(req.user._id).select('+password');
  console.log(user);
  if (!(await user.correctPassword(oldPassword, user.password))) {
    return next(new AppError('Old Password does not correct', 401));
  }

  //3 check if new password == old Password
  if (await user.correctPassword(newPassword, user.password)) {
    return next(
      new AppError('New password must be different from the old password', 400),
    );
  }

  //4 save new password
  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save({ validateBeforeSave: true }); // ==   await user.save();

  //5 response with sending new token
  await createSendToken(user, 200, res);
});
