const Tour = require('../models/tourModel');
const APIFeature = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const handlerFactory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

const fileStorage = multer.memoryStorage();

const fileFilter = (req, file, cp) => {
  if (file.mimetype.split('/')[0] !== 'image') {
    cp(new AppError('Only Support Image Uploading', 400));
  }

  cp(null, true);
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeToursImages = catchAsync(async (req, res, next) => {
  // console.log(req.files);
  if (!req.files.imageCover || !req.files.images) next();

  //1 resize imageCover
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`./public/img/tours/${req.body.imageCover}`);

  //2 resize images
  req.body.images = [];
  const imagesPromises = req.files.images.map(async (img, i) => {
    const name = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
    await sharp(img.buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`./public/img/tours/${name}`);
    req.body.images.push(name);
  });

  await Promise.all(imagesPromises);

  next();
});
exports.aliasTopCheap = async (req, res, next) => {
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  req.query.limit = '5';
  req.query.page = '1';
  next();
};

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // 1A: Filter
//   // const queryObj = structuredClone(req.query);
//   // const excludedQuery = ['page', 'limit', 'sort', 'fields'];
//   // excludedQuery.forEach((el) => delete queryObj[el]);

//   //1B: Advanced Filter
//   /*
//     127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=difficult&page=5
//     to make this input  in this format use setting option  'query parser' to qs package
//     -----
//     from { duration: { 'gte': '5' }, difficulty: 'difficult' }
//     to { duration: { '$gte': '5' }, difficulty: 'difficult' }
//     */
//   // \b -- Word Boundary- only word without anything spaces or letter
//   // let queryStr = JSON.stringify(queryObj);
//   // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//   //console.log(JSON.parse(queryStr));

//   //Method 1
//   // const tours = await Tour.find({ duration: { '$gte': '5' }, difficulty: 'difficult' });

//   // Method 2
//   //Tour.find();  return query
//   // const tours = await Tour.find()
//   //   .where('difficulty')
//   //   .equals('easy')
//   //   .where('duration')
//   //   .lt(5);

//   //Method 3
//   // as know it return query which can chanin sort and another query
//   //  let query = Tour.find(JSON.parse(queryStr));

//   //2A - Sort
//   /*
//     GET /api/v1/tours?sort=price  --> ASC
//     GET /api/v1/tours?sort=-price  --> DEC
//     GET /api/v1/tours?sort=price,duration  --> ASC -- if have same price, sort by duration

//     */
//   // if (req.query.sort) {
//   //   // query.sort('price duration)   defualt is Ascending  adding - make it DEC
//   //   //  query.sort({price: 1,duration: -1})

//   //   let sortQ = req.query.sort;
//   //   sortQ = sortQ.split(',').join(' ');
//   //   console.log(sortQ);
//   //   query = query.sort(sortQ);
//   // } else {
//   //   query = query.sort('-createdAt');
//   // }

//   // 3A- Limiting Fields (projection)
//   /*
//     .selcet('a b c')   only this
//     .selcet('-a -b -c')  all execpt this

//      GET /api/v1/tours?fields=name,duration,price
//      GET /api/v1/tours?fields=-name,-duration,-price
//      */

//   // if (req.query.fields) {
//   //   const fields = req.query.fields.split(',').join(' ');
//   //   // console.log(fields);
//   //   query = query.select(fields);
//   // } else {
//   //   query = query.select('-__v');
//   // }

//   // 4A- Pagination
//   // const page = Number(req.query.page) || 1;
//   // const limit = Number(req.query.limit) || 5;
//   // const skip = (page - 1) * limit;
//   // const totalDocuments = await Tour.countDocuments();
//   // const totalPages = Math.ceil(totalDocuments / limit);
//   // query = query.skip(skip).limit(limit);

//   // if (req.query.page) {
//   //   if (skip >= totalDocuments) throw new Error('Page Not Found');
//   // }

//   const APITours = new APIFeature(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .pagination();
//   const tours = await APITours.query;

//   const totalDocuments = await Tour.countDocuments();
//   const totalPages = Math.ceil(totalDocuments / APITours.limit);
//   const page = APITours.page;

//   res.status(200).json({
//     status: 'success',
//     data: {
//       totalPages: totalPages,
//       pageNumber: APITours.page,
//       limit: APITours.limit,
//       tours,
//       hasNext: page < totalPages,
//       hasPrev: page > 1,
//     },
//   });
// });

// exports.createTour = catchAsync(async (req, res, next) => {
//   // const newTour = new Tour({});
//   // newTour.save();
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'Success',
//     data: newTour,
//   });
// });

exports.getAllTours = handlerFactory.getAll(Tour);
exports.createTour = handlerFactory.createOne(Tour);

// exports.getTourByID = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate('reviews');

//   if (!tour) {
//     return next(new AppError('Tour Not Found', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: tour,
//   });
// });

exports.getTourByID = handlerFactory.getOne(Tour, { path: 'reviews' });

// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     runValidators: true,
//     returnDocument: 'after',
//   });

//   if (!tour) {
//     return next(new AppError('Tour Not Found', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: tour,
//   });
// });

exports.updateTour = handlerFactory.updateOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('Tour Not Found', 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

exports.deleteTour = handlerFactory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: {
    //     _id: { $ne: 'EASY' },
    //   },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

exports.getMonthlyPaln = catchAsync(async (req, res, next) => {
  const year = req.params.year;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-1-1`),
          $lte: new Date(`${year}-12-30`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $sort: { numTours: -1 },
    },
    {
      $project: {
        _id: 0, // 0 or 1
      },
    },
    {
      $limit: 3,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: plan,
  });
});
// /tour-within/:distance/center/:latlang/unit/:unit
//{{URL}}/api/v1/tours/tour-within/50/center/35.69299463209881,-115.36193847656251/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlang, unit } = req.params;
  const [lat, lng] = latlang.split(',');
  if (!lat || !lng) {
    return new AppError(
      'Provide Lattiude and Langitude in lat,lang format',
      400,
    );
  }

  // need raduis in proper format which is in radians
  // in mile divide by 3963.2 and if in km  divide by 6378.1
  const raduis = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], raduis] },
    },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
});

// /distances/:latlang/unit/:unit
//{{URL}}/api/v1/tours/distances/35.69299463209881,-115.36193847656251/unit/mi

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlang, unit } = req.params;
  const [lat, lng] = latlang.split(',');
  if (!lat || !lng) {
    return new AppError(
      'Provide Lattiude and Langitude in lat,lang format',
      400,
    );
  }
  // in mile : km
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  // must set the geospatial index for startLocation field so $geoNear know that to hit it
  const tours = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1], // cast to number
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier, // to get the scale in spicifed unit
      },
    },
    {
      $project: { distance: 1, name: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours,
  });
});
