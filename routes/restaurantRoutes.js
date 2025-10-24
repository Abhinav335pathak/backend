const express = require('express');
const multer = require('multer');
const restaurantController = require('../controllers/restaurantController');
const { protectRestaurant } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// --------- PUBLIC ROUTES ---------
router.post(
  '/register',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  restaurantController.registerRestaurant
);

router.post('/login', restaurantController.loginRestaurant);

// --------- PROTECTED ROUTES ---------
router.get('/profile', protectRestaurant, restaurantController.getProfileRestaurant);

router.put(
  '/profile',
  protectRestaurant,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),
  restaurantController.updateProfileRestaurant
);

router.patch('/toggle-status', protectRestaurant, restaurantController.toggleStatus);

module.exports = router;
