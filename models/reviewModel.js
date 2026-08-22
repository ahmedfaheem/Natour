const { default: mongoose } = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to user'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

reviewSchema.statics.calcAvgRating = async function (tourId) {
  // use static method to use this which refer to Model and aggregate need model (this)
  const stats = await this.aggregate([
    {
      $match: {
        tour: tourId,
      },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: Math.round(stats[0].avgRating),
    ratingsQuantity: stats[0].nRating,
  });
  console.log(stats);
};

reviewSchema.post('save', function () {
  // Can not use Review Before Declaring so this here point to document so use this.constructor which get the Model
  //Review.calcAvgRating();
  this.constructor.calcAvgRating(this.tour);
});

reviewSchema.pre(/^find/, function () {
  this.populate({
    path: 'user',
    select: 'name photo',
  })
    // .populate({
    //   path: 'tour',
    //   select: 'name',
    // })
    .select('-__v');
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
