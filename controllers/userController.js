const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

const filterObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};
// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();
//   res.status(200).json({
//     status: 'success',
//     data: {
//       total: users.length,
//       users,
//     },
//   });
// });

exports.getAllUsers = handlerFactory.getAll(User);

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

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
  });
});

exports.getUserById = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Handel not defined',
  });
};

exports.getUserById = handlerFactory.getOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'fail',
    message: 'Handel not defined / please use /signup',
  });
};

exports.updateUser = handlerFactory.updateOne(User);

exports.deleteUser = handlerFactory.deleteOne(User);
