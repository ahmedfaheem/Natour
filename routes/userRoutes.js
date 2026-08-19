const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const Router = express.Router();

Router.post('/signup', authController.signup);
Router.post('/signin', authController.signin);

Router.post('/forgotPassword', authController.forgotPassword);
Router.patch('/resetPassword/:token', authController.resetPassword);
Router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);
Router.patch('/updateMe', authController.protect, userController.updateMe);
Router.delete('/deleteMe', authController.protect, userController.deleteMe);

Router.route('/')
  .get(authController.protect, userController.getAllUsers)
  .post(userController.createUser);

Router.route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser) // not use for update password becasue findByIdAndUpdate not call save middleware
  .delete(userController.deleteUser);

module.exports = Router;
