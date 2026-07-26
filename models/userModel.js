const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide your name'],
    minlength: [3, 'you name must at least 3 charachter'],
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    unique: [true, 'email must be unique'],
    validate: [isEmail, 'Invalid Email'],
    lowercase: true, // transform to lowercase
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'please provide your password'],
    minlength: [8, 'password must at least 8 charachter'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please provide your password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
