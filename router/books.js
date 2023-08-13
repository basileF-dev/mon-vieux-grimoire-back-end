const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer');
const sharp = require ('../middleware/sharp')
const booksCtrl = require('../controllers/books');

router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRating);
router.get('/:id', booksCtrl.getOneBook);
router.post('/', auth, multer, sharp, booksCtrl.postOneBook);
router.post('/:id/rating', auth, booksCtrl.postOneRating)
router.put('/:id', auth, multer, sharp, booksCtrl.putOneBook)
router.delete('/:id', auth, booksCtrl.deleteOneBook);

module.exports = router;