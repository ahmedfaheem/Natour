const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const multer = require('multer');

const fileStorage = multer.diskStorage({
  filename: (req, file, cp) => {
    const name = `user-${req.user.id}-${Date.now()}.${file.mimetype.split('/')[1]}`;
    cp(null, name);
  },
  destination: (req, file, cp) => {
    cp(null, './public/img/users');
  },
});

const fileFilter = (req, file, cp) => {
  const ext = file.mimetype.split('/')[0];
  if (ext !== 'image') {
    cp(new AppError('Only Support Image File', 400));
  }
  cp(null, true);
};
const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

exports.uploadUserPhoto = upload.single('photo');

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

// add before getById to get currently log in user
exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file, req.body);
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
