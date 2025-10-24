const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Restaurant = require('../models/Restaurant');

// Helper: Create JWT and set cookie
const createTokenAndSetCookie = (user, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // secure only in production
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000 // 1 hour
  });

  return token;
};

// =================== USER AUTH ===================

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, addresses } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      addresses,
      role: 'user'
    });
    await user.save();

    const token = createTokenAndSetCookie(user, res);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// // Login User
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// 

// -----------------------------
// LOGIN USER / RESTAURANT / ADMIN
// -----------------------------


exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Try to find the user in all collections
    let user = await User.findOne({ email });
    let role = 'user';

    if (!user) {
      user = await Restaurant.findOne({ email });
      role = 'restaurant';
    }

    if (!user) {
      user = await Admin.findOne({ email });
      role = 'admin';
    }

    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password.' });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};



// Logout User
exports.logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: 'Logged out successfully' });
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true
    }).select('-password');

    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =================== ADMIN AUTH ===================

// Register Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ success: false, message: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({ name, email, password: hashedPassword, role: 'admin' });
    await admin.save();

    const token = createTokenAndSetCookie(admin, res);

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin)
      return res.status(400).json({ success: false, message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: 'Invalid email or password' });

    const token = createTokenAndSetCookie(admin, res);

    res.json({
      success: true,
      message: 'Admin login successful',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
