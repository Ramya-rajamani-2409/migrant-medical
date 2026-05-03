require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await User.create({
    email: 'admin@hospital.com',
    password: 'admin123',
    role: 'admin',
    isActive: true
  });
  console.log('✅ Admin created! Email: admin@hospital.com | Password: admin123');
  process.exit();
}).catch(err => {
  console.error('❌ Error:', err.message);
  process.exit();
});