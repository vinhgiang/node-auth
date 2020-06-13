const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { connection } = mongoose;
connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:'),
);
module.exports = connection;
