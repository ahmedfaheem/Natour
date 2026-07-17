const express = require('express');
const tourController = require('../controllers/tourController');

const Router = express.Router();

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
