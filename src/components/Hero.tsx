import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import {
  Sparkles,
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Video,
  Image as ImageIcon,
  Layers,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActiveNav, setAuthModalOpen, setAuthModalMode, currentUser } = useApp();
  const [isPlaying, setIsPlaying] = useState(true);

  const handleStart = () => {
    if (currentUser) {
      setActiveNav('video');
    } else {
      setAuthModalMode('register');
      setAuthModalOpen(true);
    }
  };

  const scrollToPricing = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-orange-50/20 to-slate-50">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-orange-400/10 via-amber-300/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top pill badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs sm:text-sm font-semibold mb-6">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Platform SaaS Video & Gambar AI Generatif Terintegrasi</span>
            <span className="text-orange-400">•</span>
            <span className="text-orange-900 font-bold">Didukung Midtrans</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Buat Video AI dan Gambar Profesional dalam{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500">
              Hitungan Menit
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Satu platform untuk menghasilkan video AI, gambar kreatif, konten pemasaran, dan ide visual
            dengan berbagai model AI dalam satu tempat.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Mulai Gratis</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={scrollToPricing}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200 shadow-sm transition-all"
            >
              Lihat Paket Harga
            </button>
          </div>

          {/* Trust bullet badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Multi-Model AI (Kling, Runway, Sora, Flux)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Checkout Resmi Midtrans (QRIS & VA)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Sistem Kredit Transparan & Ledger</span>
            </div>
          </div>
        </div>

        {/* Studio Preview Showcase Card */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xl bg-slate-900">
            {/* Top window bar */}
            <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-slate-400 font-mono ml-2 hidden sm:inline">
                  kreasi-ai-studio // video-generator.preview
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-medium">
                  Model: Runway Gen-2 Pro
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  Status: 1080p Full HD
                </span>
              </div>
            </div>

            {/* Video preview viewport */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                src="https://assets.mixkit.co/videos/preview/mixkit-coffee-cup-being-filled-with-milk-41481-large.mp4"
                poster="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop&q=80"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Floating Prompt Bar Over Video */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 sm:p-4 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-orange-500 text-white px-2 py-0.5 rounded">
                        Prompt Nyata
                      </span>
                      <span className="text-xs text-slate-400">Rasio 16:9 • Durasi 8 detik</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-2">
                      "Cinematic slow-motion shot of hot espresso pouring into steamed milk, latte art forming, warm morning sunbeams, 8k resolution, photorealistic."
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (currentUser) setActiveNav('video');
                      else {
                        setAuthModalMode('login');
                        setAuthModalOpen(true);
                      }
                    }}
                    className="shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm font-semibold text-white transition-colors"
                  >
                    Coba Prompt Ini
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Model pills showcase */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Runway Gen-2 & Kling</div>
                <div className="text-[11px] text-slate-500">Video Difusi Sinematik</div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Flux.1 Pro & SDXL</div>
                <div className="text-[11px] text-slate-500">Gambar Fotorealistik 8K</div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Gemini 2.5 Flash</div>
                <div className="text-[11px] text-slate-500">Asisten Ide & Copywriting</div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">AI Agent Workflows</div>
                <div className="text-[11px] text-slate-500">Automasi Kreatif Lengkap</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
