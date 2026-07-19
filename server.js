const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const app = require('./app');

//console.log(process.env.PORT);

const PORT = process.env.PORT || 3000;

const DB = process.env.DB_GLOBAL.replace('<PASSWORD>', process.env.DB_PASS);
mongoose
  .connect(DB)
  // .connect(process.env.DB_LOCAL)
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(() => {
    console.log('Failed To Connect');
  });

app.listen(PORT, () => {
  console.log('Server Running......');
});
