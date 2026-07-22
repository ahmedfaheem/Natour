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
  })
  .catch((e) => {
    console.log('Failed To Connect', e);
  });

app.listen(PORT, () => {
  console.log('Server Running......');
});
