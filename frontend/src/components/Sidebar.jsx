// src/components/Sidebar.jsx
// Reusable sidebar for all dashboards

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

export default function Sidebar({ links, role }) {
  const { logout, user } = useAuth();
  const { t, lang, toggleLang } = useLang();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role colors
  const roleColors = {
    worker: 'from-teal-600 to-teal-700',
    doctor: 'from-primary-600 to-primary-700',
    admin: 'from-slate-700 to-slate-800',
  };

  const roleIcons = { worker: '👷', doctor: '🩺', admin: '🔐' };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-100 flex flex-col shadow-sm">
      {/* Logo + role header */}
      <div className={`bg-gradient-to-br ${roleColors[role] || roleColors.worker} p-5 text-white`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{roleIcons[role]}</span>
          <div>
            <p className="font-display font-bold text-sm leading-tight">Migrant Medical</p>
            <p className="text-xs opacity-75 capitalize">{t(role)} Panel</p>
          </div>
        </div>
        {/* User info */}
        <div className="mt-4 bg-white/10 rounded-lg px-3 py-2">
          <p className="text-xs font-semibold truncate">{user?.profile?.fullName || user?.email}</p>
          <p className="text-xs opacity-70 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Language toggle + logout */}
      <div className="px-3 pb-4 space-y-2 border-t border-slate-100 pt-3">
        <button
          onClick={toggleLang}
          className="sidebar-link w-full text-left"
        >
          <span>🌐</span>
          <span>{lang === 'en' ? 'Switch to தமிழ்' : 'Switch to English'}</span>
        </button>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <span>🚪</span>
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}
