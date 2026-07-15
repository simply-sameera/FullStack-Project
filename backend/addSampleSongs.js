const mongoose = require('mongoose');
require('dotenv').config();

const Song = require('./src/model/songs.model');

async function addSampleSongs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Sample songs with different moods
    const sampleSongs = [
      {
        title: 'Happy Days',
        artist: 'Joy Band',
        mood: 'happy',
        audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      },
      {
        title: 'Sunny Vibes',
        artist: 'Sunshine',
        mood: 'happy',
        audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
      },
      {
        title: 'Sad Melodies',
        artist: 'Blues Master',
        mood: 'sad',
        audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
      },
      {
        title: 'Crying Inside',
        artist: 'Soul Singer',
        mood: 'sad',
        audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
      },
      {
        title: 'Angry Storm',
        artist: 'Rock Band',
        mood: 'angry',
        audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
      },
      {
        title: 'Chill Vibes',
        artist: 'Relaxation',
        mood: 'neutral',
        audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
      },
      {
        title: 'Fearless',
        artist: 'Fear Factor',
        mood: 'fearful',
        audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
      },
      {
        title: 'Surprised Me',
        artist: 'Surprise Gang',
        mood: 'surprised',
        audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
      },
      {
        title: 'Disgusted',
        artist: 'Negative Vibes',
        mood: 'disgusted',
        audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'
      }
    ];

    // Clear existing songs
    await Song.deleteMany({});
    console.log('Cleared existing songs');

    // Insert sample songs
    const inserted = await Song.insertMany(sampleSongs);
    console.log(`Successfully added ${inserted.length} sample songs`);
    console.log('Songs added:', inserted);

    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error adding songs:', error);
    process.exit(1);
  }
}

addSampleSongs();
