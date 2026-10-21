import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana cara kerja sistem kredit di Kreasi AI Studio?',
      a: 'Kredit internal digunakan sebagai satuan pemakaian saat membuat video, gambar, chat, atau menjalankan AI Agent. Misalnya: model Kling Basic membutuhkan 25 kredit, Runway Gen-2 membutuhkan 45 kredit, dan generasi gambar Flux Schnell membutuhkan 8 kredit. Saldo kredit Anda tersimpan di buku besar (ledger) yang immutable dan transparan di dashboard.',
    },
    {
      q: 'Model AI apa saja yang saat ini tersedia di platform?',
      a: 'Kami mengintegrasikan model-model AI generatif terdepan dunia: Kling AI v1.0, Runway Gen-2 Pro, Luma Dream Machine, Sora Cinematic Preview (eksklusif Ultra), Google Veo 2, Flux.1 Schnell, Flux.1 Pro High-Res, SDXL Turbo, Midjourney v6 Photoreal, serta Gemini 2.5 Flash untuk chat dan optimasi prompt.',
    },
    {
      q: 'Bagaimana proses berlangganan dan pembayaran melalui Midtrans?',
      a: 'Pilih paket Starter, Pro, atau Ultra di halaman harga. Klik tombol Mulai/Upgrade, lalu jendela pembayaran resmi Midtrans Snap akan muncul. Anda dapat membayar dengan QRIS (BCA, GoPay, OVO, Dana), Virtual Account bank nasional (BCA, Mandiri, BNI, BRI), atau Kartu Kredit. Setelah pembayaran lunas, kuota kredit dan akses model langsung aktif otomatis detik itu juga.',
    },
    {
      q: 'Berapa lama masa berlaku paket yang dibeli?',
      a: 'Setiap paket berlaku selama 3 bulan (90 hari) sejak tanggal aktivasi resmi. Selama masa aktif tersebut, Anda bebas menggunakan kuota kredit dan mengakses fitur serta model AI yang tercakup dalam tingkatan paket Anda.',
    },
    {
      q: 'Bagaimana kebijakan pengembalian kredit jika generasi video atau gambar gagal?',
      a: 'Jika sebuah tugas generasi gagal (misalnya karena gangguan jaringan provider AI atau kegagalan render GPU), sistem kami memiliki mekanisme Idempotent Auto-Refund. Kredit yang sebelumnya dideduksi akan otomatis dikembalikan ke saldo Anda dan tercatat di Credit Ledger dengan tipe JOB_REFUND.',
    },
    {
      q: 'Bagaimana keamanan data prompt dan aset media saya?',
      a: 'Seluruh komunikasi data dienkripsi dengan HTTPS TLS 256-bit. Kunci server Midtrans dan API provider disimpan secara ketat di backend environment dan tidak pernah terekspos ke browser. Hasil generasi Anda disimpan di storage pribadi yang hanya dapat diakses oleh akun Anda.',
    },
    {
      q: 'Bagaimana cara mengunduh hasil video dan gambar AI?',
      a: 'Setelah proses render selesai, Anda dapat memutar video di pemutar preview bawaan kami dan mengklik tombol "Unduh MP4" atau "Unduh PNG". Seluruh unduhan beresolusi penuh tanpa watermark komersial dan bebas Anda gunakan untuk kebutuhan konten media sosial maupun komersial.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-orange-600" />
            <span>TANYA JAWAB UMUM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Semua hal penting seputar paket langganan, model AI, dan pembayaran Midtrans.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-orange-600 transition-colors"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-orange-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-0 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
