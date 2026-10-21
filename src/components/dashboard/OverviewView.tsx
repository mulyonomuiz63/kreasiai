import React from 'react';
import { useApp } from '../../store/AppContext';
import { formatRupiah } from '../../utils/pricing';
import {
  Video,
  Image as ImageIcon,
  Bot,
  Zap,
  Calendar,
  Sparkles,
  ArrowRight,
  Play,
  Layers,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export const OverviewView: React.FC = () => {
  const {
    currentUser,
    plans,
    getUserCreditBalance,
    assets,
    jobs,
    setActiveNav,
    setCheckoutModalPlan,
  } = useApp();

  const balance = getUserCreditBalance();
  const currentPlan = plans.find((p) => p.id === currentUser?.currentPlanId);
  const activeJobs = jobs.filter((j) => j.status === 'processing' || j.status === 'queued');

  // Calculate days left in subscription
  let daysLeft = 90;
  if (currentUser?.subscriptionExpiresAt) {
    const diff = new Date(currentUser.subscriptionExpiresAt).getTime() - Date.now();
    daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KREASI AI STUDIO SAAS</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang di Studio, {currentUser?.name}!
          </h1>
          <p className="text-orange-100 text-sm sm:text-base leading-relaxed">
            Platform studio Anda siap untuk merender video AI sinematik, menghasilkan gambar 8K, dan menjalankan alur kerja otomatis AI Agent.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveNav('video')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <Video className="w-4 h-4 text-orange-400" />
              <span>Buat Video Baru</span>
            </button>
            <button
              onClick={() => setActiveNav('image')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-orange-50 text-slate-900 font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4 text-orange-600" />
              <span>Buat Gambar AI</span>
            </button>
            <button
              onClick={() => setActiveNav('agent')}
              className="px-5 py-2.5 rounded-xl bg-orange-700/60 hover:bg-orange-700 text-white font-bold text-xs border border-white/20 transition-colors flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>Jalankan AI Agent</span>
            </button>
          </div>
        </div>

        {/* Ambient graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-white/10 to-transparent pointer-events-none hidden lg:block" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Credit Card */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Sisa Saldo Kredit</span>
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {balance.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
            <span>Tercatat di Ledger</span>
            <button
              onClick={() => setActiveNav('kredit')}
              className="text-orange-400 hover:underline font-semibold"
            >
              Buku Besar →
            </button>
          </div>
        </div>

        {/* Active Plan Card */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Paket Langganan</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white capitalize">
            {currentPlan ? currentPlan.name : 'Free Tier'}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
            <span>
              {currentUser?.subscriptionStatus === 'active'
                ? `Masa Aktif: ~${daysLeft} hari lagi`
                : 'Tidak ada paket aktif'}
            </span>
            <button
              onClick={() => setCheckoutModalPlan(plans[1])}
              className="text-orange-400 hover:underline font-semibold"
            >
              Upgrade →
            </button>
          </div>
        </div>

        {/* Total Assets Created */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Hasil Galeri</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {assets.length} Aset
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
            <span>{assets.filter((a) => a.type === 'video').length} Video • {assets.filter((a) => a.type === 'image').length} Gambar</span>
            <button
              onClick={() => setActiveNav('galeri')}
              className="text-orange-400 hover:underline font-semibold"
            >
              Buka Galeri →
            </button>
          </div>
        </div>

        {/* Active Jobs in Queue */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pekerjaan Berjalan</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {activeJobs.length} Aktif
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
            <span>{activeJobs.length > 0 ? 'Sedang merender...' : 'Antrean bersih'}</span>
            <button
              onClick={() => setActiveNav('riwayat')}
              className="text-orange-400 hover:underline font-semibold"
            >
              Riwayat →
            </button>
          </div>
        </div>
      </div>

      {/* Active Jobs Progress Bar (if any job is running) */}
      {activeJobs.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-orange-500/40 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 font-bold text-orange-400">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
              <span>GPU Cluster Memproses: {activeJobs[0].modelName}</span>
            </div>
            <span className="font-mono text-slate-400">{activeJobs[0].progressPercent}% Selesai</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
              style={{ width: `${activeJobs[0].progressPercent}%` }}
            />
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span className="truncate">"{activeJobs[0].prompt}"</span>
            <span className="text-orange-300 shrink-0 font-medium">{activeJobs[0].stageText}</span>
          </div>
        </div>
      )}

      {/* Recent Gallery Highlights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Hasil Generasi Terbaru</h2>
            <p className="text-xs text-slate-400">Koleksi video dan gambar yang baru saja dibuat</p>
          </div>
          <button
            onClick={() => setActiveNav('galeri')}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
          >
            <span>Lihat Semua Galeri</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {assets.slice(0, 4).map((asset) => (
            <div
              key={asset.id}
              className="group rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={asset.thumbnailUrl}
                  alt={asset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-sm text-white">
                  {asset.type.toUpperCase()}
                </span>
                {asset.durationSec && (
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-white">
                    {asset.durationSec}s
                  </span>
                )}
              </div>
              <div className="p-3.5 space-y-2">
                <div className="text-xs font-bold text-white line-clamp-1">{asset.title}</div>
                <div className="text-[11px] text-slate-400 line-clamp-2">"{asset.prompt}"</div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-900">
                  <span>{asset.modelName}</span>
                  <span className="font-semibold text-orange-400">{asset.resolution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
