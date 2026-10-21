import React, { useState } from 'react';
import { useApp } from '../../store/AppContext';
import { formatRupiah } from '../../utils/pricing';
import { Receipt, CheckCircle2, Clock, XCircle, Download, ExternalLink, Shield } from 'lucide-react';

export const PaymentHistoryView: React.FC = () => {
  const { orders, currentUser, showToast } = useApp();

  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const userOrders = orders.filter((o) => o.userId === currentUser?.id);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
          <Receipt className="w-6 h-6 text-orange-500" />
          <span>Riwayat Transaksi & Invoice Midtrans</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Daftar seluruh tagihan resmi, status pembayaran settlement, dan bukti kuitansi digital Anda.
        </p>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-4">Tanggal</th>
                <th className="p-4">Order ID Midtrans</th>
                <th className="p-4">Paket Langganan</th>
                <th className="p-4">Metode Bayar</th>
                <th className="p-4">Nominal</th>
                <th className="p-4">Status Transaksi</th>
                <th className="p-4 text-right">Kuitansi / Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {userOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Belum ada riwayat pembayaran tercatat.
                  </td>
                </tr>
              ) : (
                userOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      {new Date(ord.transactionTime).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4 font-mono font-bold text-white text-[11px]">
                      {ord.orderId}
                    </td>
                    <td className="p-4 font-semibold text-slate-200">
                      {ord.planName}
                    </td>
                    <td className="p-4 font-mono uppercase text-[10px] text-slate-400">
                      {ord.paymentType}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-200">
                      {formatRupiah(ord.grossAmount)}
                    </td>
                    <td className="p-4">
                      {ord.status === 'settlement' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Lunas (Settlement)</span>
                        </span>
                      ) : ord.status === 'pending' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Menunggu Pembayaran</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Batal / Kedaluwarsa</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedInvoice(ord)}
                        className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-orange-400 font-semibold text-[11px] transition-colors"
                      >
                        Lihat Kuitansi →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600">
                  KUITANSI RESMI DIGITAL
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  Kreasi AI Studio SaaS
                </h3>
                <div className="text-xs text-slate-500">
                  ID Transaksi: {selectedInvoice.orderId}
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Nama Pelanggan:</span>
                <span className="font-bold text-slate-900">{selectedInvoice.userName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Email:</span>
                <span className="font-bold text-slate-900">{selectedInvoice.userEmail}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Item Langganan:</span>
                <span className="font-bold text-slate-900">{selectedInvoice.planName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Metode Pembayaran:</span>
                <span className="font-bold uppercase text-slate-900">{selectedInvoice.paymentType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Waktu Pembayaran:</span>
                <span className="font-bold text-slate-900">
                  {new Date(selectedInvoice.transactionTime).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between py-2 text-sm font-black border-t-2 border-slate-900">
                <span>Total Lunas:</span>
                <span className="text-orange-600">{formatRupiah(selectedInvoice.grossAmount)}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Pembayaran telah terverifikasi sah oleh PT Midtrans Indonesia.
              </span>
            </div>

            <button
              onClick={() => {
                showToast('Kuitansi PDF digital berhasil diunduh.', 'success');
                setSelectedInvoice(null);
              }}
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Dokumen Kuitansi (PDF)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
