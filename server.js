require('dotenv').config();

const express = require('express');
const connection = require('./database');
const router = require('./routers');

const app = express();
app.use('/', router);

const PORT = process.env.PORT || 3000;

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