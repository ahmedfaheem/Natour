const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const app = require('./app');

//console.log(process.env.PORT);

const PORT = process.env.PORT || 3000;
const { DB_USER, DB_PASS } = process.env;

mongoose
  .connect(`mongodb+srv://${DB_USER}:${DB_PASS}@learn.pnb0djv.mongodb.net/`)
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(() => {
    console.log('Failed To Connect');
  });

app.listen(PORT, () => {
  console.log('Server Running......');
});
