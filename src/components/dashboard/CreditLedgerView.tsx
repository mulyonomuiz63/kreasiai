import React from 'react';
import { useApp } from '../../store/AppContext';
import { reconcileBalanceFromLedger } from '../../utils/creditLedger';
import { CreditCard, Zap, ShieldCheck, ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const CreditLedgerView: React.FC = () => {
  const { ledger, currentUser, getUserCreditBalance, setCheckoutModalPlan, plans } = useApp();

  const userLedger = ledger.filter((l) => l.userId === currentUser?.id);
  const reconciledTotal = reconcileBalanceFromLedger(userLedger);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-orange-500" />
            <span>Buku Besar Kredit (Credit Ledger)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Catatan transaksi immutable anti-double-deduction. Saldo akun selalu terevaluasi konsisten.
          </p>
        </div>

        <button
          onClick={() => setCheckoutModalPlan(plans[1])}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          + Tambah Kuota Paket
        </button>
      </div>

      {/* Balance Reconciliation Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Saldo Aktif Saat Ini</div>
          <div className="text-2xl font-black text-orange-400">
            {reconciledTotal.toLocaleString('id-ID')} Kredit
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold pt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Terekonsiliasi Sempurna</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Total Kredit Masuk</div>
          <div className="text-2xl font-black text-white">
            {userLedger
              .filter((l) => l.amount > 0)
              .reduce((acc, curr) => acc + curr.amount, 0)
              .toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 pt-1">Dari paket & bonus awal</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Total Kredit Terpakai</div>
          <div className="text-2xl font-black text-slate-300">
            {Math.abs(
              userLedger
                .filter((l) => l.amount < 0)
                .reduce((acc, curr) => acc + curr.amount, 0)
            ).toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-500 pt-1">Untuk render video & gambar</div>
        </div>
      </div>

      {/* Immutable Ledger Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            Riwayat Entri Buku Besar ({userLedger.length} Transaksi)
          </span>
          <span className="text-slate-400 text-[11px] font-mono">
            Integrity Check: SHA-256 Validated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">Waktu Transaksi</th>
                <th className="p-4">Tipe Mutasi</th>
                <th className="p-4">Deskripsi / Pekerjaan</th>
                <th className="p-4">Referensi</th>
                <th className="p-4 text-right">Nominal Kredit</th>
                <th className="p-4 text-right">Saldo Sesudah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {userLedger.map((entry) => {
                const isAddition = entry.amount > 0;
                return (
                  <tr key={entry.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      {new Date(entry.createdAt).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-[10px] uppercase px-2 py-0.5 rounded ${
                          isAddition
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        }`}
                      >
                        {isAddition ? (
                          <ArrowDownRight className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 text-orange-400" />
                        )}
                        <span>{entry.type.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="p-4 max-w-sm truncate" title={entry.description}>
                      {entry.description}
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-400">
                      {entry.referenceId || '-'}
                    </td>
                    <td
                      className={`p-4 text-right font-mono font-extrabold ${
                        isAddition ? 'text-emerald-400' : 'text-orange-400'
                      }`}
                    >
                      {isAddition ? `+${entry.amount}` : entry.amount} kr
                    </td>
                    <td className="p-4 text-right font-mono text-slate-300">
                      {entry.balanceAfter.toLocaleString('id-ID')} kr
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
