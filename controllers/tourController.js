const Tour = require('../models/tourModel');

exports.aliasTopCheap = async (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  req.query.limit = '5';
  req.query.page = '1';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // 1A: Filter
    const queryObj = structuredClone(req.query);
    const excludedQuery = ['page', 'limit', 'sort', 'fields'];
    excludedQuery.forEach((el) => delete queryObj[el]);

    //1B: Advanced Filter
    /*
    127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=difficult&page=5
    to make this input  in this format use setting option  'query parser' to qs package 
    -----
    from { duration: { 'gte': '5' }, difficulty: 'difficult' }
    to { duration: { '$gte': '5' }, difficulty: 'difficult' }
    */
    // \b -- Word Boundary- only word without anything spaces or letter
    let queryStr = JSON.stringify(queryObj);
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
    let query = Tour.find(JSON.parse(queryStr));

    //2A - Sort
    /*
    GET /api/v1/tours?sort=price  --> ASC
    GET /api/v1/tours?sort=-price  --> DEC
    GET /api/v1/tours?sort=price,duration  --> ASC -- if have same price, sort by duration
    
    */
    if (req.query.sort) {
      // query.sort('price duration)   defualt is Ascending  adding - make it DEC
      //  query.sort({price: 1,duration: -1})

      let sortQ = req.query.sort;
      sortQ = sortQ.split(',').join(' ');
      console.log(sortQ);
      query = query.sort(sortQ);
    } else {
      query = query.sort('-createdAt');
    }

    // 3A- Limiting Fields (projection)
    /*
    .selcet('a b c')   only this
    .selcet('-a -b -c')  all execpt this 

     GET /api/v1/tours?fields=name,duration,price
     GET /api/v1/tours?fields=-name,-duration,-price
     */

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      // console.log(fields);
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4A- Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const totalDocuments = await Tour.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      if (skip >= totalDocuments) throw new Error('Page Not Found');
    }
    const tours = await query;

    res.status(200).json({
      status: 'success',
      data: {
        totalPages: totalPages,
        pageNumber: page,
        limit: limit,
        tours,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (e) {
    res.status(404).json({
      status: 'fail',
      error: e,
    });
    console.log(e);
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
