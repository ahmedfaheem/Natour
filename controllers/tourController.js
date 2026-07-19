const fs = require('fs');

// check body middleware

exports.checkBody = (req, res, next) => {
  const { body } = req;
  if ((!body && !body.name) || !body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing Name or Price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {};

exports.createTour = (req, res) => {};

exports.getTourByID = (req, res) => {};

exports.updateTour = (req, res) => {};

exports.deleteTour = (req, res) => {};
