require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/db');
const authRoutes = require('./routes/auth.routes');
const songsRoutes = require('./routes/songs.routes');

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.get('/', (req, res) => {
  res.send('Authentication backend server is online and running perfectly!');
});

app.use('/api/auth', authRoutes);
app.use('/api/songs', songsRoutes);

module.exports = app;
