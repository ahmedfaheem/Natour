const dotenv = require('dotenv');
const dns = require('node:dns');

const fs = require('fs');

dotenv.config({ path: './config.env' });

if (process.env.DNS_SERVERS) {
  dns.setServers(
    process.env.DNS_SERVERS.split(',').map((server) => server.trim()),
  );
}
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

const DB = process.env.DB_GLOBAL.replace('<PASSWORD>', process.env.DB_PASS);
mongoose
  .connect(DB)
  // .connect(process.env.DB_LOCAL)
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(() => {
    console.log('Failed To Connect');
    process.exit(1); // exit the process if failed to connect
  });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));

const deleteTours = async () => {
  try {
    await Tour.deleteMany();
    console.log('All Tours Deleted');
  } catch (err) {
    console.log('Error On Deleteting Tours', err);
  }
  process.exit();
};

const importTours = async () => {
  try {
    await Tour.create(tours);
    console.log('All Tours Imported');
  } catch (err) {
    console.log('Error On Importing Data', err);
  }
  process.exit();
};

//console.log(process.argv); // display all command params

if (process.argv[2] === '--import') {
  importTours();
} else if (process.argv[2] === '--delete') {
  deleteTours();
} else {
  console.log('Please Provide Option');
  process.exit();
}
