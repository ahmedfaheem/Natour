const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const tour = await Model.findByIdAndDelete(req.params.id);
    if (!tour) {
      return next(new AppError('Document Not Found', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      returnDocument: 'after',
    });

    if (!doc) {
      return next(new AppError('Document Not Found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });
