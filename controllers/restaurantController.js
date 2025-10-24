const Restaurant = require('../models/Restaurant');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ========================== HELPER: GENERATE JWT ==========================
const generateToken = (restaurant) => {
  return jwt.sign(
    { id: restaurant._id, role: 'restaurant' },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ========================== REGISTER ==========================
exports.registerRestaurant = async (req, res) => {
  try {
    const { name, email, password, phone, address, description } = req.body;

    const existing = await Restaurant.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: 'Restaurant already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const logo = req.files?.logo ? req.files.logo[0].path : null;
    const images = req.files?.images ? req.files.images.map(file => file.path) : [];

    const restaurant = new Restaurant({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      description,
      logo,
      images,
      isActive: false, // pending admin approval
      role: 'restaurant'
    });

    await restaurant.save();

    res.status(201).json({
      success: true,
      message: 'Restaurant registered successfully and pending admin approval',
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
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== LOGIN ==========================
exports.loginRestaurant = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(400).json({ message: 'Restaurant not found' });
    }

    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    if (!restaurant.isActive) {
      return res.status(403).json({ message: 'Restaurant not approved yet' });
    }

    const token = jwt.sign(
      { id: restaurant._id, role: 'restaurant' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return res.status(200).json({ token, user: restaurant });
  } catch (err) {
    // ONLY send response here, don't call next(err)
    console.error(err);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};



// ========================== GET PROFILE ==========================
// Get Restaurant Profile
exports.getProfileRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.user.id).select('-password');
    if (!restaurant)
      return res.status(404).json({ success: false, message: 'Restaurant not found' });

    res.json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// ========================== UPDATE PROFILE ==========================
exports.updateProfileRestaurant = async (req, res) => {
  try {
    const updates = req.body;
    const logo = req.files?.logo ? req.files.logo[0].path : undefined;
    const images = req.files?.images ? req.files.images.map(file => file.path) : undefined;

    if (logo) updates.logo = logo;
    if (images) updates.images = images;

    const restaurant = await Restaurant.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');

    if (!restaurant)
      return res.status(404).json({ success: false, message: 'Restaurant not found' });

    res.json({ success: true, message: 'Profile updated successfully', restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========================== TOGGLE STATUS ==========================
exports.toggleStatus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.user.id);
    if (!restaurant)
      return res.status(404).json({ success: false, message: 'Restaurant not found' });

    restaurant.isOpen = !restaurant.isOpen; // For availability (open/close restaurant)
    await restaurant.save();

    res.json({
      success: true,
      message: `Restaurant is now ${restaurant.isOpen ? 'open' : 'closed'}`,
      status: restaurant.isOpen
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
