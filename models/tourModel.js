const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is Required'],
    unique: true,
    trim: true,
  },
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
  priceDiscount: Number,
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
  },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
