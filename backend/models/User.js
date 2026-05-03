// models/User.js
// This schema stores login credentials for all users (admin, doctor, worker)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'worker'], // only these 3 roles are allowed
    required: true,
  },
  // Link to the worker or doctor profile document
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'role', // dynamic reference based on role
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Before saving, hash the password automatically
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // skip if password not changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if entered password matches stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
