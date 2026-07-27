const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const Router = express.Router();

Router.post('/signup', authController.signup);
Router.post('/signin', authController.signin);

Router.post('/forgotPassword', authController.forgotPassword);
Router.patch('/resetPassword/:token', authController.resetPassword);

Router.route('/')
  .get(authController.protect, userController.getAllUsers)
  .post(userController.createUser);

Router.route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = Router;
