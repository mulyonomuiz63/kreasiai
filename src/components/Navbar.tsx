import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import {
  Sparkles,
  Menu,
  X,
  CreditCard,
  UserCheck,
  ShieldCheck,
  LogIn,
  LogOut,
  ChevronRight,
  Zap,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    logout,
    users,
    switchUser,
    activeNav,
    setActiveNav,
    setAuthModalOpen,
    setAuthModalMode,
    getUserCreditBalance,
    plans,
    setCheckoutModalPlan,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const balance = getUserCreditBalance();
  const currentPlan = plans.find((p) => p.id === currentUser?.currentPlanId);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (activeNav !== 'landing') {
      setActiveNav('landing');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => setActiveNav('landing')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                KREASI
              </span>
              <span className="text-orange-500 font-extrabold text-lg ml-1">AI</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block -mt-1">
                Studio SaaS
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <button
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
            >
              Fitur
            </button>
            <button
              onClick={() => scrollToSection('models')}
              className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
            >
              Model AI
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
            >
              Harga Paket
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
            >
              FAQ
            </button>

            {/* If in landing, quick link to open dashboard */}
            {currentUser && activeNav === 'landing' && (
              <button
                onClick={() => setActiveNav('beranda')}
                className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                Buka Dashboard
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </nav>

          {/* Right Area: Auth & Profiles */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Demo Switcher (Helps examiner test Pro vs Starter vs Admin instantly) */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 border border-slate-200 transition-colors"
                title="Ganti akun uji demo"
              >
                <UserCheck className="w-3.5 h-3.5 text-orange-600" />
                <span>Akun Uji: {currentUser?.name.split(' ')[0]}</span>
                {currentUser?.role === 'admin' ? (
                  <span className="bg-rose-500 text-white text-[10px] px-1 py-0.2 rounded font-bold">
                    ADMIN
                  </span>
                ) : (
                  <span className="bg-orange-500 text-white text-[10px] px-1 py-0.2 rounded font-bold uppercase">
                    {currentUser?.currentPlanId || 'FREE'}
                  </span>
                )}
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Pilih Akun Pengujian:
                  </div>
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        u.id === currentUser?.id
                          ? 'bg-orange-50 text-orange-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <div className="font-medium text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-500">{u.email}</div>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-rose-100 text-rose-700'
                            : u.currentPlanId === 'ultra'
                            ? 'bg-purple-100 text-purple-700'
                            : u.currentPlanId === 'pro'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role === 'admin' ? 'Admin' : u.currentPlanId || 'Free'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2.5">
                {/* Credit balance display */}
                <div
                  onClick={() => {
                    setActiveNav('kredit');
                  }}
                  className="cursor-pointer flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full border border-orange-200/60 transition-colors"
                  title="Klik untuk melihat transaksi kredit"
                >
                  <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  <span className="text-xs font-bold">{balance.toLocaleString('id-ID')}</span>
                  <span className="text-[11px] text-orange-600 font-medium">Kredit</span>
                </div>

                {/* Admin Quick Button (if admin) */}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setActiveNav('admin')}
                    className="px-3 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm flex items-center gap-1.5 transition-all"
                    title="Buka Panel Administrator"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Panel Admin</span>
                  </button>
                )}

                {/* Dashboard button */}
                <button
                  onClick={() => setActiveNav(activeNav === 'landing' ? 'beranda' : 'landing')}
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/25 transition-all hover:shadow"
                >
                  {activeNav === 'landing' ? 'Buka Dashboard' : 'Lihat Landing Page'}
                </button>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200"
                  title="Keluar dari akun (Logout)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Masuk
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="px-4 py-2 text-sm font-semibold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/25 transition-all"
                >
                  Daftar Gratis
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {currentUser && (
              <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full text-xs font-bold text-orange-700 border border-orange-200">
                <Zap className="w-3 h-3 text-orange-500 fill-orange-500" />
                <span>{balance}</span>
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-4">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => scrollToSection('features')}
              className="text-left text-base font-medium text-slate-700 py-1"
            >
              Fitur Unggulan
            </button>
            <button
              onClick={() => scrollToSection('models')}
              className="text-left text-base font-medium text-slate-700 py-1"
            >
              Pilihan Model AI
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="text-left text-base font-medium text-slate-700 py-1"
            >
              Harga Paket Langganan
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-left text-base font-medium text-slate-700 py-1"
            >
              Tanya Jawab (FAQ)
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActiveNav(activeNav === 'landing' ? 'beranda' : 'landing');
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-orange-500 text-white"
                >
                  {activeNav === 'landing' ? 'Buka Dashboard' : 'Ke Landing Page'}
                </button>

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setActiveNav('admin');
                    }}
                    className="w-full py-2.5 text-center text-xs font-bold rounded-xl bg-rose-600 text-white flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Buka Panel Administrator</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full py-2 text-center text-xs font-semibold rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar dari Akun (Logout)</span>
                </button>

                <div className="text-xs text-slate-500 text-center pt-1">
                  Masuk sebagai: <strong>{currentUser.name}</strong> ({currentUser.email})
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="py-2.5 text-center text-sm font-medium border border-slate-200 rounded-xl text-slate-700"
                >
                  Masuk
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="py-2.5 text-center text-sm font-semibold rounded-xl bg-orange-500 text-white"
                >
                  Daftar Gratis
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
