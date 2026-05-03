// src/pages/doctor/DoctorActivity.jsx

import { useState, useEffect } from 'react';
import { getDoctorActivity } from '../../services/api';
import { useLang } from '../../context/LanguageContext';

export default function DoctorActivity() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    getDoctorActivity()
      .then((res) => setLogs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-500 animate-pulse">{t('loading')}</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-slate-800">{t('recentActivity')}</h1>
        <p className="text-slate-500 text-sm">Your recent actions in the system</p>
      </div>

      <div className="card">
        {logs.length === 0 ? (
          <p className="text-slate-400 text-sm">{t('noRecords')}</p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log._id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0">
                <span className="text-2xl mt-0.5">📝</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{log.action}</p>
                  <p className="text-xs text-slate-500">Worker: {log.targetWorkerName} ({log.targetWorkerId})</p>
                  {log.details && <p className="text-xs text-slate-400 italic">{log.details}</p>}
                  <p className="text-xs text-slate-300 mt-1">
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
