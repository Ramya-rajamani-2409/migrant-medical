// controllers/doctorController.js
// Doctor actions: search workers, add prescriptions, view activity

const WorkerProfile = require('../models/WorkerProfile');
const MedicalRecord = require('../models/MedicalRecord');
const DoctorProfile = require('../models/DoctorProfile');
const ActivityLog = require('../models/ActivityLog');

// @route  GET /api/doctor/profile
// @desc   Get logged-in doctor's own profile
const getProfile = async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({ userId: req.user._id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  PUT /api/doctor/profile
// @desc   Update doctor's own profile
const updateProfile = async (req, res) => {
  try {
    const profile = await DoctorProfile.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true }
    );
    res.json({ message: 'Profile updated', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  GET /api/doctor/search?q=...&type=name|workerId|aadhaar
// @desc   Search workers by name, workerId, or Aadhaar
const searchWorkers = async (req, res) => {
  const { q, type } = req.query;

  if (!q) return res.status(400).json({ message: 'Search query is required' });

  try {
    let query = {};

    if (type === 'workerId') {
      query = { workerId: { $regex: q, $options: 'i' } };
    } else if (type === 'aadhaar') {
      query = { aadhaarNumber: { $regex: q, $options: 'i' } };
    } else {
      // Default: search by name
      query = { fullName: { $regex: q, $options: 'i' } };
    }

    const workers = await WorkerProfile.find(query).limit(10);
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  GET /api/doctor/worker/:id
// @desc   Get full worker info + medical records (for current patient view)
const getWorkerDetails = async (req, res) => {
  try {
    const profile = await WorkerProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Worker not found' });

    const records = await MedicalRecord.find({ workerId: profile._id })
      .sort({ createdAt: -1 }); // latest first (LIFO)

    res.json({ profile, records });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  POST /api/doctor/prescription/:workerId
// @desc   Add a prescription/medical record for a worker
const addPrescription = async (req, res) => {
  try {
    const worker = await WorkerProfile.findById(req.params.workerId);
    if (!worker) return res.status(404).json({ message: 'Worker not found' });

    const doctorProfile = await DoctorProfile.findOne({ userId: req.user._id });

    // Create the medical record
    const record = await MedicalRecord.create({
      workerId: worker._id,
      doctorId: doctorProfile?._id,
      doctorName: doctorProfile?.fullName || 'Unknown',
      ...req.body,
    });

    // Log this activity
    await ActivityLog.create({
      doctorId: doctorProfile?._id,
      doctorName: doctorProfile?.fullName || 'Unknown Doctor',
      action: 'Added prescription',
      targetWorkerName: worker.fullName,
      targetWorkerId: worker.workerId,
      details: `Diagnosis: ${req.body.diagnosis || 'N/A'}`,
    });

    res.status(201).json({ message: 'Prescription added', record });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/doctor/activity
// @desc   Get recent activity of logged-in doctor
const getMyActivity = async (req, res) => {
  try {
    const doctorProfile = await DoctorProfile.findOne({ userId: req.user._id });
    if (!doctorProfile) return res.json([]);

    const logs = await ActivityLog.find({ doctorId: doctorProfile._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile, updateProfile, searchWorkers,
  getWorkerDetails, addPrescription, getMyActivity,
};
