const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const filterObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      total: users.length,
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) check if user post password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This Route does not allow to update password, please use /updateMyPassword',
      ),
    );
  }

  //2) filter body Object
  const filterdBody = filterObject(req.body, 'name', 'email');

  //3) update user
  const user = await User.findByIdAndUpdate(req.user._id, filterdBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    date: {
      user,
    },
  });
});

exports.getUserById = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Handel not defined',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Handel not defined',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Handel not defined',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Handel not defined',
  });
};
