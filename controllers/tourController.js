const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      data: tours,
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      error: e,
    });
  }
};

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
    res.status(400).json({
      status: 'fail',
      error: 'Invalid Data.',
    });
  }
};

exports.getTourByID = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      error: e,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, reqbody, {
      runValidators: true,
      returnDocument: 'after',
    });
    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      error: e,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      error: e,
    });
  }
};
