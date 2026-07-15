const express = require('express');
const router = express.Router();
const { createSong, allSongs } = require('../controller/songs.controller');

router.post('/', createSong);
router.get('/', allSongs);

module.exports = router;
