// controllers/workerController.js
// Worker actions: view own profile, medical records, public emergency page

const WorkerProfile = require('../models/WorkerProfile');
const MedicalRecord = require('../models/MedicalRecord');

// @route  GET /api/worker/profile
// @desc   Get logged-in worker's own profile
const getProfile = async (req, res) => {
  try {
    const profile = await WorkerProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  GET /api/worker/records
// @desc   Get worker's own medical records (LIFO order)
const getMyRecords = async (req, res) => {
  try {
    const profile = await WorkerProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const records = await MedicalRecord.find({ workerId: profile._id })
      .sort({ createdAt: -1 }); // newest first

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  GET /api/public/worker/:workerId
// @desc   Public emergency profile (linked from QR code) - no auth needed
const getPublicProfile = async (req, res) => {
  try {
    // Find by workerId string (like "WRK-001")
    const profile = await WorkerProfile.findOne({ workerId: req.params.workerId });
    if (!profile) return res.status(404).json({ message: 'Worker not found' });

    // Only show safe public fields
    const publicProfile = {
      fullName: profile.fullName,
      age: profile.age,
      gender: profile.gender,
      bloodGroup: profile.bloodGroup,
      emergencyContact: profile.emergencyContact,
      workerId: profile.workerId,
      nationality: profile.nationality,
    };

    // Latest 3 medical records for emergency reference
    const recentRecords = await MedicalRecord.find({ workerId: profile._id })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('hospitalName diagnosis prescription date doctorName');

    res.json({ profile: publicProfile, recentRecords });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProfile, getMyRecords, getPublicProfile };
