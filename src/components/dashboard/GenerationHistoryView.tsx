import React from 'react';
import { useApp } from '../../store/AppContext';
import { History, Video, Image as ImageIcon, CheckCircle2, Clock, XCircle, ArrowUpRight } from 'lucide-react';

export const GenerationHistoryView: React.FC = () => {
  const { jobs, assets, setActiveNav } = useApp();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <History className="w-6 h-6 text-orange-500" />
          <span>Riwayat Generasi Pekerjaan</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Lacak setiap pekerjaan rendering video dan gambar, status antrean, serta penggunaan kuota kredit.
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">Waktu</th>
                <th className="p-4">ID Pekerjaan</th>
                <th className="p-4">Jenis</th>
                <th className="p-4">Model AI</th>
                <th className="p-4">Prompt / Deskripsi</th>
                <th className="p-4">Kredit</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    Belum ada riwayat pekerjaan generasi. Buat video atau gambar pertama Anda!
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      {new Date(job.createdAt).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-400">
                      {job.id}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300">
                        {job.type === 'video' ? <Video className="w-3 h-3 text-orange-400" /> : <ImageIcon className="w-3 h-3 text-amber-400" />}
                        {job.type}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-white">
                      {job.modelName}
                    </td>
                    <td className="p-4 max-w-xs truncate" title={job.prompt}>
                      "{job.prompt}"
                    </td>
                    <td className="p-4 font-mono font-bold text-orange-400">
                      -{job.costCredits} kr
                    </td>
                    <td className="p-4">
                      {job.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Selesai</span>
                        </span>
                      ) : job.status === 'processing' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-400 animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{job.progressPercent}% Render</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Gagal</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {job.resultUrl ? (
                        <button
                          onClick={() => setActiveNav('galeri')}
                          className="px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 font-semibold text-[11px] transition-colors"
                        >
                          Lihat Hasil →
                        </button>
                      ) : (
                        <span className="text-slate-600 text-[11px]">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
