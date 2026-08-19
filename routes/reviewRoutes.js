const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const Router = express.Router({ mergeParams: true });

// 2 Way works

// POST api/v1/tours/99965/reviews
// GET api/v1/tours/99965/reviews

// POST api/v1/reviews
// GET api/v1/reviews

Router.route('/')
  .get(reviewController.getAll)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIDs,
    reviewController.create,
  );

Router.route('/:id')
  .delete(reviewController.delete)
  .patch(reviewController.updateReview);
module.exports = Router;
