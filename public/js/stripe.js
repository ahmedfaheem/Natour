/* eslint-disable */
import axios from 'axios';
export const BookNow = async function (tourId) {
  const session = await axios.get(
    `/api/v1/bookings/checkout-session/${tourId}`,
  );
  //  console.log(session);
  window.location.href = session.data.data.url;
};
