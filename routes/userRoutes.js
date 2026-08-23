const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const Router = express.Router();

Router.post('/signup', authController.signup);
Router.post('/signin', authController.signin);
Router.get('/logout', authController.logout);
Router.post('/forgotPassword', authController.forgotPassword);
Router.patch('/resetPassword/:token', authController.resetPassword);

// this middleware will apllied to any routes after this line
Router.use(authController.protect);

Router.patch('/updateMyPassword', authController.updatePassword);
Router.patch('/updateMe', userController.updateMe);
Router.delete('/deleteMe', userController.deleteMe);
Router.get('/me', userController.getMe, userController.getUserById);

Router.use(authController.restrictTo('admin'));

Router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

Router.route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser) // not use for update password becasue findByIdAndUpdate not call save middleware
  .delete(userController.deleteUser);

module.exports = Router;
