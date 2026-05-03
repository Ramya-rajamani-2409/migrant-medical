// src/pages/doctor/DoctorDashboard.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useLang } from '../../context/LanguageContext';
import DoctorProfile from './DoctorProfile';
import DoctorSearch from './DoctorSearch';
import DoctorActivity from './DoctorActivity';

export default function DoctorDashboard() {
  const { t } = useLang();

  const links = [
    { to: '/doctor/profile', icon: '👤', label: t('profile') },
    { to: '/doctor/search', icon: '🔍', label: t('searchWorker') },
    { to: '/doctor/activity', icon: '📊', label: t('recentActivity') },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar links={links} role="doctor" />
      <main className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="search" element={<DoctorSearch />} />
          <Route path="activity" element={<DoctorActivity />} />
          <Route path="*" element={<Navigate to="search" replace />} />
        </Routes>
      </main>
    </div>
  );
}
