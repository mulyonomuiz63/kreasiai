import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { X, Mail, Lock, User as UserIcon, Sparkles, Shield, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    loginWithGoogle,
    switchUser,
    users,
    showToast,
  } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authModalMode === 'login') {
      if (!email.trim()) {
        showToast('Mohon masukkan email Anda.', 'error');
        return;
      }
      const ok = login(email);
      if (ok) setAuthModalOpen(false);
    } else {
      if (!name.trim() || !email.trim()) {
        showToast('Mohon isi nama dan email dengan lengkap.', 'error');
        return;
      }
      const ok = register(name, email);
      if (ok) setAuthModalOpen(false);
    }
  };

  const handlePickPreset = (userId: string) => {
    switchUser(userId);
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              KREASI <span className="text-orange-500">AI</span> STUDIO
            </span>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-900">
            {authModalMode === 'login' ? 'Masuk ke Studio Akun' : 'Daftar Akun Baru'}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {authModalMode === 'login'
              ? 'Kelola video, gambar, dan kredit generasi AI Anda'
              : 'Dapatkan 50 kredit gratis saat registrasi awal'}
          </p>

          {/* Google One-Click Login */}
          <div className="mt-5">
            <button
              onClick={loginWithGoogle}
              className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 font-semibold text-xs text-slate-700 flex items-center justify-center gap-3 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Lanjutkan dengan Akun Google</span>
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
            <div className="flex-1 h-px bg-slate-200" />
            <span>atau gunakan email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalMode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Rian Pratama"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kreasi.id atau email Anda"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{authModalMode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun Gratis'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-4 text-center text-xs text-slate-500">
            {authModalMode === 'login' ? (
              <>
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('register')}
                  className="text-orange-600 font-bold hover:underline"
                >
                  Daftar di sini
                </button>
              </>
            ) : (
              <>
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="text-orange-600 font-bold hover:underline"
                >
                  Masuk di sini
                </button>
              </>
            )}
          </div>

          {/* Quick Demo Credentials Picker & 1-Click Admin Login */}
          <div className="mt-6 pt-4 border-t border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Akses Cepat Pengujian:
              </span>
              <span className="text-[10px] text-orange-600 font-bold">1-Klik Langsung Masuk</span>
            </div>

            {/* Direct Admin Login Button */}
            <button
              type="button"
              onClick={() => {
                const adminUser = users.find((u) => u.role === 'admin') || users[1];
                handlePickPreset(adminUser.id);
              }}
              className="w-full p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-800 flex items-center justify-between transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-600" />
                <span>Masuk Sebagai Administrator (Owner)</span>
              </div>
              <span className="text-[10px] uppercase bg-rose-600 text-white px-2 py-0.5 rounded font-black">
                ADMIN
              </span>
            </button>

            <div className="space-y-1">
              {users
                .filter((u) => u.role !== 'admin')
                .slice(0, 3)
                .map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handlePickPreset(u.id)}
                    className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-orange-50 text-xs flex items-center justify-between border border-slate-200/60 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">{u.name}</span>
                      <span className="text-slate-400 text-[11px] ml-1.5">({u.email})</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 uppercase">
                      {u.currentPlanId || 'Free'}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
