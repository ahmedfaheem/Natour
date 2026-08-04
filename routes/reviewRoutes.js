const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const Router = express.Router();

Router.route('/')
  .get(reviewController.getAll)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.create,
  );

module.exports = Router;
