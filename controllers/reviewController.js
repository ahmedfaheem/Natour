const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getAll = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    date: {
      reviews,
    },
  });
});

exports.create = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);
  res.status(200).json({
    status: 'success',
    date: {
      review,
    },
  });
});
