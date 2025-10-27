const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

// ✅ Configure Cloudinary with your .env variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// 🧠 Debug log to confirm Cloudinary loaded
console.log('🧠 Cloudinary connected with:', {
  cloud_name: process.env.CLOUD_NAME || '❌ Missing',
  api_key: process.env.CLOUD_API_KEY ? '✅ Loaded' : '❌ Missing',
  api_secret: process.env.CLOUD_API_SECRET ? '✅ Loaded' : '❌ Missing',
});

// ✅ Multer Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'restaurants',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [
      { width: 800, height: 600, crop: 'limit' },
      { quality: 'auto' }
    ],
    public_id: `${Date.now()}_${file.originalname.split('.')[0]}`,
  }),
});



// ✅ Multer upload setup
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  },
});

module.exports = { cloudinary, upload };
