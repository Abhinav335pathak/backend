const express = require('express');
const menuItemController = require('../controllers/menuItemController');
const { protectRestaurant, roleCheck } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', menuItemController.getMenuItems);
router.get('/:id', menuItemController.getMenuItemById); // ✅ added this
router.get('/restaurant/:restaurantId', menuItemController.getMenuItemsByRestaurant); // by restaurant
// Protected CRUD routes (restaurant only)
router.post('/', protectRestaurant, roleCheck(['restaurant']), menuItemController.createMenuItem);
router.put('/:id', protectRestaurant, roleCheck(['restaurant']), menuItemController.updateMenuItem);
router.delete('/:id', protectRestaurant, roleCheck(['restaurant']), menuItemController.deleteMenuItem);

module.exports = router;
