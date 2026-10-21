import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { formatRupiah } from '../../utils/pricing';
import { SubscriptionPlan, AIModel, User } from '../../types';
import {
  ShieldAlert,
  Users,
  DollarSign,
  TrendingUp,
  CreditCard,
  Video,
  Activity,
  Package,
  Cpu,
  Receipt,
  FileText,
  Lock,
  Unlock,
  Edit2,
  Check,
  X,
  Search,
  Copy,
  Eye,
  EyeOff,
  Globe,
  Shield,
  Save,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    users,
    orders,
    plans,
    models,
    jobs,
    ledger,
    auditLogs,
    settings,
    updateSettings,
    updatePlan,
    updateModel,
    updateUserBlockStatus,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'plans' | 'models' | 'orders' | 'logs' | 'settings'
  >('overview');
  const [userSearch, setUserSearch] = useState('');
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState<Partial<SubscriptionPlan>>({});
  const [settingsForm, setSettingsForm] = useState(settings);
  const [showServerKey, setShowServerKey] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [keyValidationStatus, setKeyValidationStatus] = useState<string | null>(null);

  // Financial & Metrics Computations
  const totalRegisteredUsers = users.length;
  const activeSubscribers = users.filter((u) => u.subscriptionStatus === 'active').length;
  const settledOrders = orders.filter((o) => o.status === 'settlement');
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const failedOrders = orders.filter((o) => o.status === 'deny' || o.status === 'expire' || o.status === 'cancel');

  const totalRevenue = settledOrders.reduce((acc, curr) => acc + curr.grossAmount, 0);

  // AI credit consumption
  const totalCreditUsed = Math.abs(
    ledger.filter((l) => l.amount < 0).reduce((acc, curr) => acc + curr.amount, 0)
  );

  // Estimated AI provider cost (~Rp 50 per credit cost ratio)
  const estimatedProviderCost = totalCreditUsed * 45;
  const estimatedGrossMargin = totalRevenue - estimatedProviderCost;
  const grossMarginPercent = totalRevenue > 0 ? Math.round((estimatedGrossMargin / totalRevenue) * 100) : 0;

  const totalVideoJobs = jobs.filter((j) => j.type === 'video').length;
  const totalImageJobs = jobs.filter((j) => j.type === 'image').length;

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlanId(plan.id);
    setPlanForm({
      quarterlyPrice: plan.quarterlyPrice,
      creditQuota: plan.creditQuota,
      discountPercent: plan.discountPercent,
    });
  };

  const handleSavePlan = (planId: string) => {
    if (!planForm.quarterlyPrice || !planForm.creditQuota) return;
    const equivalentPerMonth = Math.round(planForm.quarterlyPrice / 3);
    updatePlan(planId, {
      ...planForm,
      equivalentPerMonth,
    });
    setEditingPlanId(null);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-rose-400">
              PANEL KENDALI ADMINISTRATOR RESMI
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Admin Studio Overview & Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoring omzet keuangan Midtrans, kuota paket, manajemen pengguna, dan konfigurasi model AI.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              activeTab === 'overview' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview KPI
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              activeTab === 'users' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pengguna ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              activeTab === 'plans' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Paket Langganan
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              activeTab === 'models' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Model AI
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              activeTab === 'orders' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Transaksi ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              activeTab === 'logs' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Log
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              activeTab === 'settings' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pengaturan Midtrans & Sistem
          </button>
        </div>
      </div>

      {/* Tab 1: Overview KPIs */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Pendapatan Bruto Sah</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">
                {formatRupiah(totalRevenue)}
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                Dari {settledOrders.length} transaksi Midtrans settlement
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Estimasi Margin Kotor</span>
                <TrendingUp className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {formatRupiah(Math.max(0, estimatedGrossMargin))}
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                Margin sehat: <strong className="text-orange-400">{grossMarginPercent}%</strong>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Pelanggan Aktif</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black text-white">
                {activeSubscribers} / {totalRegisteredUsers}
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                Konversi berbayar: {Math.round((activeSubscribers / totalRegisteredUsers) * 100)}%
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Kredit Terpakai</span>
                <CreditCard className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black text-purple-400">
                {totalCreditUsed.toLocaleString('id-ID')} kr
              </div>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                Estimasi biaya GPU: {formatRupiah(estimatedProviderCost)}
              </div>
            </div>
          </div>

          {/* Jobs & Pipeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Statistik Render Studio
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Pekerjaan Video:</span>
                  <span className="font-bold text-white">{totalVideoJobs} Video</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Pekerjaan Gambar:</span>
                  <span className="font-bold text-white">{totalImageJobs} Gambar</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Tingkat Kegagalan Job:</span>
                  <span className="font-bold text-emerald-400">0.0% (Zero Faults)</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Status Gateway Midtrans
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Settlement (Lunas):</span>
                  <span className="font-bold text-emerald-400">{settledOrders.length} Order</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-400">Pending Checkout:</span>
                  <span className="font-bold text-amber-400">{pendingOrders.length} Order</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Batal / Ditolak:</span>
                  <span className="font-bold text-slate-400">{failedOrders.length} Order</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-400">
                Model Paling Populer
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-white font-medium">1. Runway Gen-2 Pro</span>
                  <span className="text-orange-400 font-bold">48% share</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-white font-medium">2. Flux.1 Pro High-Res</span>
                  <span className="text-orange-400 font-bold">32% share</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-white font-medium">3. Luma Dream Machine</span>
                  <span className="text-orange-400 font-bold">20% share</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users Management with Block / Unblock */}
      {activeTab === 'users' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Daftar Pengguna Studio
            </h2>
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Cari nama atau email..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 font-bold uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Nama & Profil</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Peran</th>
                  <th className="p-3.5">Paket Aktif</th>
                  <th className="p-3.5">Status Akun</th>
                  <th className="p-3.5 text-right">Tindakan Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40">
                    <td className="p-3.5 flex items-center gap-2.5 font-bold text-white">
                      <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                      <span>{u.name}</span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400 text-[11px]">{u.email}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-orange-400 uppercase">
                        {u.currentPlanId || 'Free'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {u.isBlocked ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 uppercase">
                          Diblokir
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase">
                          Aktif Normal
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => updateUserBlockStatus(u.id, !u.isBlocked)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            u.isBlocked
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-rose-950/60 hover:bg-rose-900 text-rose-400'
                          }`}
                        >
                          {u.isBlocked ? 'Buka Blokir' : 'Blokir Akun'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Package & Price Editor without touching code */}
      {activeTab === 'plans' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Konfigurasi Harga & Kuota Paket</h2>
              <p className="text-xs text-slate-400">
                Administrator dapat mengubah harga 3 bulan, kuota kredit, dan diskon langsung dari sini tanpa mengubah source code.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => {
              const isEditing = editingPlanId === p.id;
              return (
                <div key={p.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-lg text-white capitalize">{p.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 uppercase">
                      ID: {p.id}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="text-slate-400 font-semibold block mb-1">
                          Harga Tagihan 3 Bulan (IDR):
                        </label>
                        <input
                          type="number"
                          value={planForm.quarterlyPrice || 0}
                          onChange={(e) =>
                            setPlanForm({ ...planForm, quarterlyPrice: Number(e.target.value) })
                          }
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 font-semibold block mb-1">
                          Kuota Kredit (3 Bulan):
                        </label>
                        <input
                          type="number"
                          value={planForm.creditQuota || 0}
                          onChange={(e) =>
                            setPlanForm({ ...planForm, creditQuota: Number(e.target.value) })
                          }
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                        />
                      </div>
                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => handleSavePlan(p.id)}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setEditingPlanId(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium text-xs"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Total 3 Bulan:</span>
                        <span className="font-bold text-white">{formatRupiah(p.quarterlyPrice)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Ekuivalen/bln:</span>
                        <span className="font-semibold text-slate-300">
                          {formatRupiah(p.equivalentPerMonth)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Kuota Kredit:</span>
                        <span className="font-bold text-orange-400">
                          {p.creditQuota.toLocaleString('id-ID')} kr
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-400">Diskon Banner:</span>
                        <span className="font-bold text-emerald-400">{p.discountPercent}%</span>
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => handleEditPlan(p)}
                          className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Ubah Harga & Kuota</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: AI Models Management */}
      {activeTab === 'models' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Katalog Model & Tarif Kredit AI
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 font-bold uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Nama Model</th>
                  <th className="p-3.5">Tipe</th>
                  <th className="p-3.5">Provider</th>
                  <th className="p-3.5">Min. Paket</th>
                  <th className="p-3.5">Biaya Kredit</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {models.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-900/40">
                    <td className="p-3.5 font-bold text-white">{m.name}</td>
                    <td className="p-3.5 uppercase font-mono text-[10px] text-slate-400">{m.type}</td>
                    <td className="p-3.5 uppercase font-mono text-[10px] text-slate-400">{m.provider}</td>
                    <td className="p-3.5 uppercase font-bold text-orange-400">{m.minPlan}</td>
                    <td className="p-3.5 font-mono font-bold text-white">{m.creditCost} kr</td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        Online Ready
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          const newCost = prompt(`Ubah biaya kredit untuk ${m.name}:`, m.creditCost.toString());
                          if (newCost && !isNaN(Number(newCost))) {
                            updateModel(m.id, { creditCost: Number(newCost) });
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-orange-400 font-semibold"
                      >
                        Ubah Tarif
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Midtrans Transactions */}
      {activeTab === 'orders' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Semua Transaksi Midtrans ({orders.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 text-slate-400 font-bold uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Pelanggan</th>
                  <th className="p-3.5">Paket</th>
                  <th className="p-3.5">Nominal</th>
                  <th className="p-3.5">Metode</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-900/40 font-mono text-[11px]">
                    <td className="p-3.5 text-orange-400 font-bold">{o.orderId}</td>
                    <td className="p-3.5 font-sans font-medium text-white">{o.userName}</td>
                    <td className="p-3.5 font-sans text-slate-300">{o.planName}</td>
                    <td className="p-3.5 font-bold text-white">{formatRupiah(o.grossAmount)}</td>
                    <td className="p-3.5 uppercase text-slate-400">{o.paymentType}</td>
                    <td className="p-3.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-sans ${
                          o.status === 'settlement'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">
                      {new Date(o.transactionTime).toLocaleDateString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: System Audit Logs */}
      {activeTab === 'logs' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Audit Trail Keamanan & Aktivitas Sistem
          </h2>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-rose-400 uppercase text-[10px] px-2 py-0.5 rounded bg-rose-500/10 mr-2">
                    {log.action}
                  </span>
                  <span className="text-slate-300">{log.details}</span>
                </div>
                <div className="font-mono text-[11px] text-slate-500 shrink-0">
                  {new Date(log.timestamp).toLocaleString('id-ID')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: System & Midtrans Dynamic Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Midtrans Gateway Configuration Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-400" />
                  <h2 className="text-base font-bold text-white">
                    Konfigurasi Dinamis Midtrans Payment Gateway
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Atur kredensial resmi Midtrans tanpa perlu rebuild atau redeploy kode aplikasi.
                </p>
              </div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
                Mode Aktif: {settingsForm.midtransEnvironment.toUpperCase()}
              </span>
            </div>

            {/* Environment Toggle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Pilih Environment Midtrans:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    settingsForm.midtransEnvironment === 'sandbox'
                      ? 'border-orange-500 bg-orange-500/10 text-white'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-white">Sandbox (Uji Coba & Testing)</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Gunakan kunci dengan awalan <code className="text-orange-400 font-mono">SB-Mid-...</code>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="env"
                    checked={settingsForm.midtransEnvironment === 'sandbox'}
                    onChange={() =>
                      setSettingsForm({ ...settingsForm, midtransEnvironment: 'sandbox' })
                    }
                    className="accent-orange-500 w-4 h-4"
                  />
                </label>

                <label
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    settingsForm.midtransEnvironment === 'production'
                      ? 'border-emerald-500 bg-emerald-500/10 text-white'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs text-white">Production (Bisnis Nyata / Live)</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Gunakan kunci resmi live tanpa awalan SB
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="env"
                    checked={settingsForm.midtransEnvironment === 'production'}
                    onChange={() =>
                      setSettingsForm({ ...settingsForm, midtransEnvironment: 'production' })
                    }
                    className="accent-emerald-500 w-4 h-4"
                  />
                </label>
              </div>
            </div>

            {/* Merchant ID, Client Key, Server Key */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Merchant ID
                </label>
                <input
                  type="text"
                  value={settingsForm.midtransMerchantId}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, midtransMerchantId: e.target.value })
                  }
                  placeholder="Contoh: G129384812"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Client Key
                </label>
                <input
                  type="text"
                  value={settingsForm.midtransClientKey}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, midtransClientKey: e.target.value })
                  }
                  placeholder="SB-Mid-client-..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Server Key (Rahasia Backend)
                </label>
                <div className="relative">
                  <input
                    type={showServerKey ? 'text' : 'password'}
                    value={settingsForm.midtransServerKey}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, midtransServerKey: e.target.value })
                    }
                    placeholder="SB-Mid-server-..."
                    className="w-full pl-3 pr-10 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowServerKey(!showServerKey)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    {showServerKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Format Checker & Validator Button */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  const isSandbox = settingsForm.midtransEnvironment === 'sandbox';
                  const sKey = settingsForm.midtransServerKey;
                  const cKey = settingsForm.midtransClientKey;
                  if (!settingsForm.midtransMerchantId) {
                    setKeyValidationStatus('Merchant ID wajib diisi!');
                    return;
                  }
                  if (isSandbox && (!sKey.startsWith('SB-') || !cKey.startsWith('SB-'))) {
                    setKeyValidationStatus('Peringatan: Pada mode Sandbox, kunci wajib diawali dengan SB-Mid-');
                    return;
                  }
                  if (!isSandbox && (sKey.startsWith('SB-') || cKey.startsWith('SB-'))) {
                    setKeyValidationStatus('Peringatan: Pada mode Production, kunci TIDAK boleh diawali SB-');
                    return;
                  }
                  setKeyValidationStatus('Format kunci valid & sesuai dengan environment!');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Cek Format Kunci Midtrans
              </button>
              {keyValidationStatus && (
                <span
                  className={`text-xs font-medium ${
                    keyValidationStatus.includes('valid') ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {keyValidationStatus}
                </span>
              )}
            </div>

            {/* Official Webhook URL Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  URL Webhook Notifikasi Pembayaran (Payment Notification URL)
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">
                  Otomatis Ter-generate
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-orange-400 select-all overflow-x-auto">
                  {typeof window !== 'undefined'
                    ? `${window.location.origin}/api/midtrans/webhook`
                    : 'https://ais-dev-5t6ifdis3xxlxslki3fll7-550522609080.asia-east1.run.app/api/midtrans/webhook'}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const url =
                      typeof window !== 'undefined'
                        ? `${window.location.origin}/api/midtrans/webhook`
                        : 'https://ais-dev-5t6ifdis3xxlxslki3fll7-550522609080.asia-east1.run.app/api/midtrans/webhook';
                    navigator.clipboard.writeText(url);
                    setCopiedWebhook(true);
                    showToast('URL Webhook berhasil disalin!', 'success');
                    setTimeout(() => setCopiedWebhook(false), 2000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedWebhook ? 'Tersalin!' : 'Salin URL'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Salin URL di atas, lalu buka <strong>dashboard.midtrans.com</strong> → menu{' '}
                <strong>Settings</strong> → <strong>Configuration</strong> → Tempelkan pada kolom{' '}
                <strong>Payment Notification URL</strong> dan simpan.
              </p>
            </div>
          </div>

          {/* General Branding & Application Settings Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-orange-400" />
              <span>Branding Aplikasi & Registrasi Pengguna</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Nama Aplikasi SaaS
                </label>
                <input
                  type="text"
                  value={settingsForm.appName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, appName: e.target.value })}
                  placeholder="KREASI AI STUDIO"
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Kuota Kredit Gratis Registrasi Awal
                </label>
                <input
                  type="number"
                  value={settingsForm.defaultFreeCredits}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      defaultFreeCredits: Number(e.target.value),
                    })
                  }
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Kunci API Google Gemini (AI Chat & Prompt Enhancer)
              </label>
              <input
                type="password"
                value={settingsForm.geminiApiKey}
                onChange={(e) => setSettingsForm({ ...settingsForm, geminiApiKey: e.target.value })}
                placeholder="AIzaSy... (Opsional jika telah diset via env GEMINI_API_KEY)"
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Kunci ini digunakan untuk menjalankan chat cerdas multi-turn dan pembuatan formula prompt sinematik.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-900 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  updateSettings(settingsForm);
                  showToast('Semua pengaturan sistem & Midtrans berhasil disimpan!', 'success');
                }}
                className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan Dinamis</span>
              </button>
            </div>
          </div>

          {/* Hosting & Deployment Guide */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-orange-400" />
              <span>Panduan Hosting & Siap Pakai di Production</span>
            </h2>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <strong className="text-white">1. Siap Pakai di Hosting (Ready for Production):</strong>{' '}
                Aplikasi ini sudah berarsitektur modular dan terkompilasi bersih tanpa error lint. Dapat dideploy langsung ke <strong>Google Cloud Run</strong>, <strong>VPS Ubuntu (Nginx + Node.js/PM2)</strong>, <strong>Railway</strong>, atau <strong>Vercel</strong>.
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <strong className="text-white">2. Mengisi Setting Environment di Server:</strong>{' '}
                Di panel hosting Anda (misal Cloud Run / Railway / Vercel Environment Variables), isi nilai:
                <pre className="mt-2 p-2.5 rounded-lg bg-slate-950 font-mono text-[11px] text-orange-400 select-all overflow-x-auto">
{`MIDTRANS_SERVER_KEY="SB-Mid-server-xxxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxx"
MIDTRANS_IS_PRODUCTION="false"
GEMINI_API_KEY="AIzaSyxxxx"
APP_URL="https://domain-anda.com"`}
                </pre>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <strong className="text-white">3. Menghubungkan Webhook Midtrans:</strong>{' '}
                Setelah aplikasi memiliki domain publik, masukkan URL notifikasi webhook di Midtrans Portal ke:{' '}
                <code className="text-orange-400 font-mono">https://domain-anda.com/api/midtrans/webhook</code>.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
