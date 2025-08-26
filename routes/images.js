const express = require('express');
const { uploadImage, getImages, searchImages } = require('../controllers/imageController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.use(protect);

router.post('/', upload.single('image'), uploadImage);
router.get('/', getImages);
router.get('/search', searchImages);

module.exports = router;