const MenuItem = require('../models/MenuItem');

// ✅ Create a menu item (restaurant only)
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, publicId } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Name and price required' });
    }

    const menuItem = await MenuItem.create({
      restaurantId: req.user._id,
      name,
      description,
      price,
      category,
      imageUrl: imageUrl || '',
      publicId: publicId || '',
    });

    res.status(201).json({
      success: true,
      menuItem,
    });
  } catch (error) {
    console.error('❌ Create error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Get all menu items (public or by restaurant)
exports.getMenuItems = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    const filter = restaurantId ? { restaurantId } : {};
    const menuItems = await MenuItem.find(filter);

    res.json({
      success: true,
      count: menuItems.length,
      menuItems,
    });
  } catch (error) {
    console.error('❌ Menu item fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getMenuItemsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menuItems = await MenuItem.find({ restaurantId })
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 });

    res.json({ menuItems });
  } catch (err) {
    console.error('Fetch menu items by restaurant error:', err);
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
};


exports.getAllMenuItems = async (req, res) => {
  try {
    const { restaurantId } = req.query;

    let query = {};
    if (restaurantId) query.restaurantId = restaurantId;

    const menuItems = await MenuItem.find(query)
      .populate('restaurantId', 'name'); // <-- populate restaurant name

    res.json({ menuItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch menu items' });
  }
};

// ✅ Get a single menu item by ID (public)
exports.getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, menuItem });
  } catch (error) {
    console.error('❌ Single menu item fetch error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update a menu item (restaurant only)
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findOneAndUpdate(
      { _id: id, restaurantId: req.user._id },
      req.body,
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.json({ success: true, menuItem });
  } catch (error) {
    console.error('❌ Update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Delete a menu item (restaurant only)
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findOneAndDelete({
      _id: id,
      restaurantId: req.user._id,
    });

    if (!menuItem) {
      return res
        .status(404)
        .json({ success: false, message: 'Menu item not found or not yours' });
    }

    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
