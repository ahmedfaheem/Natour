const dotenv = require('dotenv');
const dns = require('node:dns');

dotenv.config({ path: './config.env' });

if (process.env.DNS_SERVERS) {
  dns.setServers(
    process.env.DNS_SERVERS.split(',').map((server) => server.trim()),
  );
}
const mongoose = require('mongoose');

const app = require('./app');

//console.log(process.env.PORT);

const PORT = process.env.PORT || 3000;

const DB = process.env.DB_GLOBAL.replace('<PASSWORD>', process.env.DB_PASS);
mongoose
  // .connect(DB)
  .connect(DB)
  .then(() => {
    console.log('Connected to DB');
  });
// .catch((e) => { // instead on that we will handle unhandledRejection to handle promise rejection errors which is outside express like this
//   console.log('Failed To Connect', e);
// });

const server = app.listen(PORT, () => {
  console.log('Server Running......');
});

// handle errors outside express
process.on('unhandledRejection', (e) => {
  console.log(e.name, e.message);
  server.close(() => {
    // gracefully shutdown but give time to handle all currently requests
    process.exit(1);
  });
});
