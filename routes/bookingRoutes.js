const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const Router = express.Router();

Router.use(authController.protect);

Router.get('/checkout-session/:tourId', bookingController.getCheckout);

Router.use(authController.restrictTo('admin', 'lead-guide'));
Router.route('/')
  .get(bookingController.getAll)
  .post(bookingController.createOne);

Router.route('/:id')
  .get(bookingController.getOne)
  .patch(bookingController.updateOne)
  .delete(bookingController.deleteOne);

module.exports = Router;
