/* eslint-disable */
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const handlerFactory = require('./handlerFactory');
const User = require('../models/userModel');

exports.getCheckout = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://natours.dev/img/tours/${tour.imageCover}`],
          },
        },
        quantity: 1,
      },
    ],
  });

  return res.status(200).json({
    status: 'success',
    data: session,
  });
});

// this is temporary handler- used only in development-- we use webhook in production
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect('/');
});

const createBooking = catchAsync(async (session) => {
  // console.log('done::', session);
  const user = await User.findOne({ email: session.customer_email });
  await Booking.create({
    tour: session.client_reference_id,
    user: user._id,
    price: session.amount_total / 100,
  });
});
exports.handleCheckout = catchAsync(async (req, res) => {
  let event;
  if (process.env.WEBHOOK_SECRET) {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.WEBHOOK_SECRET,
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  if (event.type === 'checkout.session.completed') {
    await createBooking(event.data.object);
  }
  res.json({ received: true });
});

exports.getAll = handlerFactory.getAll(Booking);

exports.createOne = handlerFactory.createOne(Booking);

exports.getOne = handlerFactory.getOne(Booking);

exports.deleteOne = handlerFactory.deleteOne(Booking);
exports.updateOne = handlerFactory.updateOne(Booking);
