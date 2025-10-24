const Order = require('../models/Order');
const { nanoid } = require('nanoid');

// ------------------ CREATE ORDER (USER) ------------------
exports.createOrder = async (req, res) => {
  try {
    const { items, restaurantId, totalPrice, paymentMethod } = req.body;

    if (!items || !restaurantId || !totalPrice) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const orderNumber = nanoid(10);

    const order = new Order({
      userId: req.user._id,
      restaurantId,
      items,
      totalPrice,
      paymentMethod,
      orderNumber,
      status: 'Pending',
    });

    await order.save();

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------ GET ORDERS FOR USER ------------------
exports.getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'user') {
      orders = await Order.find({ userId: req.user._id })
        .populate('restaurantId', 'name')
        .sort({ createdAt: -1 });
    } else if (req.user.role === 'restaurant') {
      orders = await Order.find({ restaurantId: req.user._id })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: error.message });
  }
};


// ------------------ GET SINGLE ORDER ------------------
exports.getOrderById = async (req, res) => {
  try {
    let order;
    if (req.user.role === 'restaurant') {
      order = await Order.findOne({ _id: req.params.id, restaurantId: req.user._id })
        .populate('userId', 'name email');
    } else {
      order = await Order.findOne({ _id: req.params.id, userId: req.user._id })
        .populate('restaurantId', 'name');
    }

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ UPDATE ORDER ------------------
// Users can update (cancel) their orders
// Restaurants can update status
exports.updateOrder = async (req, res) => {
  try {
    let filter = { _id: req.params.id };

    if (req.user.role === 'restaurant') {
      filter.restaurantId = req.user._id;
    } else {
      filter.userId = req.user._id;
    }

    const order = await Order.findOneAndUpdate(filter, req.body, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Order updated', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ------------------ DELETE ORDER ------------------
// Only users can delete their orders
exports.deleteOrder = async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Only users can delete orders' });
    }

    const order = await Order.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
