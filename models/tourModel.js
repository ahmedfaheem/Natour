const slugify = require('slugify');

const validator = require('validator');
const mongoose = require('mongoose');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is Required'],
      unique: true,
      trim: true,
      minlength: [10, 'Name must be at least 10 characters'],
      maxlength: [40, 'Name must be at most 40 characters'],
      //  validator: [validator.isAlpha, 'Name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Duration is Required'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Max Group Size is Required'],
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is Required'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Price Required'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Description is Required'],
    },
    imageCover: {
      type: String,
      required: [true, 'Image Cover is Required'],
    },
    images: [String],
    startDates: [Date],
    createdAt: {
      type: Date,
      default: Date.now(),
      //select: false, not include in result
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'], // also there is another types
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: Array,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document Middleware
// work only with .create and .save not with insertOne or Many
tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
  // console.log(this);// body
});

// Embeding
tourSchema.pre('save', async function () {
  const guidesPromises = this.guides.map((el) => User.findById(el));
  this.guides = await Promise.all(guidesPromises);
});

// Query Middleware
tourSchema.pre(/^find/, function () {
  // tourSchema.pre("find", function () {
  // tourSchema.pre("findOne", function () {

  // console.log(this);// query object
  this.find({ secretTour: { $ne: true } });
  // this.Start = Date.now();
});

// tourSchema.post(/^find/, function (doc, next) {
//   // this -> query Object
//   //console.log('Exceute Time', Date.now() - this.Start);
//   next();
// });

// Aggregation Middleware

tourSchema.pre('aggregate', function () {
  //console.log(this.pipeline());
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline());
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
