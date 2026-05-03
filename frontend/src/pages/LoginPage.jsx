// src/pages/LoginPage.jsx
// Login form for all roles

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { loginUser } from '../services/api';

export default function LoginPage() {
  const { login } = useAuth();
  const { t, lang, toggleLang } = useLang();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'worker',
    adminKey: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginUser(form);
      const { token, user } = res.data;

      // Save to context and localStorage
      login(user, token);

      // Redirect based on role
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'doctor') navigate('/doctor');
      else navigate('/worker');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-teal-50 flex flex-col">
      {/* Language toggle */}
      <div className="flex justify-end p-4">
        <button
          onClick={toggleLang}
          className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition shadow-sm"
        >
          🌐 {lang === 'en' ? 'தமிழ்' : 'English'}
        </button>
      </div>

      {/* Center card */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl shadow-lg mb-4">
              <span className="text-3xl">🏥</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-800">{t('appName')}</h1>
            <p className="text-slate-500 text-sm mt-1">Secure access for healthcare professionals</p>
          </div>

          {/* Login form */}
          <div className="card shadow-md">
            <h2 className="text-lg font-semibold text-slate-700 mb-6">{t('login')}</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role selector */}
              <div>
                <label className="label">{t('role')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {['worker', 'doctor', 'admin'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setForm({ ...form, role: r })}
                      className={`py-2 rounded-lg text-sm font-semibold border transition capitalize ${
                        form.role === r
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'
                      }`}
                    >
                      {r === 'worker' ? '👷' : r === 'doctor' ? '🩺' : '🔐'} {t(r)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="label">{t('email')}</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="you@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="label">{t('password')}</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Admin secret key (only shown for admin role) */}
              {form.role === 'admin' && (
                <div>
                  <label className="label">{t('adminKey')}</label>
                  <input
                    type="password"
                    name="adminKey"
                    value={form.adminKey}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter admin key"
                    required
                  />
                </div>
              )}

              <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
                {loading ? t('loading') : t('login')}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Only authorized personnel can log in. Contact admin for credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
