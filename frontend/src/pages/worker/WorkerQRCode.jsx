// src/pages/worker/WorkerQRCode.jsx
// Generates a QR code linking to the worker's public emergency profile

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { getWorkerProfile } from '../../services/api';
import { useLang } from '../../context/LanguageContext';

export default function WorkerQRCode() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    getWorkerProfile()
      .then((res) => setProfile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-500 animate-pulse">{t('loading')}</div>;
  if (!profile) return <div className="text-red-500">Profile not found.</div>;

  // The public URL for this worker's emergency profile
  const emergencyUrl = `${window.location.origin}/emergency/${profile.workerId}`;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-slate-800">{t('qrCode')}</h1>
        <p className="text-slate-500 text-sm mt-1">Scan this QR to access your emergency medical profile</p>
      </div>

      <div className="max-w-sm mx-auto">
        <div className="card text-center">
          {/* QR Code */}
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white rounded-xl border-2 border-primary-200 shadow-sm">
              <QRCodeSVG
                value={emergencyUrl}
                size={200}
                bgColor="#ffffff"
                fgColor="#0c4a6e"
                level="H" // High error correction for better scanning
              />
            </div>
          </div>

          {/* Worker info */}
          <h2 className="text-lg font-semibold text-slate-800">{profile.fullName}</h2>
          <p className="text-slate-500 text-sm">Worker ID: {profile.workerId}</p>
          <p className="text-slate-500 text-xs mt-1">Blood Group: {profile.bloodGroup}</p>

          {/* Emergency URL */}
          <div className="mt-4 bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-400 mb-1">Emergency Profile URL:</p>
            <p className="text-xs text-primary-600 break-all font-mono">{emergencyUrl}</p>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            🏥 Show this QR code in emergencies. Doctors can scan it for quick access to your basic medical info.
          </p>
        </div>
      </div>
    </div>
  );
}
