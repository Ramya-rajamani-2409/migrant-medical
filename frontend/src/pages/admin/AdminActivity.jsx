// src/pages/admin/AdminActivity.jsx

import { useState, useEffect } from 'react';
import { getAllActivity } from '../../services/api';
import { useLang } from '../../context/LanguageContext';

export default function AdminActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    getAllActivity()
      .then((res) => setLogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-500 animate-pulse">{t('loading')}</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-slate-800">Doctor Activity Logs</h1>
        <p className="text-slate-500 text-sm">All actions performed by doctors</p>
      </div>

      <div className="card">
        {logs.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">{t('noRecords')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-3 label">Doctor</th>
                  <th className="text-left py-2 px-3 label">Action</th>
                  <th className="text-left py-2 px-3 label">Worker</th>
                  <th className="text-left py-2 px-3 label">Details</th>
                  <th className="text-left py-2 px-3 label">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium text-slate-800">Dr. {log.doctorName}</td>
                    <td className="py-3 px-3">
                      <span className="badge bg-primary-100 text-primary-700">{log.action}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{log.targetWorkerName} ({log.targetWorkerId})</td>
                    <td className="py-3 px-3 text-slate-500 text-xs">{log.details || '—'}</td>
                    <td className="py-3 px-3 text-slate-400 text-xs">
                      {new Date(log.createdAt).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
