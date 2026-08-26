const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking Must Belong to Tour'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking Must Belong to User'],
  },
  price: {
    type: Number,
    required: [true, 'Must Provide Price'],
  },
  paid: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

bookingSchema.pre(/^find/, function () {
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
});
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
