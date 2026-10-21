import React, { useState } from 'react';
import { useApp, ActiveNav } from '../store/AppContext';
import {
  Home,
  MessageSquare,
  Video,
  Image as ImageIcon,
  Bot,
  FolderArchive,
  History,
  CreditCard,
  Package,
  Receipt,
  Settings,
  HelpCircle,
  ShieldAlert,
  Zap,
  Bell,
  Sparkles,
  LogOut,
  ChevronRight,
  Menu,
  X,
  UserCheck,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const {
    currentUser,
    users,
    switchUser,
    activeNav,
    setActiveNav,
    getUserCreditBalance,
    plans,
    setCheckoutModalPlan,
    logout,
  } = useApp();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const balance = getUserCreditBalance();
  const currentPlan = plans.find((p) => p.id === currentUser?.currentPlanId);

  const menuItems: { id: ActiveNav; label: string; icon: any; badge?: string }[] = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'chat', label: 'Chat AI', icon: MessageSquare, badge: 'Asisten' },
    { id: 'video', label: 'Buat Video', icon: Video, badge: 'Pro' },
    { id: 'image', label: 'Buat Gambar', icon: ImageIcon },
    { id: 'agent', label: 'AI Agent', icon: Bot, badge: 'Workflow' },
    { id: 'galeri', label: 'Galeri Saya', icon: FolderArchive },
    { id: 'riwayat', label: 'Riwayat Generasi', icon: History },
    { id: 'kredit', label: 'Kredit & Pemakaian', icon: CreditCard },
    { id: 'paket', label: 'Paket & Langganan', icon: Package },
    { id: 'transaksi', label: 'Riwayat Pembayaran', icon: Receipt },
    { id: 'pengaturan', label: 'Pengaturan Akun', icon: Settings },
    { id: 'bantuan', label: 'Bantuan & FAQ', icon: HelpCircle },
  ];

  const handleNavClick = (navId: ActiveNav) => {
    setActiveNav(navId);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-800 bg-slate-950/80 backdrop-blur-md transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } shrink-0`}
      >
        {/* Brand */}
        <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between">
          {!sidebarCollapsed ? (
            <div
              onClick={() => setActiveNav('landing')}
              className="flex items-center gap-2.5 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="font-extrabold text-sm tracking-tight text-white">
                KREASI <span className="text-orange-500">AI</span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setActiveNav('landing')}
              className="w-8 h-8 mx-auto rounded-lg bg-orange-500 flex items-center justify-center text-white cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded text-slate-400 hover:text-white"
            title={sidebarCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`}
            />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!sidebarCollapsed && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && !isActive && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}

          {/* Admin Menu (Only if admin role) */}
          {currentUser?.role === 'admin' && (
            <div className="pt-3 mt-3 border-t border-slate-800">
              {!sidebarCollapsed && (
                <div className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-rose-400 mb-1">
                  Area Administrator
                </div>
              )}
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-colors ${
                  activeNav === 'admin'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/40'
                }`}
              >
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                {!sidebarCollapsed && <span>Admin Dashboard</span>}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Footer Credit Box & Logout */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {!sidebarCollapsed ? (
            <>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Sisa Kuota:</span>
                  <span className="font-extrabold text-orange-400">
                    {balance.toLocaleString('id-ID')} Kredit
                  </span>
                </div>
                <button
                  onClick={() => setCheckoutModalPlan(plans[1])}
                  className="w-full py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors"
                >
                  Upgrade / Tambah
                </button>
              </div>

              <button
                onClick={logout}
                className="w-full py-2 px-3 rounded-xl border border-slate-800 hover:bg-rose-950/40 hover:border-rose-900/50 text-slate-400 hover:text-rose-400 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar (Logout)</span>
              </button>
            </>
          ) : (
            <button
              onClick={logout}
              className="w-full p-2.5 rounded-xl border border-slate-800 hover:bg-rose-950/40 hover:border-rose-900/50 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors"
              title="Keluar (Logout)"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Modal */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 md:hidden flex">
          <div className="w-72 bg-slate-950 border-r border-slate-800 p-4 flex flex-col h-full">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <span className="font-extrabold text-base text-white">KREASI AI STUDIO</span>
              </div>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 py-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 ${
                      isActive ? 'bg-orange-500 text-white' : 'text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 flex items-center gap-3 mt-4"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileSidebarOpen(false);
                  setActiveNav('landing');
                }}
                className="text-xs text-orange-400 hover:underline"
              >
                ← Landing Page
              </button>
              <button
                onClick={() => {
                  logout();
                  setMobileSidebarOpen(false);
                }}
                className="text-xs text-rose-400 hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="text-xs text-slate-400 hidden sm:block">Selamat berkreasi,</div>
              <div className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                <span>{currentUser?.name || 'Kreator Studio'}</span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-xs font-bold text-orange-400 hidden sm:inline">
                  {currentPlan ? `Paket ${currentPlan.name} (Aktif)` : 'Paket Gratis'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Header: Sisa Kredit, Upgrade, Notif, Avatar */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
                title="Ganti akun uji coba"
              >
                <UserCheck className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">{currentUser?.name.split(' ')[0]}</span>
                <span
                  className={`text-[10px] px-1 py-0.2 rounded font-bold uppercase ${
                    currentUser?.role === 'admin'
                      ? 'bg-rose-600 text-white'
                      : 'bg-orange-500 text-white'
                  }`}
                >
                  {currentUser?.role === 'admin' ? 'Admin' : currentUser?.currentPlanId || 'Free'}
                </span>
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-2 z-50 text-slate-200"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                    Ganti Profil Uji:
                  </div>
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between ${
                        u.id === currentUser?.id ? 'bg-orange-500/20 text-orange-400 font-bold' : 'hover:bg-slate-800'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                        {u.role === 'admin' ? 'Admin' : u.currentPlanId || 'Free'}
                      </span>
                    </button>
                  ))}
                  <div className="border-t border-slate-800 my-1 pt-1 space-y-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setActiveNav('landing');
                      }}
                      className="w-full text-left p-1.5 text-xs text-orange-400 hover:bg-slate-800 rounded flex items-center justify-between"
                    >
                      <span>Ke Halaman Depan (Landing)</span>
                      <span>→</span>
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left p-1.5 text-xs text-rose-400 hover:bg-rose-950/40 rounded flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar dari Akun (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Credit Counter */}
            <div
              onClick={() => setActiveNav('kredit')}
              className="cursor-pointer flex items-center gap-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-full border border-orange-500/30 transition-colors"
              title="Lihat riwayat pemakaian kredit"
            >
              <Zap className="w-3.5 h-3.5 fill-orange-400" />
              <span className="text-xs font-black">{balance.toLocaleString('id-ID')}</span>
              <span className="text-[11px] font-semibold text-orange-300">Kredit</span>
            </div>

            {/* Upgrade CTA */}
            <button
              onClick={() => setCheckoutModalPlan(plans[2])}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm shadow-orange-500/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tambah Kredit / Upgrade</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative"
                aria-label="Notifikasi sistem"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-orange-500 absolute top-2 right-2 ring-2 ring-slate-900" />
              </button>

              {notificationOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 text-slate-200"
                  onMouseLeave={() => setNotificationOpen(false)}
                >
                  <div className="font-bold text-xs text-white pb-2 border-b border-slate-800 mb-2">
                    Notifikasi Terbaru
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-800/80">
                      <div className="font-semibold text-orange-400">Pembayaran Midtrans</div>
                      <div className="text-slate-400 text-[11px]">
                        Order #{currentUser?.currentPlanId ? 'PRO-9842' : 'INIT'} dinyatakan sah.
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/80">
                      <div className="font-semibold text-emerald-400">Model Baru Tersedia</div>
                      <div className="text-slate-400 text-[11px]">
                        Runway Gen-2 & Flux.1 Pro kini aktif di cluster rendering.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser?.name || 'User'}
              className="w-8 h-8 rounded-full border border-slate-700 object-cover"
            />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
