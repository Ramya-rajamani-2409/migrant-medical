// models/DoctorProfile.js
// Stores professional profile for doctors

const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
  // Link back to User account
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  fullName: { type: String, required: true, trim: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  qualification: { type: String }, // e.g., MBBS, MD
  specialization: { type: String }, // e.g., Cardiology
  phoneNumber: { type: String },
  hospital: { type: String },
  email: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
