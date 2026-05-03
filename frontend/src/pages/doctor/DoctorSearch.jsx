// src/pages/doctor/DoctorSearch.jsx
// Doctor can search workers and add prescriptions

import { useState } from 'react';
import { searchWorkers, getWorkerForDoctor, addPrescription } from '../../services/api';
import { useLang } from '../../context/LanguageContext';

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN') : '—';

export default function DoctorSearch() {
  const { t } = useLang();

  // Search state
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Currently selected patient
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);

  // Prescription form
  const [rxForm, setRxForm] = useState({
    hospitalName: '', date: '', diagnosis: '', prescription: '', testsTaken: '', notes: '',
  });
  const [addingRx, setAddingRx] = useState(false);
  const [rxMsg, setRxMsg] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await searchWorkers(query, searchType);
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  // Select a patient and load their records
  const selectPatient = async (worker) => {
    try {
      const res = await getWorkerForDoctor(worker._id);
      setPatient(res.data.profile);
      setRecords(res.data.records);
      setResults([]);
      setQuery('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    setAddingRx(true);
    setRxMsg('');
    try {
      await addPrescription(patient._id, rxForm);
      setRxMsg('✅ Prescription added successfully!');
      setRxForm({ hospitalName: '', date: '', diagnosis: '', prescription: '', testsTaken: '', notes: '' });
      // Refresh records
      const res = await getWorkerForDoctor(patient._id);
      setRecords(res.data.records);
    } catch (err) {
      setRxMsg('❌ Failed to add prescription.');
    } finally {
      setAddingRx(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-slate-800">{t('searchWorker')}</h1>
      </div>

      {/* Search bar */}
      <div className="card mb-6">
        <div className="flex gap-2 mb-3">
          {['name', 'workerId', 'aadhaar'].map((type) => (
            <button
              key={type}
              onClick={() => setSearchType(type)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition ${
                searchType === type ? 'bg-primary-600 text-white border-primary-600' : 'border-slate-200 text-slate-600'
              }`}
            >
              {type === 'name' ? 'By Name' : type === 'workerId' ? 'By Worker ID' : 'By Aadhaar'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder={`Search worker by ${searchType}...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button className="btn-primary" onClick={handleSearch} disabled={searching}>
            {searching ? '...' : '🔍 Search'}
          </button>
        </div>

        {/* Search results dropdown */}
        {results.length > 0 && (
          <div className="mt-3 border border-slate-200 rounded-lg divide-y divide-slate-100">
            {results.map((w) => (
              <button
                key={w._id}
                onClick={() => selectPatient(w)}
                className="w-full text-left px-4 py-3 hover:bg-primary-50 transition flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold">
                  {w.fullName?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{w.fullName}</p>
                  <p className="text-xs text-slate-400">ID: {w.workerId} • {w.bloodGroup}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Current Patient Panel */}
      {patient && (
        <>
          <div className="card mb-4">
            <h2 className="text-base font-semibold text-slate-700 mb-3">👤 {t('currentPatient')}</h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-lg font-bold">
                {patient.fullName?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{patient.fullName}</p>
                <p className="text-xs text-slate-500">ID: {patient.workerId} • {patient.gender} • Age: {patient.age}</p>
                <span className="badge bg-red-100 text-red-600">{patient.bloodGroup}</span>
              </div>
            </div>
          </div>

          {/* Add Prescription form */}
          <div className="card mb-4">
            <h2 className="text-base font-semibold text-slate-700 mb-4">💊 {t('addPrescription')}</h2>
            {rxMsg && (
              <div className={`text-sm px-4 py-2 rounded-lg mb-4 ${rxMsg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {rxMsg}
              </div>
            )}
            <form onSubmit={handleAddPrescription} className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">{t('hospital')}</label>
                <input className="input" value={rxForm.hospitalName} onChange={(e) => setRxForm({ ...rxForm, hospitalName: e.target.value })} required />
              </div>
              <div>
                <label className="label">{t('date')}</label>
                <input type="date" className="input" value={rxForm.date} onChange={(e) => setRxForm({ ...rxForm, date: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="label">{t('diagnosis')}</label>
                <input className="input" value={rxForm.diagnosis} onChange={(e) => setRxForm({ ...rxForm, diagnosis: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="label">{t('prescription')}</label>
                <textarea className="input" rows="2" value={rxForm.prescription} onChange={(e) => setRxForm({ ...rxForm, prescription: e.target.value })} />
              </div>
              <div>
                <label className="label">{t('tests')}</label>
                <input className="input" value={rxForm.testsTaken} onChange={(e) => setRxForm({ ...rxForm, testsTaken: e.target.value })} />
              </div>
              <div>
                <label className="label">{t('notes')}</label>
                <input className="input" value={rxForm.notes} onChange={(e) => setRxForm({ ...rxForm, notes: e.target.value })} />
              </div>
              <div className="col-span-2">
                <button type="submit" className="btn-primary" disabled={addingRx}>
                  {addingRx ? t('loading') : '+ Add Prescription'}
                </button>
              </div>
            </form>
          </div>

          {/* Medical records */}
          <div className="card">
            <h2 className="text-base font-semibold text-slate-700 mb-4">📋 Medical History ({records.length})</h2>
            {records.length === 0 ? (
              <p className="text-slate-400 text-sm">{t('noRecords')}</p>
            ) : (
              records.map((r) => (
                <div key={r._id} className="border-l-4 border-primary-300 pl-4 mb-4 pb-4 border-b border-slate-100">
                  <p className="font-semibold text-sm text-slate-800">{r.hospitalName} <span className="text-slate-400 font-normal">• {formatDate(r.date)}</span></p>
                  <p className="text-xs text-slate-500 mt-1"><strong>Diagnosis:</strong> {r.diagnosis || '—'}</p>
                  <p className="text-xs text-slate-500"><strong>Rx:</strong> {r.prescription || '—'}</p>
                  {r.notes && <p className="text-xs text-slate-400 italic mt-1">{r.notes}</p>}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
