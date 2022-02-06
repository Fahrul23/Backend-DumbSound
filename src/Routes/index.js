const { getMusics} = require('../Controllers/Music');
const express = require('express')
const router = express.Router()
router.get('/musics', getMusics)

module.exports = router