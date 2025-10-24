const Review = require('../models/Review');

// ========================== CREATE REVIEW ==========================
exports.createReview = async (req, res) => {
  try {
    const { restaurantId, rating, comment } = req.body;

    if (!restaurantId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID and rating are required'
      });
    }

    // Check if the user already reviewed this restaurant
    const existingReview = await Review.findOne({
      restaurantId,
      userId: req.user.id
    });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this restaurant'
      });
    }

    const review = new Review({
      userId: req.user.id,
      restaurantId,
      rating,
      comment
    });
    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== GET REVIEWS FOR RESTAURANT ==========================
exports.getReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const reviews = await Review.find({ restaurantId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== UPDATE REVIEW ==========================
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const review = await Review.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      updates,
      { new: true }
    );

    if (!review)
      return res.status(404).json({ success: false, message: 'Review not found' });

    res.json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== DELETE REVIEW ==========================
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!review)
      return res.status(404).json({ success: false, message: 'Review not found' });

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
