const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');

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
    // only for validation
    type: String,
    required: [true, 'please provide your password'],
    validate: {
      // work only with SAVE (create or update) not findByIdAndUodate
      // can use User.save to update
      validator: function (val) {
        return this.password === val;
      },
      message: 'passwords are not the same',
    },
  },
});

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    // delete passwordConfirm becuase it used only for validation
    this.passwordConfirm = undefined;
  }
});
const User = mongoose.model('User', userSchema);

module.exports = User;
