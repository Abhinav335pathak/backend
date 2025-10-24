const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Restaurant = require('./models/Restaurant'); // adjust path

async function resetPassword() {
  await mongoose.connect('YOUR_MONGODB_URI', { useNewUrlParser: true, useUnifiedTopology: true });

  const newPassword = 'Test1234'; // your desired password
  const hashed = await bcrypt.hash(newPassword, 10);

  await Restaurant.updateOne(
    { email: 'spicevilla@example.com' }, // or another restaurant email
    { password: hashed }
  );

  console.log('Password reset! New password:', newPassword);
  mongoose.disconnect();
}

resetPassword();
