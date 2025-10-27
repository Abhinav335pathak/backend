const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ['starter', 'main course', 'dessert', 'drink'],
      default: 'main course',
    },

    // ✅ Cloudinary fields
    imageUrl: {
      type: String,
      required: false,
      default: '', // Cloudinary secure_url
    },
    publicId: {
      type: String,
      required: false, // Cloudinary public_id for deletion/update
    },

    status: {
      type: String,
      enum: ['available', 'out-of-stock'],
      default: 'available',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
