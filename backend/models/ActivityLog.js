// models/ActivityLog.js
// Logs every important action done by doctors (and admins can view these)

const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  // Who performed the action
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DoctorProfile',
  },
  doctorName: { type: String },

  // What action was done
  action: { type: String, required: true }, // e.g., "Added prescription"
  targetWorkerName: { type: String }, // which worker was involved
  targetWorkerId: { type: String },   // worker's workerId string
  details: { type: String },          // extra info

}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
