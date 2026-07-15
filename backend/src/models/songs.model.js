const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  title: String,
  artist: String,
  mood: String,
  audioFile: String
}, { timestamps: true });

module.exports = mongoose.model('Song', SongSchema);
