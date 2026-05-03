// routes/doctor.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getProfile, updateProfile, searchWorkers,
  getWorkerDetails, addPrescription, getMyActivity,
} = require('../controllers/doctorController');

// All doctor routes are protected
router.use(protect);
router.use(authorize('doctor'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/search', searchWorkers);
router.get('/worker/:id', getWorkerDetails);
router.post('/prescription/:workerId', addPrescription);
router.get('/activity', getMyActivity);

module.exports = router;
