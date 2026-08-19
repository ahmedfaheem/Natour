const APIFeature = require('../utils/APIFeatures');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const tour = await Model.findByIdAndDelete(req.params.id);
    if (!tour) {
      return next(new AppError('Document Not Found', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      returnDocument: 'after',
    });

    if (!doc) {
      return next(new AppError('Document Not Found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filterOpt = {};
    if (req.params.tourId) filterOpt = { tour: req.params.tourId };

    const APIDoc = new APIFeature(Model.find(filterOpt), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    const Docs = await APIDoc.query;

    const totalDocuments = await Model.countDocuments();
    const totalPages = Math.ceil(totalDocuments / APIDoc.limit);
    const page = APIDoc.page;

    res.status(200).json({
      status: 'success',
      data: {
        totalPages: totalPages,
        pageNumber: APIDoc.page,
        limit: APIDoc.limit,
        Docs,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  });

exports.getOne = (Model, popOpts) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOpts) query = query.populate(popOpts);
    const doc = await query;

    if (!doc) {
      return next(new AppError('Document Not Found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });
