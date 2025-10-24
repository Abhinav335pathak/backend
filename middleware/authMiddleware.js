const jwt = require('jsonwebtoken');
const User = require('../models/User');

const Restaurant = require('../models/Restaurant');
  
exports.protect = async (req, res, next) => {
  let token;

  // Check both cookies and Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // <-- important
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};



exports.protectAny = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) token = req.cookies.token;
  else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'user') {
      req.user = await User.findById(decoded.id).select('-password');
      req.user.role = 'user';
    } else if (decoded.role === 'restaurant') {
      req.user = await Restaurant.findById(decoded.id).select('-password');
      req.user.role = 'restaurant';
    } else {
      return res.status(401).json({ message: 'Invalid role' });
    }

    if (!req.user) return res.status(401).json({ message: `${decoded.role} not found` });

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid token' });
  }
};



exports.protectRestaurant = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Restaurant.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Restaurant not found' });
    }

    // Add a role property for consistency
    req.user.role = 'restaurant';
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};


// Optional: Role check middleware
// exports.roleCheck = (roles) => (req, res, next) => {
//   if (!roles.includes(req.user.role)) {
//     return res.status(403).json({ message: 'Access denied' });
//   }
//   next();
// };
exports.roleCheck = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    next();
  };
};
