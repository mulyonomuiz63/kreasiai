import React from 'react';
import { HelpCircle, MessageSquare, Mail, Phone, ExternalLink, Sparkles, Shield } from 'lucide-react';

export const HelpView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <HelpCircle className="w-6 h-6 text-orange-500" />
          <span>Pusat Bantuan & Layanan Pelanggan</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Panduan operasional studio, integrasi API, dan kontak customer support kami di Indonesia.
        </p>
      </div>

      {/* Support Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">WhatsApp Priority Support</h3>
          <p className="text-xs text-slate-400">
            Respon instan untuk kendala pembayaran Midtrans atau antrean render AI.
          </p>
          <div className="pt-2 text-xs font-bold text-orange-400">
            +62 812-9988-7766
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Email Bantuan Resmi</h3>
          <p className="text-xs text-slate-400">
            Kirimkan pertanyaan teknis, faktur pajak korporasi, atau penyesuaian kuota.
          </p>
          <div className="pt-2 text-xs font-bold text-blue-400">
            bantuan@kreasi.id
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">SLA & Keandalan Server</h3>
          <p className="text-xs text-slate-400">
            Server GPU beroperasi 99.9% uptime dengan sistem Auto-Refund kredit jika job gagal.
          </p>
          <div className="pt-2 text-xs font-bold text-emerald-400">
            Status: Normal & Optimal
          </div>
        </div>
      </div>

      {/* Tips Guide */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white">
          Tips Menghasilkan Video & Gambar Terbaik
        </h2>
        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <strong className="text-orange-400">1. Gunakan Deskripsi Pencahayaan & Gerakan:</strong> Tambahkan kata kunci seperti <em>cinematic golden hour, volumetric lighting, slow pan right, macro lens</em> untuk hasil yang lebih dramatis.
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <strong className="text-orange-400">2. Manfaatkan Chat Asisten:</strong> Gunakan menu Chat AI untuk meminta AI membuatkan formula prompt video secara otomatis sebelum menekan tombol render.
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <strong className="text-orange-400">3. Unduh Tanpa Kompresi:</strong> Seluruh hasil di Galeri dapat diunduh langsung sebagai file MP4 asli tanpa watermark untuk kenyamanan kampanye komersial Anda.
          </div>
        </div>
      </div>
    </div>
  );
};
