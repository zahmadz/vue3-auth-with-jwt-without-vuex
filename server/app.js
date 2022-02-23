require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const cookies = require('cookie-parser');
const cors = require('cors');

const MONGO_CONNECTION_STRING = 'mongodb://localhost:27017/blog';
mongoose
  .connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true })
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(3000, () => {
      console.log('✅ Server is listening on port 3000');
    });
  })
  .catch((err) => {
    console.log('❌ Error connecting to MongoDB', err);
  });

app.use(
  cors({
    origin: 'http://localhost:8080',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookies());

app.use('/auth', require('./routes/auth.router'));
// app.use('/blog', require('./routes/blog.router'));

// error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: err.message,
  });
});

// 404 route not found handling middleware
app.use((req, res, next) => {
  res.status(404).send('Route not found');
});
