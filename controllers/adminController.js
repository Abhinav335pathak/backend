const Restaurant = require('../models/Restaurant');

// ========================== GET PENDING RESTAURANTS ==========================
exports.pendingRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isActive: false }).select('-password');

    res.json({
      success: true,
      count: restaurants.length,
      restaurants
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== APPROVE RESTAURANT ==========================
exports.approveRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant)
      return res.status(404).json({ message: 'Restaurant not found' });

    if (restaurant.isActive)
      return res.status(400).json({ message: 'Restaurant already approved' });

    restaurant.isActive = true;
    await restaurant.save();

    return res.json({
      message: 'Restaurant approved successfully',
      restaurant: {
        id: restaurant._id,
        name: restaurant.name,
        email: restaurant.email,
        phone: restaurant.phone,
        address: restaurant.address,
        isActive: restaurant.isActive
      }
    });
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
};


// ========================== REJECT RESTAURANT ==========================
exports.rejectRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant)
      return res.status(404).json({ success: false, message: 'Restaurant not found' });

    await Restaurant.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Restaurant rejected and removed from the system'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
