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
