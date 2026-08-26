/* eslint-disable */
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  if (!tour) return next(new AppError('There is no tour with that name.', 404));

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    mapboxAccessToken: process.env.MAPBOX_ACCESS_TOKEN,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  //1 get bookings for current user
  const bookings = await Booking.find({ user: req.user._id });

  //2 get tours data of booking.
  const toursId = bookings.map((el) => el.tour._id);
  const tours = await Tour.find({ _id: { $in: toursId } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
