import React from 'react';
import {
  UserPlus,
  Cpu,
  FileText,
  Sliders,
  Sparkles,
  Activity,
  DownloadCloud,
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: 'Daftar atau Login',
      desc: 'Buat akun dalam beberapa detik via Google OAuth atau email & password untuk masuk ke dashboard.',
      icon: UserPlus,
    },
    {
      step: 2,
      title: 'Pilih Model AI',
      desc: 'Pilih model yang tepat: Kling AI, Runway Gen-2, Luma Dream, Sora, atau Flux sesuai paket langganan Anda.',
      icon: Cpu,
    },
    {
      step: 3,
      title: 'Masukkan Prompt / Gambar',
      desc: 'Ketik deskripsi visual Anda dalam Bahasa Indonesia atau Inggris, atau unggah gambar sebagai referensi awal.',
      icon: FileText,
    },
    {
      step: 4,
      title: 'Atur Parameter Sesuai Model',
      desc: 'Tentukan rasio aspek (16:9, 9:16, 1:1), resolusi HD, dan durasi detik yang didukung resmi oleh provider.',
      icon: Sliders,
    },
    {
      step: 5,
      title: 'Klik Generate',
      desc: 'Sistem memvalidasi kuota kredit Anda secara aman di backend, mereservasi kredit, dan mengirim tugas ke GPU cluster.',
      icon: Sparkles,
    },
    {
      step: 6,
      title: 'Pantau Progres Antrean',
      desc: 'Lacak tahapan generasi real-time: antrean job, difusi frame, hingga encoding audio tanpa membuat browser macet.',
      icon: Activity,
    },
    {
      step: 7,
      title: 'Lihat, Unduh & Gunakan Kembali',
      desc: 'Putar hasil langsung di preview player, unduh file MP4/PNG resolusi penuh tanpa watermark, atau modifikasi prompt.',
      icon: DownloadCloud,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-orange-600 font-bold text-xs uppercase tracking-widest mb-2">
            ALUR KERJA MUDAH
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cara Kerja Kreasi AI Studio
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Hanya butuh 7 langkah mudah dari ide awal hingga file video dan gambar siap dipublikasikan.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {steps.map((s) => {
            const IconComp = s.icon;
            return (
              <div
                key={s.step}
                className="relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-orange-500 text-white font-extrabold text-sm flex items-center justify-center shadow-sm">
                      {s.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
