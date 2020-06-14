require('dotenv').config();
const config = require('config');

const express = require('express');
const connection = require('./database');
const router = require('./routers');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', router);

const PORT = process.env.PORT || config.get('port');

// Start your app.
connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server is listening on ${PORT}`));
});

// Close MongoDB connection
process.on('SIGINT', () => {
  connection.close(() => {
    console.log('Mongoose disconnected!');
    process.exit(0);
  });
});