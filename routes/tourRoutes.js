const express = require('express');
const tourController = require('../controllers/tourController');

const Router = express.Router();

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
  .delete(tourController.deleteTour);

module.exports = Router;
