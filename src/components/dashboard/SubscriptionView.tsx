import React from 'react';
import { useApp } from '../../store/AppContext';
import { formatRupiah } from '../../utils/pricing';
import {
  Package,
  Calendar,
  Sparkles,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export const SubscriptionView: React.FC = () => {
  const { currentUser, plans, setCheckoutModalPlan, getUserCreditBalance } = useApp();

  const currentPlan = plans.find((p) => p.id === currentUser?.currentPlanId);
  const balance = getUserCreditBalance();

  let daysLeft = 90;
  if (currentUser?.subscriptionExpiresAt) {
    const diff = new Date(currentUser.subscriptionExpiresAt).getTime() - Date.now();
    daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <Package className="w-6 h-6 text-orange-500" />
          <span>Paket & Status Langganan Studio</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Semua paket berlaku selama 3 bulan penuh. Kuota kredit dan akses model diaktifkan instan via Midtrans.
        </p>
      </div>

      {/* Active Subscription Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Status Berlangganan: AKTIF
            </span>
          </div>
          <div className="text-3xl font-black text-white">
            {currentPlan ? `Paket ${currentPlan.name} (3 Bulan)` : 'Akun Pendaftaran Gratis'}
          </div>
          <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              <span>
                Berlaku hingga:{' '}
                <strong className="text-white">
                  {currentUser?.subscriptionExpiresAt
                    ? new Date(currentUser.subscriptionExpiresAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'Tidak ada batas'}
                </strong>{' '}
                (~{daysLeft} hari lagi)
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              <span>Sisa Kuota: <strong className="text-white">{balance} Kredit</strong></span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button
            onClick={() => setCheckoutModalPlan(plans[2])}
            className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Upgrade ke Ultra (Paling Worth)</span>
          </button>
        </div>
      </div>

      {/* Available Plans to Switch / Upgrade */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Pilihan Paket Langganan 3 Bulan</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((p) => {
            const isCurrent = p.id === currentUser?.currentPlanId;
            return (
              <div
                key={p.id}
                className={`p-6 rounded-3xl bg-slate-950 border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : p.id === 'ultra'
                    ? 'border-orange-500/80 bg-gradient-to-b from-orange-950/20 to-slate-950'
                    : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-extrabold text-white">{p.name}</h3>
                    {p.badge && (
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500 text-white">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 min-h-[32px]">{p.description}</p>

                  <div className="mt-4 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                    <div className="text-2xl font-black text-white">
                      {formatRupiah(p.quarterlyPrice)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Ekuivalen: {formatRupiah(p.equivalentPerMonth)}/bulan (tagihan 3 bulan)
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-300">
                    <div className="font-bold text-slate-400 uppercase text-[10px]">
                      Fitur Termasuk:
                    </div>
                    {p.features.slice(0, 5).map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900">
                  <button
                    onClick={() => setCheckoutModalPlan(p)}
                    disabled={isCurrent}
                    className={`w-full py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    <span>{isCurrent ? 'Paket Aktif Anda' : `Pilih ${p.name}`}</span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
