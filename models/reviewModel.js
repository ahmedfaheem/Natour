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
      set: (val) => Math.round(val * 10) / 10,
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
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }

  //console.log(stats);
};

reviewSchema.post('save', async function () {
  // Can not use Review Before Declaring so this here point to document so use this.constructor which get the Model
  //Review.calcAvgRating();
  await this.constructor.calcAvgRating(this.tour);
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

// on Delete and Update, update rating of Tour
// first get tour doucment on pre then pass to query object to post middleware
// another solution can use in post this.query() to get id of review then findById to get all data
// then calc Stats
reviewSchema.pre(/^findOneAnd/, async function () {
  this.r = await this.model.findById(this.getQuery()._id);
});

reviewSchema.post(/^findOneAnd/, async function () {
  if (this.r) {
    await this.model.calcAvgRating(this.r.tour);
  }
});

// prevent user from make more than one review
// must use unique compound indexes
reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
