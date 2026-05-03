// routes/admin.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  addWorker, getWorkers, getWorkerFull, updateWorker, removeWorker,
  addDoctor, getDoctors, updateDoctor, removeDoctor,
  genPassword, getDoctorActivity, getDashboard,
} = require('../controllers/adminController');

// All admin routes are protected and only accessible by admins
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Worker management
router.get('/workers', getWorkers);
router.post('/workers', addWorker);
router.get('/workers/:id', getWorkerFull);
router.put('/workers/:id', updateWorker);
router.delete('/workers/:id', removeWorker);

// Doctor management
router.get('/doctors', getDoctors);
router.post('/doctors', addDoctor);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', removeDoctor);

// Utilities
router.get('/generate-password', genPassword);
router.get('/activity', getDoctorActivity);

module.exports = router;
