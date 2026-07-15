import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { motion } from "framer-motion";
import { Pause, Play } from "lucide-react";

export default function FacialExpression() {
  const videoRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [expression, setExpression] = useState("Not detected");
  const [songs, setSongs] = useState([]);
  const [cameraActive, setCameraActive] = useState(true);

  const url = "http://localhost:5000/api/songs";
  async function fetchSongs() {
    try {
      const data = await fetch(url);
      if (!data.ok) throw new Error('Failed to fetch songs');
      const data1 = await data.json();
      console.log(data1);
      setSongs(data1.all || [])
    } catch (error) {
      console.error('Error fetching songs:', error);
      setSongs([]);
    }
  }

  useEffect(() => {
    fetchSongs();
  }, []);

  console.log(songs)

  const filterSongs = songs.filter((el) => el.mood === expression);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
        startVideo();
      } catch (error) {
        console.error("Error loading face-api models:", error);
        setModelsLoaded(false);
      }
    };
    const startVideo = () => {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }).catch((error) => {
        console.error("Error accessing camera:", error);
        setCameraActive(false);
      });
    };
    loadModels();
  }, []);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    }).catch((error) => {
      console.error("Error accessing camera:", error);
      setCameraActive(false);
    });
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const handleClick = async () => {
    if (!modelsLoaded) return;
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();
    if (detection) {
      const sorted = Object.entries(detection.expressions).sort(
        (a, b) => b[1] - a[1]
      );
      setExpression(sorted[0][0]);
    }
  };

  // ---- SINGLE audio element ke liye ----
  const audioRef = useRef(null);
  const [currentId, setCurrentId] = useState(null); // kaunsa song load hai
  const [isPlaying, setIsPlaying] = useState(false); // audio events se sync

  const handlePlay = (song) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentId === song._id) {
      // same song → toggle
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    } else {
      // dusra song → src switch phir play
      audio.src = song.audioFile;
      setCurrentId(song._id);
      setIsPlaying(false);
      audio.play().catch(() => {});
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9ff] px-10 py-6">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-semibold mb-8 flex items-center gap-2"
      >
        🎧 Moody Player
      </motion.header>

      <div className="flex gap-12 items-center">
        <motion.video
          ref={videoRef}
          autoPlay
          muted
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            width: "320px",
            height: "240px",
            backgroundColor: "#e0e0e0",
            opacity: cameraActive ? 1 : 0.5,
            border: cameraActive ? "2px solid green" : "2px solid red"
          }}
          className="w-[320px] h-[240px] rounded-xl object-cover shadow-md"
        />

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <h2 className="text-2xl font-bold mb-2">Live Mood Detection</h2>
          <p className="text-gray-600 mb-4">
            Your current mood is being analyzed in real-time. Enjoy music
            tailored to your feelings.
          </p>

          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClick}
              className="bg-purple-600 text-white px-6 py-2 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!cameraActive}
            >
              Start Listening
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={cameraActive ? stopCamera : startCamera}
              className={`text-white px-6 py-2 rounded-full shadow-md ${
                cameraActive ? 'bg-red-600' : 'bg-blue-600'
              }`}
            >
              {cameraActive ? 'Stop Camera' : 'Start Camera'}
            </motion.button>
          </div>

          <p className="mt-3 text-sm text-gray-700">
            <span className="font-semibold">Detected Mood:</span> {expression}
          </p>
          {!cameraActive && (
            <p className="mt-2 text-sm text-red-600 font-semibold">📹 Camera is off - Click 'Start Camera' to enable</p>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 max-w-3xl"
      >
        <h3 className="text-xl font-semibold mb-4">Recommended Tracks</h3>

        {songs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No songs available. Please add songs to the database.</p>
        ) : filterSongs.length === 0 && expression !== "Not detected" ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No tracks match your current mood: <span className="font-semibold">{expression}</span></p>
            <p className="text-sm text-gray-400 mt-2">Available moods: {[...new Set(songs.map(s => s.mood))].join(', ')}</p>
          </div>
        ) : expression === "Not detected" ? (
          <p className="text-gray-500 text-center py-8">Click 'Start Listening' to detect your mood and get recommendations</p>
        ) : null}

        <div className="space-y-3">
          {filterSongs.map((song) => {
            const playingThis = currentId === song._id && isPlaying;
            return (
              <motion.div
                key={song._id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm"
              >
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-sm text-gray-500">{song.artist}</p>
                </div>

                <motion.button
                  onClick={() => handlePlay(song)}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg"
                >
                  {playingThis ? <Pause size={28} /> : <Play size={28} />}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Ek hi audio — loop ke BAHAR */}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        crossOrigin="anonymous"
      />
    </div>
  );
}