// src/pages/worker/WorkerBioData.jsx
// Shows the worker's complete profile/bio data

import { useState, useEffect } from 'react';
import { getWorkerProfile } from '../../services/api';
import { useLang } from '../../context/LanguageContext';

// Helper to show a labeled info field
const InfoField = ({ label, value }) => (
  <div>
    <p className="label">{label}</p>
    <p className="text-slate-800 font-medium text-sm">{value || '—'}</p>
  </div>
);

export default function WorkerBioData() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    // Fetch worker profile from API
    getWorkerProfile()
      .then((res) => setProfile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-500 animate-pulse">{t('loading')}</div>;
  if (!profile) return <div className="text-red-500">Profile not found. Please contact admin.</div>;

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-slate-800">{t('bioData')}</h1>
        <p className="text-slate-500 text-sm mt-1">Your personal and medical information</p>
      </div>

      {/* Profile card */}
      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-6">
          {/* Photo placeholder */}
          <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-2xl font-bold text-teal-700">
            {profile.fullName?.charAt(0) || '?'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">{profile.fullName}</h2>
            <p className="text-slate-500 text-sm">ID: {profile.workerId}</p>
            <span className="badge bg-teal-100 text-teal-700 mt-1 inline-block">{profile.bloodGroup}</span>
          </div>
        </div>

        {/* Bio grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          <InfoField label={t('age')} value={profile.age ? `${profile.age} years` : null} />
          <InfoField label={t('gender')} value={profile.gender} />
          <InfoField label="Aadhaar Number" value={profile.aadhaarNumber} />
          <InfoField label="Phone" value={profile.phoneNumber} />
          <InfoField label={t('emergency')} value={profile.emergencyContact} />
          <InfoField label={t('bloodGroup')} value={profile.bloodGroup} />
          <InfoField label="Height" value={profile.height ? `${profile.height} cm` : null} />
          <InfoField label="Weight" value={profile.weight ? `${profile.weight} kg` : null} />
          <InfoField label="Occupation" value={profile.occupation} />
          <InfoField label="Nationality" value={profile.nationality} />
          <InfoField label="State" value={profile.state} />
          <InfoField label="District" value={profile.district} />
        </div>

        {/* Address */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <InfoField label="Full Address" value={profile.fullAddress} />
        </div>
      </div>
    </div>
  );
}
