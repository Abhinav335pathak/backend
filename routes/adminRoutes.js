const express = require('express');
const adminController = require('../controllers/adminController');
const { protect, roleCheck } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/restaurants/pending', protect, roleCheck(['admin']), adminController.pendingRestaurants);
router.put('/restaurants/:id/approve', protect, roleCheck(['admin']), adminController.approveRestaurant);
router.put('/restaurants/:id/reject', protect, roleCheck(['admin']), adminController.rejectRestaurant);

module.exports = router;