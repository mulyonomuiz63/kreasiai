import React, { useState } from 'react';
import { Sparkles, Shield, Mail, FileText, ExternalLink, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [modalTitle, setModalTitle] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<string | null>(null);

  const openLegal = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
  };

  const termsText = `1. Penerimaan Ketentuan: Dengan mendaftar dan menggunakan Kreasi AI Studio, Anda menyetujui seluruh syarat ini.\n2. Akun & Keamanan: Anda bertanggung jawab atas kerahasiaan kata sandi akun Anda.\n3. Hak Kepemilikan Konten: Hasil video dan gambar AI yang dibuat oleh pengguna sepenuhnya menjadi hak milik pengguna untuk penggunaan komersial maupun non-komersial.\n4. Larangan Penggunaan: Dilarang menggunakan generator AI untuk menghasilkan konten eksplisit, kekerasan berbahaya, deepfake menipu, atau materi ilegal menurut hukum Republik Indonesia.`;

  const privacyText = `1. Pengumpulan Data: Kami mengumpulkan nama, alamat email, dan riwayat transaksi untuk aktivasi layanan dan sinkronisasi kuota kredit.\n2. Kerahasiaan Kredensial: Informasi kartu kredit dan akun bank diproses secara aman langsung melalui gateway Midtrans berlisensi Bank Indonesia; kami tidak pernah menyimpan nomor kartu kredit lengkap Anda.\n3. Penyimpanan Aset: File video dan gambar Anda disimpan di object storage privat terenkripsi.`;

  const cancellationText = `1. Masa Berlaku: Paket langganan berdurasi 3 bulan sejak tanggal pembayaran sah Midtrans.\n2. Pembatalan: Anda dapat memilih untuk tidak memperpanjang langganan kapan saja tanpa penalti.\n3. Kebijakan Refund: Pengembalian dana transaksi dapat diproses dalam waktu 3x24 jam sejak transaksi jika sistem mengalami kegagalan teknis permanen yang diverifikasi oleh tim support kami.`;

  const contactText = `Layanan Dukungan Pelanggan KREASI AI STUDIO:\n- WhatsApp Hotline: +62 812-9988-7766 (Senin-Minggu, 08:00 - 22:00 WIB)\n- Email Support: bantuan@kreasi.id\n- Alamat Kantor: Gedung Cyber 2 Lantai 18, Jl. HR Rasuna Said, Jakarta Selatan 12950, Indonesia.`;

  return (
    <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                KREASI <span className="text-orange-500">AI</span> STUDIO
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Platform SaaS AI Generatif terpadu di Indonesia untuk produksi video sinematik, gambar fotorealistik, naskah konten, dan alur kerja AI Agent otomatis.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Pembayaran Resmi Diproses oleh PT Midtrans Indonesia</span>
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Fitur Unggulan
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Cara Kerja
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Paket Langganan 3 Bulan
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Tanya Jawab (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Legal and Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Kebijakan & Bantuan
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => openLegal('Syarat & Ketentuan Layanan', termsText)}
                  className="hover:text-white transition-colors text-left"
                >
                  Syarat dan Ketentuan
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegal('Kebijakan Privasi Pengguna', privacyText)}
                  className="hover:text-white transition-colors text-left"
                >
                  Kebijakan Privasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegal('Kebijakan Pembatalan & Refund', cancellationText)}
                  className="hover:text-white transition-colors text-left"
                >
                  Kebijakan Pembatalan
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegal('Hubungi Kami & Kontak Support', contactText)}
                  className="hover:text-white transition-colors text-left flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-orange-400" />
                  <span>Kontak & Bantuan</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            © {new Date().getFullYear()} Kreasi AI Studio. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4">
            <span>Server: Jakarta, ID (Asia-Southeast)</span>
            <span>Midtrans API Status: Online (Sandbox / Live Ready)</span>
          </div>
        </div>
      </div>

      {/* Legal Dialog Modal */}
      {modalTitle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-lg text-slate-900">{modalTitle}</h3>
              <button
                onClick={() => setModalTitle(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 text-sm text-slate-600 whitespace-pre-line leading-relaxed max-h-96 overflow-y-auto">
              {modalContent}
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setModalTitle(null)}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
