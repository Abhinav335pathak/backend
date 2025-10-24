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
    imageUrl: { type: String }, // ✅ renamed from "image"
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
