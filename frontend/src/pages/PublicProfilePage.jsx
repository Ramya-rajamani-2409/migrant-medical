// src/pages/PublicProfilePage.jsx
// Public emergency page - accessible via QR code without login

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicWorkerProfile } from '../services/api';

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '—';

export default function PublicProfilePage() {
  const { workerId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPublicWorkerProfile(workerId)
      .then((res) => setData(res.data))
      .catch(() => setError('Worker profile not found.'))
      .finally(() => setLoading(false));
  }, [workerId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 animate-pulse">Loading emergency profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-4xl mb-2">⚠️</p>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  const { profile, recentRecords } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
      {/* Emergency banner */}
      <div className="max-w-lg mx-auto">
        <div className="bg-red-600 text-white rounded-xl p-4 mb-4 text-center shadow-lg">
          <p className="text-sm font-bold uppercase tracking-widest">🚨 Emergency Medical Profile</p>
          <p className="text-xs opacity-80 mt-1">This is a public emergency access page</p>
        </div>

        {/* Basic Info Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-2xl font-bold text-red-600">
              {profile.fullName?.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{profile.fullName}</h1>
              <p className="text-slate-500 text-sm">Worker ID: {profile.workerId}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400 uppercase font-semibold">Age</p>
              <p className="text-lg font-bold text-slate-800">{profile.age || '—'}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-xs text-slate-400 uppercase font-semibold">Blood Group</p>
              <p className="text-lg font-bold text-red-600">{profile.bloodGroup || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-400 uppercase font-semibold">Gender</p>
              <p className="font-semibold text-slate-800">{profile.gender || '—'}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-xs text-slate-400 uppercase font-semibold">Emergency Contact</p>
              <p className="font-semibold text-orange-700">{profile.emergencyContact || '—'}</p>
            </div>
          </div>
        </div>

        {/* Recent Medical Records */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-slate-800 mb-3">📋 Recent Medical Records</h2>
          {recentRecords.length === 0 ? (
            <p className="text-slate-400 text-sm">No medical records available</p>
          ) : (
            recentRecords.map((r, i) => (
              <div key={r._id} className="mb-4 pb-4 border-b border-slate-100 last:border-0">
                <p className="font-semibold text-sm text-slate-800">{r.hospitalName}</p>
                <p className="text-xs text-slate-500">Dr. {r.doctorName} • {formatDate(r.date)}</p>
                {r.diagnosis && <p className="text-xs text-slate-600 mt-1">🔍 {r.diagnosis}</p>}
                {r.prescription && <p className="text-xs text-slate-600">💊 {r.prescription}</p>}
              </div>
            ))
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          This page is for emergency use only. Powered by Migrant Medical Record System.
        </p>
      </div>
    </div>
  );
}
