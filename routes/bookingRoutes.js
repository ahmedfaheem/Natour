const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const Router = express.Router();

Router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckout,
);
module.exports = Router;
