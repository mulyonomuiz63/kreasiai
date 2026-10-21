import React from 'react';
import { useApp } from '../store/AppContext';
import { SubscriptionPlan } from '../types';
import { formatRupiah } from '../utils/pricing';
import { Check, Sparkles, Shield, ArrowRight, Zap, Info } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const { plans, currentUser, setCheckoutModalPlan, setAuthModalOpen, setAuthModalMode } = useApp();

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    if (!currentUser) {
      setAuthModalMode('register');
      setAuthModalOpen(true);
      return;
    }
    setCheckoutModalPlan(plan);
  };

  return (
    <section id="pricing" className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>PILIHAN PAKET LANGGANAN RESMI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Pilih Paket Studio Sesuai Kebutuhan Anda
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Semua paket berlaku <strong className="text-slate-900">3 bulan penuh</strong> dengan kuota kredit transparan, tanpa biaya tersembunyi, dan integrasi pembayaran instan Midtrans (QRIS & Virtual Account).
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <Info className="w-4 h-4 text-orange-500 shrink-0" />
            <span>
              Harga ekuivalen per bulan ditampilkan untuk kemudahan perbandingan. Pembayaran ditagihkan total per 3 bulan di muka.
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isUltra = plan.id === 'ultra';
            const isPro = plan.id === 'pro';
            const isCurrentActive =
              currentUser?.currentPlanId === plan.id && currentUser?.subscriptionStatus === 'active';

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl flex flex-col justify-between transition-all duration-300 ${
                  isUltra
                    ? 'border-2 border-orange-500 shadow-2xl shadow-orange-500/15 bg-gradient-to-b from-orange-50/40 via-white to-white ring-1 ring-orange-500/30 lg:-translate-y-2'
                    : isPro
                    ? 'border-2 border-slate-800 shadow-xl bg-white'
                    : 'border border-slate-200/90 shadow-md bg-white'
                }`}
              >
                {/* Promo Badge for Ultra */}
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black tracking-wider uppercase shadow-md flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {plan.badge}
                    </span>
                  </div>
                )}

                {/* Card Header & Pricing */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      {plan.name}
                    </h3>
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange-100 text-orange-800">
                      Diskon {plan.discountPercent}%
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 min-h-[40px] leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Equivalent Price / Month */}
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Ekuivalen Harga
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {formatRupiah(plan.equivalentPerMonth)}
                      </span>
                      <span className="text-sm font-semibold text-slate-500">
                        /bulan
                      </span>
                    </div>

                    {/* Total Quarterly Price & Strikethrough Comparison */}
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                      <div className="flex items-center justify-between text-slate-600 mb-1">
                        <span>Total per 3 bulan:</span>
                        <strong className="text-slate-900 text-sm font-bold">
                          {formatRupiah(plan.quarterlyPrice)}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Sebelum diskon:</span>
                        <span className="line-through">
                          {formatRupiah(plan.comparePrice)}
                        </span>
                      </div>
                    </div>

                    {/* Credit Quota Highlight */}
                    <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 border border-orange-200/80 text-orange-900 text-xs font-bold">
                      <Zap className="w-4 h-4 text-orange-600 fill-orange-600" />
                      <span>Kuota: {plan.creditQuota.toLocaleString('id-ID')} Kredit Internal</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="mt-8 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Keunggulan Paket:
                    </div>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action CTA Button */}
                <div className="p-8 pt-0">
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isCurrentActive}
                    className={`w-full py-4 px-6 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                      isCurrentActive
                        ? 'bg-emerald-500 text-white cursor-default'
                        : isUltra
                        ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-0.5'
                        : isPro
                        ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                        : 'bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span>
                      {isCurrentActive ? 'Paket Aktif Anda Saat Ini' : plan.buttonLabel}
                    </span>
                    {!isCurrentActive && <ArrowRight className="w-4 h-4" />}
                  </button>

                  <div className="mt-3 text-center text-[11px] text-slate-400">
                    Aktivasi instan via Midtrans (QRIS, VA BCA/Mandiri/BRI)
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Midtrans payment assurance banner */}
        <div className="mt-16 bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">
                Pembayaran Resmi & Terverifikasi Midtrans Indonesia
              </div>
              <div className="text-xs sm:text-sm text-slate-600">
                Server-side transaction creation, enkripsi TLS 256-bit, dan verifikasi tanda tangan SHA-512 webhook.
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700">
              QRIS
            </span>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700">
              GoPay
            </span>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700">
              BCA Virtual Account
            </span>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700">
              Mandiri Bill
            </span>
            <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700">
              Kartu Kredit
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
