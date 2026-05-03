// routes/worker.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getProfile, getMyRecords, getPublicProfile } = require('../controllers/workerController');

// Public emergency profile (no login required - for QR code access)
router.get('/public/:workerId', getPublicProfile);

// Protected worker routes
router.get('/profile', protect, authorize('worker'), getProfile);
router.get('/records', protect, authorize('worker'), getMyRecords);

module.exports = router;
