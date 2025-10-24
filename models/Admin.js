const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }, // Fixed to 'admin'
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
  // Add any admin-specific fields here, e.g., permissions: [String]
});

module.exports = mongoose.model('Admin', adminSchema);
