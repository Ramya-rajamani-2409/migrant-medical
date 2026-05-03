// src/pages/worker/WorkerMedicalRecords.jsx
// Shows all medical records in LIFO order (latest first)

import { useState, useEffect } from 'react';
import { getWorkerRecords } from '../../services/api';
import { useLang } from '../../context/LanguageContext';

// Format date nicely
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

// Single medical record card
const RecordCard = ({ record, index }) => (
  <div className="card mb-4 border-l-4 border-l-primary-400">
    <div className="flex justify-between items-start mb-3">
      <div>
        <span className="badge bg-primary-100 text-primary-700 mb-1">#{index + 1}</span>
        <h3 className="font-semibold text-slate-800">{record.hospitalName}</h3>
        <p className="text-slate-500 text-xs">Dr. {record.doctorName} • {formatDate(record.date)}</p>
      </div>
      <span className="text-xs text-slate-400">{formatDate(record.createdAt)}</span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div>
        <p className="label">Diagnosis</p>
        <p className="text-sm text-slate-700">{record.diagnosis || '—'}</p>
      </div>
      <div>
        <p className="label">Prescription</p>
        <p className="text-sm text-slate-700">{record.prescription || '—'}</p>
      </div>
      <div>
        <p className="label">Tests Taken</p>
        <p className="text-sm text-slate-700">{record.testsTaken || '—'}</p>
      </div>
      <div>
        <p className="label">Notes</p>
        <p className="text-sm text-slate-700">{record.notes || '—'}</p>
      </div>
    </div>
  </div>
);

export default function WorkerMedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    getWorkerRecords()
      .then((res) => setRecords(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-500 animate-pulse">{t('loading')}</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-slate-800">{t('medicalRecords')}</h1>
        <p className="text-slate-500 text-sm mt-1">
          {records.length} record{records.length !== 1 ? 's' : ''} found • Showing latest first
        </p>
      </div>

      {records.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-slate-500">{t('noRecords')}</p>
        </div>
      ) : (
        records.map((record, i) => <RecordCard key={record._id} record={record} index={i} />)
      )}
    </div>
  );
}
