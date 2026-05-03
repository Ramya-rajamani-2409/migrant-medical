// server.js
// Entry point for the backend server

require('dotenv').config(); // Load .env variables first
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// ---- Connect to MongoDB ----
connectDB();

// ---- Middleware ----
app.use(cors()); // Allow frontend to call backend
app.use(express.json()); // Parse JSON request bodies

// ---- Routes ----
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/doctor', require('./routes/doctor'));
app.use('/api/worker', require('./routes/worker'));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: '🏥 Migrant Medical Record System API is running!' });
});

// ---- Start Server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
