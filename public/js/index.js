/* eslint-disable */

import 'core-js/stable';

import { login, logout } from './login.js';
import { updateData, updatePassword } from './updateSettings.js';
import { displayMap } from './mapbox';
const loginForm = document.querySelector('.login-form .form');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const mapBox = document.getElementById('map');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  const mapBoxToken = mapBox.dataset.mapboxToken;
  // display map
  displayMap(locations, mapBoxToken);
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm) {
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    // form.append('photo', document.getElementById('photo').files[0]);

    await updateData({ name, email });
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.form-user-settings .btn').textContent =
      'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updatePassword({ passwordCurrent, password, passwordConfirm });
    document.querySelector('.form-user-settings .btn').textContent =
      'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
