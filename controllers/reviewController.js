const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.getAll = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ tour: req.params.tourId });
  res.status(200).json({
    status: 'success',
    date: {
      reviews,
    },
  });
});

exports.create = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  const review = await Review.create(req.body);
  res.status(200).json({
    status: 'success',
    date: {
      review,
    },
  });
});
