const express = require('express');
const { addArtist, editArtist, getArtists, deleteArtist, detailArtist } = require('../Controllers/Artist');
const {Login, Register, checkAuth} = require('../Controllers/Auth')
const { addMusic, getMusics, detailMusic, deleteMusic, editMusic, searchMusic } = require('../Controllers/Music');
const { getTransaction, detailTransaction, addTransaction, approveTransaction, deleteTransaction, cancelTransaction,transactionByUserId } = require('../Controllers/Transaction');
const {Auth} = require('../middlewares/Auth')
const {uploadFile} = require('../middlewares/uploadFile')

const router = express.Router()

router.get('/check-auth',Auth, checkAuth)
router.post('/login', Login)
router.post('/register', Register)

router.get('/artists', Auth, getArtists)
router.post('/artist', Auth, addArtist)
router.get('/artist/:id', Auth, detailArtist)
router.patch('/artist/:id', Auth, editArtist)
router.delete('/artist/:id', Auth, deleteArtist)

router.get('/musics', getMusics)
router.get('/music/:id', Auth, detailMusic)
router.post('/music', Auth,uploadFile('thumbnail','attache'),addMusic)
router.patch('/music/:id/:userId', Auth,uploadFile('thumbnail','attache'),editMusic)
router.delete('/music/:id', Auth, deleteMusic)
router.post('/search-music', searchMusic)

router.get('/transaction/:id', Auth, detailTransaction)
router.get('/transaction/', Auth, transactionByUserId)
router.get('/transactions', Auth, getTransaction)
router.post('/transaction', Auth,uploadFile('attache'),addTransaction)
router.post('/transaction/:transactionId', Auth, approveTransaction)
router.patch('/transaction/:transactionId', Auth, cancelTransaction)
router.delete('/transaction/:id', Auth, deleteTransaction)

module.exports = router