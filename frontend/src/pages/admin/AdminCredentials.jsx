// src/pages/admin/AdminCredentials.jsx
// Generate secure passwords for new users

import { useState } from 'react';
import { generatePassword } from '../../services/api';
import { useLang } from '../../context/LanguageContext';

export default function AdminCredentials() {
  const [generated, setGenerated] = useState('');
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const { t } = useLang();

  const handleGenerate = async () => {
    try {
      const res = await generatePassword();
      setGenerated(res.data.password);
      setCopied(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-slate-800">{t('credentials')}</h1>
        <p className="text-slate-500 text-sm">Generate secure passwords for new accounts</p>
      </div>

      <div className="max-w-lg">
        <div className="card mb-4">
          <h2 className="font-semibold text-slate-700 mb-4">🔑 Password Generator</h2>
          <p className="text-sm text-slate-500 mb-4">
            Generate a secure random password. Share this with the new worker/doctor along with their email credentials.
          </p>

          {/* Email input for reference */}
          <div className="mb-4">
            <label className="label">User Email (for your reference)</label>
            <input
              type="email"
              className="input"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button className="btn-primary mb-4" onClick={handleGenerate}>
            🎲 Generate Password
          </button>

          {/* Generated password display */}
          {generated && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <label className="label">Generated Password</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 text-lg font-mono text-primary-700 bg-white border border-slate-200 rounded px-3 py-2">
                  {generated}
                </code>
                <button
                  className="btn-secondary text-sm"
                  onClick={handleCopy}
                >
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
              {email && (
                <div className="mt-3 text-xs text-slate-500 bg-yellow-50 border border-yellow-200 rounded p-2">
                  <strong>To share:</strong> Tell {email} their password is: <code className="font-mono">{generated}</code>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Future email verification notice */}
        <div className="card bg-blue-50 border border-blue-200">
          <h2 className="font-semibold text-blue-800 mb-2">📧 Email Verification (Coming Soon)</h2>
          <p className="text-sm text-blue-700">
            Future versions will automatically send credentials to users via email. 
            For now, share the generated password manually.
          </p>
        </div>
      </div>
    </div>
  );
}
