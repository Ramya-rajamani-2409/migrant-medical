// src/pages/worker/WorkerDashboard.jsx
// Main wrapper for worker panel with sidebar

import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useLang } from '../../context/LanguageContext';
import WorkerBioData from './WorkerBioData';
import WorkerMedicalRecords from './WorkerMedicalRecords';
import WorkerQRCode from './WorkerQRCode';

export default function WorkerDashboard() {
  const { t } = useLang();

  const links = [
    { to: '/worker/bio', icon: '👤', label: t('bioData') },
    { to: '/worker/records', icon: '📋', label: t('medicalRecords') },
    { to: '/worker/qr', icon: '📱', label: t('qrCode') },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar links={links} role="worker" />
      <main className="flex-1 p-6 overflow-auto">
        <Routes>
          <Route path="bio" element={<WorkerBioData />} />
          <Route path="records" element={<WorkerMedicalRecords />} />
          <Route path="qr" element={<WorkerQRCode />} />
          <Route path="*" element={<Navigate to="bio" replace />} />
        </Routes>
      </main>
    </div>
  );
}
