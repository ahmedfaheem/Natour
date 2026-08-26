const dotenv = require('dotenv');
const dns = require('node:dns');

dotenv.config({ path: './config.env' });

if (process.env.DNS_SERVERS) {
  dns.setServers(
    process.env.DNS_SERVERS.split(',').map((server) => server.trim()),
  );
}
const mongoose = require('mongoose');

// uncaught exception , run when there is any bug in syncrouns code
process.on('uncaughtException', (e) => {
  console.log('Uncaught Exception..');
  console.log(e.name, e.message);
  console.log(e.stack);

  process.exit(1);
});

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
  console.log('Unhandled Rejection, Server Shutdown');

  server.close(() => {
    // gracefully shutdown but give time to handle all currently requests
    process.exit(1);
  });
});

// implement SIGTERM Signal -- that  be sent when
process.on('SIGTERM', () => {
  console.log('SIGTERM Signal Received');
  server.close(() => {
    console.log('All Requests Completed ');
  });
});
