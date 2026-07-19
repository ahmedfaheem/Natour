const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const queryObj = structuredClone(req.query);
    const excludedQuery = ['page', 'limit', 'sort', 'fields'];
    excludedQuery.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);

    /*
    127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=difficult&page=5
    to make this input  in this format use setting option  'query parser' to qs package 
    -----
    from { duration: { 'gte': '5' }, difficulty: 'difficult' }
    to { duration: { '$gte': '5' }, difficulty: 'difficult' }
    */
    // \b -- Word Boundary- only word without anything spaces or letter
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    //console.log(JSON.parse(queryStr));

    //Method 1
    // const tours = await Tour.find({ duration: { '$gte': '5' }, difficulty: 'difficult' });

    // Method 2
    //Tour.find();  return query
    // const tours = await Tour.find()
    //   .where('difficulty')
    //   .equals('easy')
    //   .where('duration')
    //   .lt(5);

    //Method 3
    // as know it return query which can chanin sort and another query
    const query = Tour.find(JSON.parse(queryStr));

    const tours = await query;
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
