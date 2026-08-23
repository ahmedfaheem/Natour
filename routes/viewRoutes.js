const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const Router = express.Router();

Router.use(authController.isLoggedIn);

Router.get('/', viewController.getOverview);

Router.get('/tour/:slug', viewController.getTour);

Router.get('/login', viewController.getLoginForm);

module.exports = Router;
