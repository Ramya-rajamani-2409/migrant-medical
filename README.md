# 🏥 Migrant Medical Record System

A complete full-stack web application for storing and managing migrant workers' medical records.

---

## 📁 Project Structure

```
migrant-medical/
├── backend/
│   ├── config/
│   │   └── db.js               ← MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   ← Login logic
│   │   ├── adminController.js  ← Admin actions
│   │   ├── doctorController.js ← Doctor actions
│   │   └── workerController.js ← Worker actions
│   ├── middleware/
│   │   └── auth.js             ← JWT protection
│   ├── models/
│   │   ├── User.js             ← Login accounts
│   │   ├── WorkerProfile.js    ← Worker bio data
│   │   ├── DoctorProfile.js    ← Doctor profiles
│   │   ├── MedicalRecord.js    ← Medical records
│   │   └── ActivityLog.js      ← Doctor activity logs
│   ├── routes/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── doctor.js
│   │   └── worker.js
│   ├── .env.example            ← Copy to .env
│   ├── package.json
│   └── server.js               ← Entry point
│
└── frontend/
    ├── src/
    │   ├── context/
    │   │   ├── AuthContext.jsx  ← Login state
    │   │   └── LanguageContext.jsx ← EN/Tamil toggle
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── PublicProfilePage.jsx  ← QR emergency page
    │   │   ├── worker/
    │   │   │   ├── WorkerDashboard.jsx
    │   │   │   ├── WorkerBioData.jsx
    │   │   │   ├── WorkerMedicalRecords.jsx
    │   │   │   └── WorkerQRCode.jsx
    │   │   ├── doctor/
    │   │   │   ├── DoctorDashboard.jsx
    │   │   │   ├── DoctorProfile.jsx
    │   │   │   ├── DoctorSearch.jsx
    │   │   │   └── DoctorActivity.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx
    │   │       ├── AdminHome.jsx
    │   │       ├── ManageWorkers.jsx
    │   │       ├── ManageDoctors.jsx
    │   │       ├── AdminCredentials.jsx
    │   │       └── AdminActivity.jsx
    │   ├── components/
    │   │   └── Sidebar.jsx     ← Reusable sidebar
    │   ├── services/
    │   │   └── api.js          ← All API calls
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── tailwind.config.js
```

---

## 🚀 Setup Instructions (Step by Step)

### STEP 1: Install Node.js
Download and install Node.js from https://nodejs.org (choose LTS version)
After installing, verify with:
```bash
node --version
npm --version
```

---

### STEP 2: Set up MongoDB Atlas (Free)

1. Go to https://www.mongodb.com/atlas/database
2. Sign up / Log in
3. Click "Build a Database" → Choose FREE tier
4. Choose a cloud provider & region (any is fine)
5. Create a cluster (it takes ~2 minutes)
6. Click "Connect" → "Connect your application"
7. Copy the connection string. It looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   ```
8. Also go to "Database Access" → Add a database user with a password
9. Go to "Network Access" → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

---

### STEP 3: Set up the Backend

```bash
# Go to backend folder
cd migrant-medical/backend

# Install all dependencies
npm install

# Create .env file (copy from example)
cp .env.example .env
```

Now open `.env` and fill in:
```
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/migrant_medical?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_here_like_abc123xyz789
ADMIN_SECRET_KEY=your_admin_password_here
PORT=5000
```

Start the backend:
```bash
# For development (auto-restarts on changes)
npm run dev

# OR for normal start
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on http://localhost:5000
```

---

### STEP 4: Set up the Frontend

Open a NEW terminal window:
```bash
# Go to frontend folder
cd migrant-medical/frontend

# Install all dependencies
npm install

# Start the frontend
npm run dev
```

You should see:
```
  VITE ready in xxx ms
  ➜  Local:   http://localhost:3000/
```

Open http://localhost:3000 in your browser.

---

## 🔐 Creating the First Admin Account

Since no admin exists yet, you need to create one manually in MongoDB Atlas.

1. Open MongoDB Atlas → Browse Collections → Your database
2. Find the `users` collection
3. Click "Insert Document" and paste:

```json
{
  "email": "admin@hospital.com",
  "password": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVKkk5.3ue",
  "role": "admin",
  "isActive": true
}
```

(That hashed password = `admin123` — change it later!)

**OR** use this Node.js script to create admin:

```js
// Run this once: node createAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await User.create({
    email: 'admin@hospital.com',
    password: 'admin123',
    role: 'admin',
    isActive: true
  });
  console.log('Admin created!');
  process.exit();
});
```

---

## 👤 How to Log In

**Admin login:**
- Email: admin@hospital.com
- Password: admin123
- Role: Admin
- Admin Key: (whatever you set in ADMIN_SECRET_KEY in .env)

**After login as admin:**
1. Go to "Manage Workers" → Add a worker with their email + password
2. Go to "Manage Doctors" → Add a doctor with their email + password
3. Share credentials with the worker/doctor

---

## 🌐 Language Toggle

Click the 🌐 button in the sidebar to switch between English and Tamil.

---

## 📱 QR Code Emergency Access

1. Worker logs in → goes to "QR Code" tab
2. A unique QR code is shown
3. When scanned, it opens: `http://yoursite.com/emergency/WRK-001`
4. This page shows basic info + recent medical records (no login needed)

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| GET | /api/worker/profile | Worker's own profile |
| GET | /api/worker/records | Worker's medical records |
| GET | /api/worker/public/:id | Public emergency profile |
| GET | /api/doctor/search?q=&type= | Search workers |
| POST | /api/doctor/prescription/:id | Add prescription |
| GET | /api/admin/workers | List all workers |
| POST | /api/admin/workers | Add worker |
| DELETE | /api/admin/workers/:id | Remove worker |
| GET | /api/admin/doctors | List all doctors |
| POST | /api/admin/doctors | Add doctor |
| GET | /api/admin/generate-password | Generate password |
| GET | /api/admin/activity | View all activity |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + Tailwind CSS |
| Routing | React Router v6 |
| HTTP Client | Axios |
| QR Code | qrcode.react |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (JSON Web Tokens) |
| Password | bcryptjs |

---

## ❓ Common Issues

**"Cannot connect to MongoDB"**
→ Check your MONGODB_URI in .env
→ Make sure your IP is whitelisted in Atlas Network Access

**"Role does not match account type"**
→ Make sure you select the correct role on the login page

**Frontend not connecting to backend**
→ Make sure backend is running on port 5000
→ Vite proxy handles /api → localhost:5000

**QR code not working on mobile**
→ You need to deploy the app or use your computer's local IP instead of localhost
