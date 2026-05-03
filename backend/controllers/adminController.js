// controllers/adminController.js
// All admin actions: manage workers, doctors, view records

const User = require('../models/User');
const WorkerProfile = require('../models/WorkerProfile');
const DoctorProfile = require('../models/DoctorProfile');
const MedicalRecord = require('../models/MedicalRecord');
const ActivityLog = require('../models/ActivityLog');
const bcrypt = require('bcryptjs');

// Helper: generate a random password
const generatePassword = (length = 10) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#';
  let pass = '';
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

// ===================== WORKER MANAGEMENT =====================

// @route  POST /api/admin/workers
// @desc   Add a new worker (creates User + WorkerProfile)
const addWorker = async (req, res) => {
  const { email, password, fullName, workerId, ...profileData } = req.body;

  try {
    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    // Check if workerId already exists
    const existingWorker = await WorkerProfile.findOne({ workerId });
    if (existingWorker) return res.status(400).json({ message: 'Worker ID already in use' });

    // Create the user account
    const user = await User.create({ email, password, role: 'worker' });

    // Create the worker profile linked to this user
    const profile = await WorkerProfile.create({
      userId: user._id,
      fullName,
      workerId,
      ...profileData,
    });

    res.status(201).json({ message: 'Worker created successfully', profile });
  } catch (error) {
    console.error('Add worker error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/admin/workers
// @desc   Get all workers
const getWorkers = async (req, res) => {
  try {
    const workers = await WorkerProfile.find().populate('userId', 'email isActive');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  GET /api/admin/workers/:id
// @desc   Get single worker with medical records
const getWorkerFull = async (req, res) => {
  try {
    const profile = await WorkerProfile.findById(req.params.id).populate('userId', 'email');
    if (!profile) return res.status(404).json({ message: 'Worker not found' });

    const records = await MedicalRecord.find({ workerId: profile._id })
      .sort({ createdAt: -1 }); // LIFO: latest first

    res.json({ profile, records });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  PUT /api/admin/workers/:id
// @desc   Edit a worker's profile
const updateWorker = async (req, res) => {
  try {
    const profile = await WorkerProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!profile) return res.status(404).json({ message: 'Worker not found' });
    res.json({ message: 'Worker updated', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  DELETE /api/admin/workers/:id
// @desc   Remove a worker (deactivates user account)
const removeWorker = async (req, res) => {
  try {
    const profile = await WorkerProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Worker not found' });

    // Deactivate instead of hard delete to preserve medical records
    await User.findByIdAndUpdate(profile.userId, { isActive: false });
    await WorkerProfile.findByIdAndDelete(req.params.id);

    res.json({ message: 'Worker removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ===================== DOCTOR MANAGEMENT =====================

// @route  POST /api/admin/doctors
// @desc   Add a new doctor
const addDoctor = async (req, res) => {
  const { email, password, fullName, ...profileData } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ email, password, role: 'doctor' });
    const profile = await DoctorProfile.create({
      userId: user._id,
      fullName,
      email,
      ...profileData,
    });

    res.status(201).json({ message: 'Doctor created successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/admin/doctors
// @desc   Get all doctors
const getDoctors = async (req, res) => {
  try {
    const doctors = await DoctorProfile.find().populate('userId', 'email isActive');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  PUT /api/admin/doctors/:id
// @desc   Update a doctor profile
const updateDoctor = async (req, res) => {
  try {
    const profile = await DoctorProfile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!profile) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor updated', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  DELETE /api/admin/doctors/:id
// @desc   Remove a doctor
const removeDoctor = async (req, res) => {
  try {
    const profile = await DoctorProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Doctor not found' });

    await User.findByIdAndUpdate(profile.userId, { isActive: false });
    await DoctorProfile.findByIdAndDelete(req.params.id);

    res.json({ message: 'Doctor removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ===================== CREDENTIALS & ACTIVITY =====================

// @route  GET /api/admin/generate-password
// @desc   Generate a random secure password
const genPassword = async (req, res) => {
  const password = generatePassword();
  res.json({ password });
};

// @route  GET /api/admin/activity
// @desc   View all doctor activity logs
const getDoctorActivity = async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  GET /api/admin/dashboard
// @desc   Dashboard summary counts
const getDashboard = async (req, res) => {
  try {
    const workerCount = await WorkerProfile.countDocuments();
    const doctorCount = await DoctorProfile.countDocuments();
    const recordCount = await MedicalRecord.countDocuments();
    const recentActivity = await ActivityLog.find().sort({ createdAt: -1 }).limit(5);

    res.json({ workerCount, doctorCount, recordCount, recentActivity });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addWorker, getWorkers, getWorkerFull, updateWorker, removeWorker,
  addDoctor, getDoctors, updateDoctor, removeDoctor,
  genPassword, getDoctorActivity, getDashboard,
};
