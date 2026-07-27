const mongoose = require('mongoose');
const { default: isEmail } = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
  role: {
    type: String,
    enum: ['admin', 'user', 'lead-guide', 'guide'],
    default: 'user',
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'please provide your password'],
    minlength: [8, 'password must at least 8 charachter'],
    select: false,
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
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpire: Date,
});

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    // delete passwordConfirm becuase it used only for validation
    this.passwordConfirm = undefined;
  }
});

userSchema.methods.correctPassword = async function (
  inputPassword,
  hashedPassword,
) {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

//check if password changed after token issued
userSchema.methods.isPasswordChanged = function (JWTCreatedTime) {
  if (this.passwordChangeAt) {
    const changedDateTimeStamp = Math.floor(
      this.passwordChangeAt.getTime() / 1000,
    );

    return JWTCreatedTime < changedDateTimeStamp;
  }
  return false;
};

userSchema.methods.setPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  const hasedToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetToken = hasedToken;
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000; // 10 min * 60 sec * 1000 to milesecond

  return token;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
