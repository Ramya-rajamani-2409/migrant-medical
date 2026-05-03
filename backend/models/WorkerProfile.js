// models/WorkerProfile.js
// Stores complete bio data for each migrant worker

const mongoose = require('mongoose');

const workerProfileSchema = new mongoose.Schema({
  // Link back to the User account
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // --- Personal Information ---
  fullName: { type: String, required: true, trim: true },
  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  aadhaarNumber: { type: String, trim: true },
  phoneNumber: { type: String, trim: true },
  emergencyContact: { type: String, trim: true },

  // --- Address ---
  fullAddress: { type: String },
  state: { type: String },
  district: { type: String },
  nationality: { type: String, default: 'Indian' },

  // --- Medical Info ---
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'],
    default: 'Unknown',
  },
  height: { type: Number }, // in cm
  weight: { type: Number }, // in kg

  // --- Work Info ---
  occupation: { type: String },
  workerId: { type: String, unique: true, trim: true }, // unique ID like WRK-001

  // --- Photo ---
  photoUrl: { type: String, default: '' }, // optional photo

}, { timestamps: true });

module.exports = mongoose.model('WorkerProfile', workerProfileSchema);
