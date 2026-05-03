// src/pages/admin/AdminDashboard.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useLang } from '../../context/LanguageContext';
import AdminHome from './AdminHome';
import ManageWorkers from './ManageWorkers';
import ManageDoctors from './ManageDoctors';
import AdminCredentials from './AdminCredentials';
import AdminActivity from './AdminActivity';

export default function AdminDashboard() {
  const { t } = useLang();

  const links = [
    { to: '/admin', icon: '📊', label: t('dashboard') },
    { to: '/admin/workers', icon: '👷', label: t('manageWorkers') },
    { to: '/admin/doctors', icon: '🩺', label: t('manageDoctors') },
    { to: '/admin/credentials', icon: '🔑', label: t('credentials') },
    { to: '/admin/activity', icon: '📋', label: t('recentActivity') },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar links={links} role="admin" />
      <main className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route index element={<AdminHome />} />
          <Route path="workers" element={<ManageWorkers />} />
          <Route path="doctors" element={<ManageDoctors />} />
          <Route path="credentials" element={<AdminCredentials />} />
          <Route path="activity" element={<AdminActivity />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}
