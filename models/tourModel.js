const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is Required'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'Price Required'],
  },
});

const Tour = mongoose.Model('Tour', tourSchema);

module.exports = Tour;
