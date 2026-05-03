// src/pages/admin/ManageWorkers.jsx
// Admin can add, view, edit, delete workers

import { useState, useEffect } from 'react';
import { getWorkers, addWorker, removeWorker, getWorkerFull } from '../../services/api';
import { useLang } from '../../context/LanguageContext';

// Empty worker form
const emptyForm = {
  email: '', password: '', fullName: '', workerId: '', age: '',
  gender: 'Male', aadhaarNumber: '', phoneNumber: '', emergencyContact: '',
  fullAddress: '', state: '', district: '', nationality: 'Indian',
  bloodGroup: 'O+', height: '', weight: '', occupation: '',
};

export default function ManageWorkers() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [viewWorker, setViewWorker] = useState(null); // for full record view
  const { t } = useLang();

  const fetchWorkers = () => {
    getWorkers()
      .then((res) => setWorkers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchWorkers, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addWorker(form);
      setMsg('✅ Worker added successfully!');
      setShowForm(false);
      setForm(emptyForm);
      fetchWorkers();
    } catch (err) {
      setMsg('❌ ' + (err.response?.data?.message || 'Failed to add worker'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove worker "${name}"? This cannot be undone.`)) return;
    try {
      await removeWorker(id);
      setMsg('✅ Worker removed');
      fetchWorkers();
    } catch {
      setMsg('❌ Failed to remove worker');
    }
  };

  const handleViewFull = async (id) => {
    try {
      const res = await getWorkerFull(id);
      setViewWorker(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-slate-500 animate-pulse">{t('loading')}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-800">{t('manageWorkers')}</h1>
          <p className="text-slate-500 text-sm">{workers.length} workers registered</p>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(true); setViewWorker(null); }}>
          + {t('add')} Worker
        </button>
      </div>

      {msg && (
        <div className={`text-sm px-4 py-2 rounded-lg mb-4 ${msg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {msg}
        </div>
      )}

      {/* Add Worker Form */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="font-semibold text-slate-700 mb-4">Add New Worker</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
            {[
              { k: 'email', l: 'Email', t: 'email' },
              { k: 'password', l: 'Password', t: 'password' },
              { k: 'fullName', l: 'Full Name' },
              { k: 'workerId', l: 'Worker ID (e.g. WRK-001)' },
              { k: 'age', l: 'Age', t: 'number' },
              { k: 'phoneNumber', l: 'Phone' },
              { k: 'aadhaarNumber', l: 'Aadhaar Number' },
              { k: 'emergencyContact', l: 'Emergency Contact' },
              { k: 'occupation', l: 'Occupation' },
              { k: 'nationality', l: 'Nationality' },
              { k: 'state', l: 'State' },
              { k: 'district', l: 'District' },
            ].map(({ k, l, t: type }) => (
              <div key={k}>
                <label className="label">{l}</label>
                <input
                  type={type || 'text'}
                  className="input"
                  value={form[k]}
                  onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                  required={['email', 'password', 'fullName', 'workerId'].includes(k)}
                />
              </div>
            ))}

            {/* Gender select */}
            <div>
              <label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                {['Male', 'Female', 'Other'].map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>

            {/* Blood group */}
            <div>
              <label className="label">Blood Group</label>
              <select className="input" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'].map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>

            {/* Full address spans 2 cols */}
            <div className="col-span-2">
              <label className="label">Full Address</label>
              <textarea className="input" rows="2" value={form.fullAddress} onChange={(e) => setForm({ ...form, fullAddress: e.target.value })} />
            </div>

            <div className="col-span-2 flex gap-2">
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? t('loading') : 'Add Worker'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>{t('cancel')}</button>
            </div>
          </form>
        </div>
      )}

      {/* Full Worker Record Modal */}
      {viewWorker && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-auto p-6 shadow-xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-bold">{viewWorker.profile.fullName} — Full Record</h2>
              <button className="text-slate-400 hover:text-slate-600 text-xl" onClick={() => setViewWorker(null)}>✕</button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {['workerId', 'age', 'gender', 'bloodGroup', 'phoneNumber', 'aadhaarNumber', 'occupation', 'state'].map((f) => (
                <div key={f}>
                  <p className="label">{f}</p>
                  <p className="text-sm font-medium text-slate-800">{viewWorker.profile[f] || '—'}</p>
                </div>
              ))}
            </div>
            <h3 className="font-semibold text-slate-700 mb-3">Medical Records ({viewWorker.records.length})</h3>
            {viewWorker.records.map((r) => (
              <div key={r._id} className="border-l-4 border-primary-300 pl-3 mb-3">
                <p className="text-sm font-semibold">{r.hospitalName} • {new Date(r.date).toLocaleDateString('en-IN')}</p>
                <p className="text-xs text-slate-500">Diagnosis: {r.diagnosis}</p>
                <p className="text-xs text-slate-500">Rx: {r.prescription}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workers list */}
      <div className="card">
        {workers.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">{t('noRecords')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-2 px-3 label">Name</th>
                  <th className="text-left py-2 px-3 label">Worker ID</th>
                  <th className="text-left py-2 px-3 label">Blood</th>
                  <th className="text-left py-2 px-3 label">Phone</th>
                  <th className="text-left py-2 px-3 label">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w) => (
                  <tr key={w._id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium text-slate-800">{w.fullName}</td>
                    <td className="py-3 px-3 text-slate-500">{w.workerId}</td>
                    <td className="py-3 px-3">
                      <span className="badge bg-red-100 text-red-600">{w.bloodGroup}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{w.phoneNumber || '—'}</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleViewFull(w._id)} className="text-xs btn-secondary py-1 px-2">📋 View</button>
                        <button onClick={() => handleDelete(w._id, w.fullName)} className="text-xs btn-danger py-1 px-2">🗑 Remove</button>
                      </div>
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
