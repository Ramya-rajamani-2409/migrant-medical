// src/pages/admin/AdminHome.jsx

import { useState, useEffect } from 'react';
import { getAdminDashboard } from '../../services/api';
import { useLang } from '../../context/LanguageContext';

const StatCard = ({ icon, label, value, color }) => (
  <div className={`card border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="label">{label}</p>
        <p className="text-3xl font-display font-bold text-slate-800">{value}</p>
      </div>
      <span className="text-3xl">{icon}</span>
    </div>
  </div>
);

export default function AdminHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-500 animate-pulse">{t('loading')}</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm">System overview and statistics</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard icon="👷" label="Total Workers" value={data?.workerCount || 0} color="border-teal-400" />
        <StatCard icon="🩺" label="Total Doctors" value={data?.doctorCount || 0} color="border-primary-400" />
        <StatCard icon="📋" label="Medical Records" value={data?.recordCount || 0} color="border-purple-400" />
      </div>

      {/* Recent activity */}
      <div className="card">
        <h2 className="text-base font-semibold text-slate-700 mb-4">Recent Activity</h2>
        {!data?.recentActivity?.length ? (
          <p className="text-slate-400 text-sm">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {data.recentActivity.map((log) => (
              <div key={log._id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0">
                <span className="text-xl">📝</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">Dr. {log.doctorName} — {log.action}</p>
                  <p className="text-xs text-slate-500">Worker: {log.targetWorkerName}</p>
                  <p className="text-xs text-slate-300">{new Date(log.createdAt).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
