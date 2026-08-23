/* eslint-disable */

import 'core-js/stable';

import { login, logout } from './login.js';
import { displayMap } from './mapbox';
const loginForm = document.querySelector('.login-form .form');
const logOutBtn = document.querySelector('.nav__el--logout');

const mapBox = document.getElementById('map');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  const mapBoxToken = mapBox.dataset.mapboxToken;
  // display map
  displayMap(locations, mapBoxToken);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);
