const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const adminRoutes = require('./routes/adminRoutes');
const orderRoutes = require('./routes/orderRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const cors = require('cors');

const path = require('path');

dotenv.config();  // Load environment variables from .env file

console.log('MONGODB_URI from env:', process.env.MONGODB_URI);  // Debugging log

const app = express();

// Middleware
app.use(express.json()); // <-- THIS parses JSON bodies

// optional: also parse URL-encoded (for form posts)
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());  // Parse cookies for JWT
app.use('/uploads', express.static('uploads'));  // Serve uploaded files
app.use(cors({
  origin: 'http://localhost:5173',  // your frontend port (Vite default)
  credentials: true,                 // <-- THIS IS REQUIRED for cookies
}));
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {  // Updated to use MONGODB_URI
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const frontendPath = path.join(__dirname, '../frontened/dist');
app.use(express.static(frontendPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});
// Global error handler
app.use(errorMiddleware);






// const bcrypt = require('bcryptjs');

// const Restaurant = require('./models/Restaurant');

// async function reset() {
//   const hashed = await bcrypt.hash('Test1234', 10);
//   await Restaurant.updateOne({ email: 'pizzapalace@example.com' }, { password: hashed });
//   console.log('Password reset done!');
//   mongoose.disconnect();
// }

// reset();




// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
