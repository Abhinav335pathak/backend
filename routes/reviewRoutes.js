const express = require('express');
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, reviewController.createReview);
router.get('/restaurant/:restaurantId', reviewController.getReviews); // Public or protected as needed
router.put('/:id', protect, reviewController.updateReview);
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;