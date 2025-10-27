const { cloudinary } = require('../config/cloudinary');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded',
      });
    }

    // Cloudinary already uploaded the image via multer-storage-cloudinary
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully!',
      secure_url: req.file.path, // ✅ Cloudinary secure URL
      public_id: req.file.filename, // ✅ Cloudinary public ID
    });
  } catch (error) {
    console.error('❌ Upload controller error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed',
    });
  }
};
