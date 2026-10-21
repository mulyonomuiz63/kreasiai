import React from 'react';
import {
  Video,
  Image as ImageIcon,
  MessageSquare,
  Cpu,
  Bot,
  FolderArchive,
  CreditCard,
  Download,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../store/AppContext';

export const Features: React.FC = () => {
  const { setActiveNav, currentUser } = useApp();

  const featureCards = [
    {
      id: 'video',
      title: '1. AI Video Generator',
      desc: 'Hasilkan video sinematik berkualitas tinggi dari teks (Text-to-Video) maupun gambar referensi (Image-to-Video) dengan kontrol rasio dan durasi.',
      icon: Video,
      color: 'bg-orange-50 text-orange-600 border-orange-200',
      tag: 'Multi-Durasi',
    },
    {
      id: 'image',
      title: '2. AI Image Generator',
      desc: 'Ciptakan visual fotorealistik, render arsitektur, ilustrasi produk, hingga karakter animasi 8K dengan model Flux.1 dan Stable Diffusion XL.',
      icon: ImageIcon,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      tag: 'Hingga 2048px',
    },
    {
      id: 'chat',
      title: '3. AI Chat Assistant',
      desc: 'Asisten percakapan cerdas multi-turn untuk brainstorming konsep, penulisan skrip iklan, dan pengubahan otomatis jawaban chat menjadi prompt video atau gambar.',
      icon: MessageSquare,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      tag: 'Formula Prompt',
    },
    {
      id: 'models',
      title: '4. Berbagai Pilihan Model AI',
      desc: 'Bebas memilih provider model sesuai kebutuhan: Kling AI, Runway Gen-2, Luma Dream Machine, Sora Preview, hingga Flux.1 Pro dalam satu dashboard.',
      icon: Cpu,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      tag: 'Tersedia 9+ Model',
    },
    {
      id: 'agent',
      title: '5. AI Agent Alur Kerja',
      desc: 'Jalankan automasi end-to-end dengan Content Creator Agent, Marketing Copy Agent, hingga Custom Workflow Builder dengan batas kredit aman.',
      icon: Bot,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      tag: 'Workflow Otomatis',
    },
    {
      id: 'galeri',
      title: '6. Riwayat Generasi & Galeri',
      desc: 'Semua kreasi tersimpan aman di cloud. Lihat parameter generasi sebelumnya, status pekerjaan aktif, serta buat ulang variasi baru dengan 1 klik.',
      icon: FolderArchive,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      tag: 'Penyimpanan Cloud',
    },
    {
      id: 'kredit',
      title: '7. Sistem Kredit yang Transparan',
      desc: 'Sistem buku besar (Credit Ledger) yang mencatat setiap deduksi, pengembalian otomatis saat pekerjaan gagal, serta penyesuaian kuota paket.',
      icon: CreditCard,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      tag: 'Ledger Immutable',
    },
    {
      id: 'download',
      title: '8. Pengelolaan Hasil & Unduhan',
      desc: 'Unduh langsung format MP4 murni dan PNG resolusi penuh tanpa watermark komersial untuk kampanye media sosial atau klien Anda.',
      icon: Download,
      color: 'bg-teal-50 text-teal-600 border-teal-200',
      tag: 'Bebas Watermark',
    },
  ];

  return (
    <section id="features" className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-orange-600 font-bold text-xs uppercase tracking-widest mb-2">
            KEMAMPUAN PLATFORM
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Fitur Unggulan Studio Kreatif Anda
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Dirancang secara matang untuk memangkas jam kerja produksi video dan materi pemasaran visual menjadi beberapa menit saja.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((feat) => {
            const IconComp = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => {
                  if (currentUser) {
                    if (feat.id === 'video') setActiveNav('video');
                    else if (feat.id === 'image') setActiveNav('image');
                    else if (feat.id === 'chat') setActiveNav('chat');
                    else if (feat.id === 'agent') setActiveNav('agent');
                    else if (feat.id === 'galeri') setActiveNav('galeri');
                    else if (feat.id === 'kredit') setActiveNav('kredit');
                    else setActiveNav('beranda');
                  }
                }}
                className="group relative bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-orange-300 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${feat.color}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-200/70 text-slate-700">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-orange-600 transition-colors">
                  <span>Buka di Studio</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
