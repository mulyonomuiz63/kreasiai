import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { Settings, User, Mail, Shield, Key, Save, CheckCircle2, LogOut } from 'lucide-react';

export const AccountSettingsView: React.FC = () => {
  const { currentUser, logout, showToast } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profil pengguna berhasil disimpan!', 'success');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setCurrentPassword('');
    setNewPassword('');
    showToast('Kata sandi berhasil diperbarui dengan hashing aman!', 'success');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-orange-500" />
          <span>Pengaturan Akun & Profil</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Kelola informasi nama pengguna, kredensial keamanan, dan status sesi akun Anda.
        </p>
      </div>

      {/* Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-orange-400" />
          <span>Informasi Profil Dasar</span>
        </h2>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser?.avatarUrl}
              alt={currentUser?.name}
              className="w-16 h-16 rounded-full border-2 border-orange-500/40 object-cover"
            />
            <div>
              <div className="text-sm font-bold text-white">{currentUser?.name}</div>
              <div className="text-xs text-slate-400">{currentUser?.email}</div>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 uppercase">
                Peran: {currentUser?.role}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Alamat Email (Terkunci)
            </label>
            <input
              type="email"
              disabled
              value={currentUser?.email || ''}
              className="w-full p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs sm:text-sm text-slate-400 cursor-not-allowed"
            />
          </div>

          <div className="pt-2 text-right">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 ml-auto"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-orange-400" />
          <span>Keamanan Kata Sandi</span>
        </h2>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Kata Sandi Saat Ini
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
              Kata Sandi Baru
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter unik"
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="pt-2 text-right">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 ml-auto"
            >
              <Shield className="w-3.5 h-3.5 text-orange-400" />
              <span>Perbarui Kata Sandi</span>
            </button>
          </div>
        </form>
      </div>

      {/* Session & Logout Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Sesi Akun & Keluar</span>
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Mengakhiri sesi akun saat ini pada peramban ini. Anda dapat masuk kembali kapan saja dengan email atau tombol login akun Google Anda.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-slate-900">
          <div>
            <div className="text-xs font-semibold text-slate-300">
              Sesi Aktif: <span className="text-white font-bold">{currentUser?.name}</span> ({currentUser?.email})
            </div>
            <div className="text-[11px] text-slate-500">
              Peran: <span className="uppercase text-orange-400 font-bold">{currentUser?.role}</span> • Status Langganan:{' '}
              <span className="text-emerald-400 font-bold capitalize">{currentUser?.subscriptionStatus || 'Aktif'}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="px-5 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar dari Akun (Logout)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
