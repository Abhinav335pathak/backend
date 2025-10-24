const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [{ name: String, quantity: Number, price: Number }],
  status: {
    type: String,
    enum: ['Pending', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  rating: { type: Number, default: null },
  orderNumber: { type: String, unique: true }, // your unique nanoid
});

module.exports = mongoose.model('Order', orderSchema);
