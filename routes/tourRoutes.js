const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRoutes = require('./reviewRoutes');
const Router = express.Router();

// POST api/v1/tours/99965/reviews
// GET api/v1/tours/99965/reviews
// use mergeParams to pass this params
Router.use('/:tourId/reviews', reviewRoutes);

// Param Middleware
// Router.param('id', tourController.checkID);

Router.route('/top-5-cheap').get(
  tourController.aliasTopCheap,
  tourController.getAllTours,
);

Router.route('/stats').get(tourController.getTourStats);
Router.route('/monthly-plan/:year').get(tourController.getMonthlyPaln);

Router.route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

// app.use((req, res, next) => {
//   console.log(
//     'Second Middleware - applied to all routes except the route above',
//   );

//   next(); // next middleware
// });

Router.route('/:id')
  .get(tourController.getTourByID)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guid'),
    tourController.deleteTour,
  );

module.exports = Router;
