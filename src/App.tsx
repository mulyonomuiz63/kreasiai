import React from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { MidtransCheckoutModal } from './components/MidtransCheckoutModal';
import { AuthModal } from './components/AuthModal';
import { DashboardLayout } from './components/DashboardLayout';

import { OverviewView } from './components/dashboard/OverviewView';
import { VideoGeneratorView } from './components/dashboard/VideoGeneratorView';
import { ImageGeneratorView } from './components/dashboard/ImageGeneratorView';
import { ChatAssistantView } from './components/dashboard/ChatAssistantView';
import { AgentStudioView } from './components/dashboard/AgentStudioView';
import { GalleryView } from './components/dashboard/GalleryView';
import { GenerationHistoryView } from './components/dashboard/GenerationHistoryView';
import { CreditLedgerView } from './components/dashboard/CreditLedgerView';
import { SubscriptionView } from './components/dashboard/SubscriptionView';
import { PaymentHistoryView } from './components/dashboard/PaymentHistoryView';
import { AccountSettingsView } from './components/dashboard/AccountSettingsView';
import { HelpView } from './components/dashboard/HelpView';
import { AdminDashboardView } from './components/dashboard/AdminDashboardView';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeNav, toastMessage } = useApp();

  const renderDashboardView = () => {
    switch (activeNav) {
      case 'beranda':
        return <OverviewView />;
      case 'video':
        return <VideoGeneratorView />;
      case 'image':
        return <ImageGeneratorView />;
      case 'chat':
        return <ChatAssistantView />;
      case 'agent':
        return <AgentStudioView />;
      case 'galeri':
        return <GalleryView />;
      case 'riwayat':
        return <GenerationHistoryView />;
      case 'kredit':
        return <CreditLedgerView />;
      case 'paket':
        return <SubscriptionView />;
      case 'transaksi':
        return <PaymentHistoryView />;
      case 'pengaturan':
        return <AccountSettingsView />;
      case 'bantuan':
        return <HelpView />;
      case 'admin':
        return <AdminDashboardView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold border ${
              toastMessage.type === 'success'
                ? 'bg-slate-900 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10'
                : toastMessage.type === 'error'
                ? 'bg-slate-900 text-rose-400 border-rose-500/40 shadow-rose-500/10'
                : 'bg-slate-900 text-orange-400 border-orange-500/40 shadow-orange-500/10'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            ) : (
              <Info className="w-4 h-4 shrink-0 text-orange-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Main View Router */}
      {activeNav === 'landing' ? (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Hero />
            <Features />
            <HowItWorks />
            <PricingSection />
            <FAQSection />
          </main>
          <Footer />
        </div>
      ) : (
        <DashboardLayout>{renderDashboardView()}</DashboardLayout>
      )}

      {/* Global Interactive Modals */}
      <MidtransCheckoutModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
