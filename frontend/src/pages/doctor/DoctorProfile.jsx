// src/pages/doctor/DoctorProfile.jsx

import { useState, useEffect } from 'react';
import { getDoctorProfile, updateDoctorProfile } from '../../services/api';
import { useLang } from '../../context/LanguageContext';

export default function DoctorProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const { t } = useLang();

  useEffect(() => {
    getDoctorProfile()
      .then((res) => {
        setProfile(res.data);
        setForm(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateDoctorProfile(form);
      setProfile(res.data.profile);
      setEditing(false);
      setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-slate-500 animate-pulse">{t('loading')}</div>;

  const fields = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'qualification', label: 'Qualification' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'gender', label: 'Gender' },
    { key: 'phoneNumber', label: 'Phone' },
    { key: 'hospital', label: 'Hospital' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800">{t('profile')}</h1>
          <p className="text-slate-500 text-sm">Your professional details</p>
        </div>
        {!editing ? (
          <button className="btn-secondary" onClick={() => setEditing(true)}>✏️ {t('edit')}</button>
        ) : (
          <div className="flex gap-2">
            <button className="btn-secondary" onClick={() => setEditing(false)}>{t('cancel')}</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? t('loading') : t('save')}
            </button>
          </div>
        )}
      </div>

      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2 text-sm mb-4">
          ✅ {msg}
        </div>
      )}

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-700">
            {profile?.fullName?.charAt(0) || '?'}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{profile?.fullName}</h2>
            <p className="text-slate-500 text-sm">{profile?.specialization} • {profile?.qualification}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {fields.map(({ key, label }) => (
            <div key={key}>
              <label className="label">{label}</label>
              {editing ? (
                <input
                  className="input"
                  value={form[key] || ''}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              ) : (
                <p className="text-slate-800 font-medium text-sm">{profile?.[key] || '—'}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
