import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { formatRupiah } from '../utils/pricing';
import { PaymentMethodType } from '../types';
import confetti from 'canvas-confetti';
import {
  X,
  Shield,
  CreditCard,
  QrCode,
  Smartphone,
  Building,
  CheckCircle2,
  Copy,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const MidtransCheckoutModal: React.FC = () => {
  const {
    checkoutModalPlan,
    setCheckoutModalPlan,
    midtransSnapActiveOrder,
    setMidtransSnapActiveOrder,
    createMidtransOrder,
    settleMidtransOrder,
    cancelMidtransOrder,
    currentUser,
    setActiveNav,
    showToast,
  } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType>('qris');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!checkoutModalPlan && !midtransSnapActiveOrder) return null;

  const plan =
    checkoutModalPlan ||
    (midtransSnapActiveOrder ? {
      id: midtransSnapActiveOrder.planId,
      name: midtransSnapActiveOrder.planName,
      quarterlyPrice: midtransSnapActiveOrder.grossAmount,
      creditQuota: 1500,
    } : null);

  const handleCreateOrder = () => {
    if (!checkoutModalPlan) return;
    setIsProcessing(true);
    setTimeout(() => {
      createMidtransOrder(checkoutModalPlan.id, selectedMethod);
      setIsProcessing(false);
      setCheckoutModalPlan(null); // Now snap modal displays
    }, 600);
  };

  const handleSimulateSettlement = () => {
    if (!midtransSnapActiveOrder) return;
    setIsProcessing(true);

    setTimeout(() => {
      const ok = settleMidtransOrder(midtransSnapActiveOrder.orderId);
      setIsProcessing(false);
      if (ok) {
        setPaymentSuccess(true);
        // Confetti burst
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f97316', '#fbbf24', '#10b981', '#3b82f6'],
        });
      }
    }, 800);
  };

  const handleSimulateCancel = () => {
    if (!midtransSnapActiveOrder) return;
    cancelMidtransOrder(midtransSnapActiveOrder.orderId);
    setMidtransSnapActiveOrder(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Nomor Virtual Account disalin ke clipboard!', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const closeModal = () => {
    setCheckoutModalPlan(null);
    setMidtransSnapActiveOrder(null);
    setPaymentSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 my-8">
        {/* Header with Midtrans Branding */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-bold text-white shadow-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-tight flex items-center gap-2">
                <span>MIDTRANS SNAP CHECKOUT</span>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                  SANDBOX TERVERIFIKASI
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                PT Midtrans Indonesia • Merchant ID: G129384812
              </div>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {paymentSuccess ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Pembayaran Berhasil Dikonfirmasi!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Status transaksi: <strong className="text-emerald-600">SETTLEMENT</strong>. Paket langganan Anda kini aktif selama 3 bulan dan kuota kredit telah masuk ke saldo akun Anda.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono font-bold text-slate-900">{midtransSnapActiveOrder?.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Paket:</span>
                  <span className="font-bold text-slate-900">{midtransSnapActiveOrder?.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Dibayar:</span>
                  <span className="font-bold text-emerald-700">
                    {formatRupiah(midtransSnapActiveOrder?.grossAmount || 0)}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    closeModal();
                    setActiveNav('beranda');
                  }}
                  className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-colors"
                >
                  Buka Dashboard Studio
                </button>
                <button
                  onClick={() => {
                    closeModal();
                    setActiveNav('video');
                  }}
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors"
                >
                  Mulai Buat Video Sekarang
                </button>
              </div>
            </div>
          ) : midtransSnapActiveOrder ? (
            /* Step 2: Active Midtrans Snap Payment Window */
            <div className="space-y-6">
              {/* Order summary bar */}
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs text-orange-700 font-medium">Tagihan Resmi (3 Bulan):</div>
                  <div className="text-xl font-black text-slate-900">
                    {formatRupiah(midtransSnapActiveOrder.grossAmount)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900 mb-1">
                    PENDING PAYMENT
                  </span>
                  <div className="text-[11px] font-mono text-slate-500">
                    {midtransSnapActiveOrder.orderId}
                  </div>
                </div>
              </div>

              {/* Payment Method Specific Display */}
              {midtransSnapActiveOrder.paymentType === 'qris' || midtransSnapActiveOrder.paymentType === 'gopay' ? (
                <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase">
                    <QrCode className="w-4 h-4 text-orange-600" />
                    <span>Scan QRIS dengan BCA Mobile, GoPay, OVO, Dana</span>
                  </div>

                  {/* Simulated Dynamic QR Code */}
                  <div className="w-48 h-48 mx-auto bg-white p-3 rounded-xl border border-slate-300 shadow-inner flex flex-col items-center justify-center relative">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                        `00020101021226600016ID.CO.MIDTRANS0118${midtransSnapActiveOrder.orderId}520458125303360540${midtransSnapActiveOrder.grossAmount}5802ID`
                      )}`}
                      alt="QRIS Midtrans Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Batas waktu bayar: 14 menit 59 detik</span>
                  </div>
                </div>
              ) : midtransSnapActiveOrder.paymentType.includes('va') ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="uppercase">
                      {midtransSnapActiveOrder.paymentType === 'bca_va'
                        ? 'BCA Virtual Account'
                        : midtransSnapActiveOrder.paymentType === 'mandiri_va'
                        ? 'Mandiri Bill Payment'
                        : 'Virtual Account Bank'}
                    </span>
                    <span className="text-orange-600">Verifikasi Otomatis</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-300 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400">Nomor Virtual Account:</div>
                      <div className="text-lg font-mono font-bold tracking-wider text-slate-900">
                        {midtransSnapActiveOrder.vaNumber || '890881239840192'}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(midtransSnapActiveOrder.vaNumber || '890881239840192')}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1 text-xs font-medium"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>

                  <div className="text-xs text-slate-500 leading-relaxed">
                    Petunjuk: Buka m-Banking atau ATM, pilih menu Transfer / Pembayaran VA, masukkan nomor di atas, dan konfirmasi nominal pembayaran.
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-700">Simulasi Kartu Kredit (3D Secure Sandbox)</div>
                  <div className="p-3 bg-white rounded-xl border border-slate-300 font-mono text-xs space-y-1">
                    <div>Test Card: 4811 1111 1111 1111</div>
                    <div>Expiry: 12/28 • CVV: 123</div>
                  </div>
                </div>
              )}

              {/* Developer / Simulator Webhook Triggers */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Simulator Webhook Midtrans Sandbox:</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-normal">
                  Di lingkungan sandbox AI Studio ini, Anda dapat langsung mengklik tombol di bawah untuk menyimulasikan notifikasi HTTP POST webhook Midtrans resmi dengan validasi SHA-512 signature.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleSimulateSettlement}
                    disabled={isProcessing}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    {isProcessing ? 'Memproses Webhook...' : 'Simulasikan Pembayaran Berhasil (Settlement)'}
                  </button>
                  <button
                    onClick={handleSimulateCancel}
                    className="py-3 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs transition-colors"
                  >
                    Batalkan Transaksi
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Step 1: Method Selection before creating order */
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Paket Dipilih:</div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {checkoutModalPlan?.name} (3 Bulan)
                  </div>
                  <div className="text-xs text-orange-600 font-semibold">
                    +{checkoutModalPlan?.creditQuota.toLocaleString('id-ID')} Kredit Internal
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Total Pembayaran:</div>
                  <div className="text-xl font-black text-slate-900">
                    {formatRupiah(checkoutModalPlan?.quarterlyPrice || 0)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Pilih Metode Pembayaran Midtrans:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('qris')}
                    className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      selectedMethod === 'qris'
                        ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">QRIS (Semua E-Wallet)</div>
                      <div className="text-[11px] text-slate-500">GoPay, OVO, Dana, BCA Mobile</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('bca_va')}
                    className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      selectedMethod === 'bca_va'
                        ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">BCA Virtual Account</div>
                      <div className="text-[11px] text-slate-500">Verifikasi instan otomatis 24/7</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('mandiri_va')}
                    className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      selectedMethod === 'mandiri_va'
                        ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Mandiri Bill Payment</div>
                      <div className="text-[11px] text-slate-500">Livin by Mandiri & ATM</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod('credit_card')}
                    className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      selectedMethod === 'credit_card'
                        ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Kartu Kredit / Debit</div>
                      <div className="text-[11px] text-slate-500">Visa, MasterCard, JCB 3DS</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* User info confirmation */}
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex items-center justify-between">
                <div>
                  Akun Pelanggan: <strong className="text-slate-800">{currentUser?.name}</strong> ({currentUser?.email})
                </div>
                <div className="text-orange-600 font-semibold">Tervalidasi</div>
              </div>

              {/* Continue button */}
              <button
                onClick={handleCreateOrder}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>{isProcessing ? 'Membuat Snap Token...' : 'Lanjutkan ke Pembayaran Snap'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
