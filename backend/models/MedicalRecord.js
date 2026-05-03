// models/MedicalRecord.js
// Stores each medical visit / prescription for a worker

const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  // Which worker this record belongs to
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkerProfile',
    required: true,
  },

  // Which doctor added this record
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DoctorProfile',
  },

  // --- Visit Details ---
  hospitalName: { type: String, required: true },
  doctorName: { type: String },
  date: { type: Date, default: Date.now },
  diagnosis: { type: String },
  prescription: { type: String }, // medicines prescribed
  testsTaken: { type: String }, // lab tests, X-rays, etc.
  notes: { type: String }, // any extra notes

}, { timestamps: true });

// We will sort by createdAt descending to get LIFO (latest first)
module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
