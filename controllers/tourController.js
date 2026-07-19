const Tour = require('../models/tourModel');

exports.getAllTours = (req, res) => {};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: newTour,
    });
  } catch (e) {
    res.status(201).json({
      status: 'fail',
      error: 'Invalid Data.',
    });
  }
};

exports.getTourByID = (req, res) => {};

exports.updateTour = (req, res) => {};

exports.deleteTour = (req, res) => {};
