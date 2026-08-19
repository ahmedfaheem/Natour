const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');

exports.getAll = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'success',
    date: {
      reviews,
    },
  });
});

// exports.create = catchAsync(async (req, res, next) => {
//   if (!req.body.user) req.body.user = req.user._id;
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   const review = await Review.create(req.body);
//   res.status(200).json({
//     status: 'success',
//     date: {
//       review,
//     },
//   });
// });

exports.setTourUserIDs = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.tour) req.body.tour = req.params.tourId;
  next();
};
exports.create = handlerFactory.createOne(Review);
exports.updateReview = handlerFactory.updateOne(Review);

exports.delete = handlerFactory.deleteOne(Review);
