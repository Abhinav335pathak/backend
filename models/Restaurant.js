const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String, required: true },
  logo: { type: String }, // Path to image
  images: [{ type: String }], // Array of image paths
  description: { type: String },
  isActive: { type: Boolean, default: false }, // Pending until approved
  role: { type: String, default: 'restaurant' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);