// src/pages/admin/ManageDoctors.jsx

import { useState, useEffect } from 'react';
import { getDoctors, addDoctor, removeDoctor } from '../../services/api';
import { useLang } from '../../context/LanguageContext';

const emptyForm = {
  email: '', password: '', fullName: '', gender: 'Male',
  qualification: '', specialization: '', phoneNumber: '', hospital: '',
};

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const { t } = useLang();

  const fetchDoctors = () => {
    getDoctors()
      .then((res) => setDoctors(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchDoctors, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoctor(form);
      setMsg('✅ Doctor added successfully!');
      setShowForm(false);
      setForm(emptyForm);
      fetchDoctors();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Failed to add doctor'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove Dr. "${name}"?`)) return;
    try {
      await removeDoctor(id);
      setMsg('✅ Doctor removed');
      fetchDoctors();
    } catch {
      setMsg('❌ Failed to remove doctor');
    }
  };

  if (loading) return <div className="text-slate-500 animate-pulse">{t('loading')}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800">{t('manageDoctors')}</h1>
          <p className="text-slate-500 text-sm">{doctors.length} doctors registered</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ {t('add')} Doctor</button>
      </div>

      {msg && (
        <div className={`text-sm px-4 py-2 rounded-lg mb-4 ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg}
        </div>
      )}

      {showForm && (
        <div className="card mb-6">
          <h2 className="font-semibold text-slate-700 mb-4">Add New Doctor</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
            {[
              { k: 'email', l: 'Email', t: 'email' },
              { k: 'password', l: 'Password', t: 'password' },
              { k: 'fullName', l: 'Full Name' },
              { k: 'qualification', l: 'Qualification (e.g. MBBS)' },
              { k: 'specialization', l: 'Specialization' },
              { k: 'phoneNumber', l: 'Phone' },
              { k: 'hospital', l: 'Hospital Name' },
            ].map(({ k, l, t: type }) => (
              <div key={k}>
                <label className="label">{l}</label>
                <input
                  type={type || 'text'}
                  className="input"
                  value={form[k]}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  required={['email', 'password', 'fullName'].includes(k)}
                />
              </div>
            ))}

            <div>
              <label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                {['Male', 'Female', 'Other'].map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>

            <div className="col-span-2 flex gap-2">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? t('loading') : 'Add Doctor'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>{t('cancel')}</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {doctors.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">{t('noRecords')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-3 label">Name</th>
                  <th className="text-left py-2 px-3 label">Specialization</th>
                  <th className="text-left py-2 px-3 label">Qualification</th>
                  <th className="text-left py-2 px-3 label">Hospital</th>
                  <th className="text-left py-2 px-3 label">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d._id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium text-slate-800">Dr. {d.fullName}</td>
                    <td className="py-3 px-3 text-slate-500">{d.specialization || '—'}</td>
                    <td className="py-3 px-3 text-slate-500">{d.qualification || '—'}</td>
                    <td className="py-3 px-3 text-slate-500">{d.hospital || '—'}</td>
                    <td className="py-3 px-3">
                      <button onClick={() => handleDelete(d._id, d.fullName)} className="text-xs btn-danger py-1 px-2">🗑 Remove</button>
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
