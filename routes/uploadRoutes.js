const express = require('express');
const { upload } = require('../config/cloudinary');
const { uploadImage } = require('../controllers/uploadController');

const router = express.Router();

// ✅ Route for uploading images
router.post('/', upload.single('file'), uploadImage);

module.exports = router;
