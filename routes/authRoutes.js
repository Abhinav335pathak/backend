const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);
router.post('/admin/register', authController.registerAdmin);
router.post('/admin/login', authController.loginAdmin);
router.post('/logout', protect, authController.logout); // General logout
router.get('/user/profile', protect, authController.getProfile); // Assuming for users
router.put('/user/profile', protect, authController.updateProfile);
router.get('/admin/profile', protect, authController.getProfile); // Reuses getProfile with role check if needed

module.exports = router;






