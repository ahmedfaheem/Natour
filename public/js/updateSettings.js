/* eslint-disable */
import { showAlert } from './alerts.js';
import axios from 'axios';
export const updateData = async (data) => {
  const { name, email } = data;

  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data: {
        name,
        email,
      },
    });

    if (res.data.status === 'success')
      showAlert('success', 'Data updated successfully!');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const updatePassword = async (data) => {
  const { passwordCurrent, password, passwordConfirm } = data;
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMyPassword',
      data: {
        oldPassword: passwordCurrent,
        newPassword: password,
        passwordConfirm: passwordConfirm,
      },
    });
    if (res.data.status === 'success')
      showAlert('success', 'Password updated successfully!');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
