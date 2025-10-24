const express = require('express');
const orderController = require('../controllers/orderController');
const { protectAny, roleCheck } = require('../middleware/authMiddleware');


const router = express.Router();


router.post('/', protectAny, roleCheck(['user']), orderController.createOrder);
router.get('/', protectAny, roleCheck(['user', 'restaurant']), orderController.getOrders);
router.get('/:id', protectAny, roleCheck(['user', 'restaurant']), orderController.getOrderById);
router.put('/:id', protectAny, roleCheck(['user', 'restaurant']), orderController.updateOrder);
router.delete('/:id', protectAny, roleCheck(['user']), orderController.deleteOrder);

module.exports = router;
