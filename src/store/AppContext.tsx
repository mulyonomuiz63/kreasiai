import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  SubscriptionPlan,
  AIModel,
  GeneratedAsset,
  GenerationJob,
  CreditLedgerRecord,
  PaymentOrder,
  AIAgent,
  AgentExecution,
  Conversation,
  ChatMessage,
  AuditLog,
  AppSetting,
  CustomEnvVariable,
  PaymentMethodType,
} from '../types';
import {
  parseEnvString,
  buildEnvString,
  applyParsedEnvToSettings,
} from '../utils/envHelper';
import {
  INITIAL_PLANS,
  INITIAL_MODELS,
  INITIAL_USERS,
  SAMPLE_ASSETS,
  INITIAL_LEDGER,
  INITIAL_ORDERS,
  INITIAL_AGENTS,
  INITIAL_SETTINGS,
} from '../data/seedData';
import {
  validateCreditDeduction,
  reconcileBalanceFromLedger,
  isOrderAlreadyCredited,
} from '../utils/creditLedger';
import { calculateSubscriptionExpiry } from '../utils/midtrans';

export type ActiveNav =
  | 'landing'
  | 'beranda'
  | 'chat'
  | 'video'
  | 'image'
  | 'agent'
  | 'galeri'
  | 'riwayat'
  | 'kredit'
  | 'paket'
  | 'transaksi'
  | 'pengaturan'
  | 'bantuan'
  | 'admin';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  plans: SubscriptionPlan[];
  models: AIModel[];
  assets: GeneratedAsset[];
  jobs: GenerationJob[];
  ledger: CreditLedgerRecord[];
  orders: PaymentOrder[];
  agents: AIAgent[];
  agentExecutions: AgentExecution[];
  conversations: Conversation[];
  activeConversationId: string | null;
  auditLogs: AuditLog[];
  settings: AppSetting;
  activeNav: ActiveNav;
  setActiveNav: (nav: ActiveNav) => void;
  checkoutModalPlan: SubscriptionPlan | null;
  setCheckoutModalPlan: (plan: SubscriptionPlan | null) => void;
  midtransSnapActiveOrder: PaymentOrder | null;
  setMidtransSnapActiveOrder: (order: PaymentOrder | null) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  envModalOpen: boolean;
  setEnvModalOpen: (open: boolean) => void;
  envBannerDismissed: boolean;
  setEnvBannerDismissed: (dismissed: boolean) => void;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;

  // Actions
  login: (email: string) => boolean;
  loginWithGoogle: () => void;
  switchUser: (userId: string) => void;
  logout: () => void;
  register: (name: string, email: string) => boolean;
  createMidtransOrder: (planId: 'starter' | 'pro' | 'ultra', paymentType: PaymentMethodType) => PaymentOrder;
  settleMidtransOrder: (orderId: string) => boolean;
  cancelMidtransOrder: (orderId: string) => void;
  getUserCreditBalance: (userId?: string) => number;
  startVideoGeneration: (params: {
    modelId: string;
    prompt: string;
    negativePrompt?: string;
    inputImageUrl?: string;
    durationSec: number;
    aspectRatio: string;
    resolution: string;
  }) => { success: boolean; error?: string };
  startImageGeneration: (params: {
    modelId: string;
    prompt: string;
    negativePrompt?: string;
    aspectRatio: string;
    resolution: string;
  }) => { success: boolean; error?: string };
  sendMessage: (text: string) => Promise<void>;
  createNewChat: () => void;
  setActiveConversationId: (id: string) => void;
  deleteConversation: (id: string) => void;
  runAgent: (agentId: string, topic: string) => Promise<void>;
  updatePlan: (id: string, updates: Partial<SubscriptionPlan>) => void;
  updateModel: (id: string, updates: Partial<AIModel>) => void;
  updateUserBlockStatus: (userId: string, isBlocked: boolean) => void;
  updateSettings: (updates: Partial<AppSetting>) => void;
  addCustomEnvVar: (item: CustomEnvVariable) => void;
  updateCustomEnvVar: (index: number, item: CustomEnvVariable) => void;
  deleteCustomEnvVar: (index: number) => void;
  importFromEnvString: (envText: string) => { importedCount: number };
  exportToEnvString: () => string;
  toggleFavoriteAsset: (assetId: string) => void;
  deleteAsset: (assetId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistent States
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('kreasi_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem('kreasi_current_user_id');
    return saved || 'usr_pro_01'; // Default to Budi (Pro user) for smooth rich initial demo
  });

  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => {
    const saved = localStorage.getItem('kreasi_plans');
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [models, setModels] = useState<AIModel[]>(() => {
    const saved = localStorage.getItem('kreasi_models');
    return saved ? JSON.parse(saved) : INITIAL_MODELS;
  });

  const [assets, setAssets] = useState<GeneratedAsset[]>(() => {
    const saved = localStorage.getItem('kreasi_assets');
    return saved ? JSON.parse(saved) : SAMPLE_ASSETS;
  });

  const [jobs, setJobs] = useState<GenerationJob[]>([]);

  const [ledger, setLedger] = useState<CreditLedgerRecord[]>(() => {
    const saved = localStorage.getItem('kreasi_ledger');
    return saved ? JSON.parse(saved) : INITIAL_LEDGER;
  });

  const [orders, setOrders] = useState<PaymentOrder[]>(() => {
    const saved = localStorage.getItem('kreasi_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [agents] = useState<AIAgent[]>(INITIAL_AGENTS);

  const [agentExecutions, setAgentExecutions] = useState<AgentExecution[]>([]);

  const [settings, setSettings] = useState<AppSetting>(() => {
    const saved = localStorage.getItem('kreasi_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv_default_01',
      userId: 'usr_pro_01',
      title: 'Ide Video Promo Kopi',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: 'msg_01',
          conversationId: 'conv_default_01',
          role: 'user',
          content: 'Halo, tolong buatkan prompt sinematik untuk video promosi kedai kopi pagi hari yang estetik.',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'msg_02',
          conversationId: 'conv_default_01',
          role: 'assistant',
          content: 'Berikut adalah prompt sinematik siap pakai yang dioptimalkan untuk Runway Gen-2 atau Kling AI:\n\n**Prompt:**\n`Cinematic slow-motion close up shot of hot espresso pouring into steamed oat milk, delicate latte art forming with microfoam textures, golden sunrise sunbeams piercing through cafe window, dust motes floating, photorealistic 8k, bokeh background`\n\n**Tips Parameter:**\n- Rasio: 16:9 untuk YouTube / TV atau 9:16 untuk Reels / TikTok.\n- Durasi: 8–10 detik untuk transisi yang elegan.',
          createdAt: new Date(Date.now() - 3500000).toISOString(),
          suggestedPrompt: {
            type: 'video',
            prompt: 'Cinematic slow-motion close up shot of hot espresso pouring into steamed oat milk, delicate latte art forming with microfoam textures, golden sunrise sunbeams piercing through cafe window, bokeh background',
          },
        },
      ],
    },
  ]);

  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv_default_01');

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log_01',
      action: 'SYSTEM_BOOTSTRAP',
      actorId: 'usr_admin_00',
      actorName: 'Admin Utama',
      actorRole: 'admin',
      targetType: 'plan',
      targetId: 'all',
      details: 'Sistem SaaS Kreasi AI Studio berhasil diinisialisasi',
      timestamp: new Date().toISOString(),
    },
  ]);

  // UI state
  const [activeNav, setActiveNav] = useState<ActiveNav>('landing');
  const [checkoutModalPlan, setCheckoutModalPlan] = useState<SubscriptionPlan | null>(null);
  const [midtransSnapActiveOrder, setMidtransSnapActiveOrder] = useState<PaymentOrder | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('kreasi_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('kreasi_current_user_id', currentUserId);
  }, [currentUserId]);
  useEffect(() => {
    localStorage.setItem('kreasi_plans', JSON.stringify(plans));
  }, [plans]);
  useEffect(() => {
    localStorage.setItem('kreasi_models', JSON.stringify(models));
  }, [models]);
  useEffect(() => {
    localStorage.setItem('kreasi_assets', JSON.stringify(assets));
  }, [assets]);
  useEffect(() => {
    localStorage.setItem('kreasi_ledger', JSON.stringify(ledger));
  }, [ledger]);
  useEffect(() => {
    localStorage.setItem('kreasi_orders', JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem('kreasi_settings', JSON.stringify(settings));
  }, [settings]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  const getUserCreditBalance = (userId?: string): number => {
    const targetId = userId || currentUser?.id;
    if (!targetId) return 0;
    const userLedger = ledger.filter((l) => l.userId === targetId);
    return reconcileBalanceFromLedger(userLedger);
  };

  // Auth actions
  const login = (email: string): boolean => {
    let cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'admin') cleanEmail = 'admin@kreasi.id';

    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (existing.isBlocked) {
        showToast('Akun ini telah dinonaktifkan oleh administrator.', 'error');
        return false;
      }
      setCurrentUserId(existing.id);
      if (existing.role === 'admin') {
        showToast(`Selamat datang Administrator Utama (${existing.name})!`, 'success');
      } else {
        showToast(`Selamat datang kembali, ${existing.name}!`, 'success');
      }
      return true;
    }
    showToast('Email tidak ditemukan. Coba: admin@kreasi.id (Admin) atau budi@kreasi.id.', 'error');
    return false;
  };

  const loginWithGoogle = () => {
    // Authenticate with user's Google account
    const email = 'mulyonomuiz63@gmail.com';
    let user = users.find((u) => u.email === email);
    if (!user) {
      user = {
        id: `usr_admin_owner`,
        name: 'Mulyono Muiz (Owner)',
        email,
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        role: 'admin',
        currentPlanId: 'ultra',
        subscriptionStatus: 'active',
        subscriptionExpiresAt: '2027-12-31T23:59:59Z',
        createdAt: new Date().toISOString(),
        isBlocked: false,
      };
      setUsers((prev) => [...prev, user!]);
    }
    setCurrentUserId(user.id);
    showToast(`Berhasil masuk sebagai Administrator (Owner): ${user.name}`, 'success');
    setAuthModalOpen(false);
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUserId(target.id);
      showToast(`Beralih profil sebagai: ${target.name} (${target.role.toUpperCase()})`, 'info');
    }
  };

  const logout = () => {
    setCurrentUserId('');
    localStorage.removeItem('kreasi_current_user_id');
    showToast('Anda telah berhasil keluar (logout).', 'info');
    setActiveNav('landing');
  };

  const register = (name: string, email: string): boolean => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      showToast('Email ini sudah terdaftar. Silakan login.', 'error');
      return false;
    }
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      role: 'user',
      currentPlanId: null,
      subscriptionStatus: 'none',
      subscriptionExpiresAt: null,
      createdAt: new Date().toISOString(),
      isBlocked: false,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);

    // Initial free credits
    const welcomeEntry: CreditLedgerRecord = {
      id: `led_${Date.now()}`,
      userId: newUser.id,
      type: 'INITIAL_SIGNUP',
      amount: settings.defaultFreeCredits,
      balanceAfter: settings.defaultFreeCredits,
      description: `Bonus pendaftaran awal (+${settings.defaultFreeCredits} Kredit)`,
      createdAt: new Date().toISOString(),
    };
    setLedger((prev) => [...prev, welcomeEntry]);

    showToast(`Registrasi sukses! Selamat bergabung, ${name}.`, 'success');
    return true;
  };

  // Midtrans Payment Workflow
  const createMidtransOrder = (
    planId: 'starter' | 'pro' | 'ultra',
    paymentType: PaymentMethodType
  ): PaymentOrder => {
    const plan = plans.find((p) => p.id === planId) || plans[0];
    const user = currentUser || users[0];
    const timestamp = Date.now();
    const orderId = `KREASI-${planId.toUpperCase()}-${timestamp.toString().slice(-6)}`;
    const snapToken = `SNAP-${timestamp}-${Math.random().toString(36).substring(2, 9)}`;

    let vaNumber: string | undefined;
    if (paymentType.includes('va')) {
      vaNumber = `89088${Math.floor(10000000 + Math.random() * 90000000)}`;
    }

    const newOrder: PaymentOrder = {
      id: `ord_${timestamp}`,
      orderId,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      planId,
      planName: `Paket ${plan.name} (3 Bulan)`,
      grossAmount: plan.quarterlyPrice,
      paymentType,
      status: 'pending',
      snapToken,
      transactionTime: new Date().toISOString(),
      vaNumber,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setMidtransSnapActiveOrder(newOrder);
    return newOrder;
  };

  const settleMidtransOrder = (orderId: string): boolean => {
    const order = orders.find((o) => o.orderId === orderId);
    if (!order) {
      showToast('Pesanan tidak ditemukan.', 'error');
      return false;
    }

    if (order.status === 'settlement') {
      showToast('Transaksi ini sudah dinyatakan lunas sebelumnya.', 'info');
      return true;
    }

    const plan = plans.find((p) => p.id === order.planId);
    if (!plan) return false;

    // Check idempotency: ensure order not credited twice
    if (isOrderAlreadyCredited(ledger, orderId)) {
      showToast('Idempotency check: Kredit pesanan ini sudah pernah diberikan.', 'info');
      return true;
    }

    const settledAt = new Date().toISOString();
    const expiryDate = calculateSubscriptionExpiry(new Date());

    // 1. Update Order Status
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: 'settlement', settledAt } : o))
    );

    // 2. Update User Subscription Tier and Expiry
    setUsers((prev) =>
      prev.map((u) =>
        u.id === order.userId
          ? {
              ...u,
              currentPlanId: order.planId,
              subscriptionStatus: 'active',
              subscriptionExpiresAt: expiryDate.toISOString(),
            }
          : u
      )
    );

    // 3. Atomically grant plan quota to Credit Ledger
    const currentBalance = getUserCreditBalance(order.userId);
    const newBalance = currentBalance + plan.creditQuota;

    const grantRecord: CreditLedgerRecord = {
      id: `led_${Date.now()}`,
      userId: order.userId,
      type: 'SUBSCRIPTION_GRANT',
      amount: plan.creditQuota,
      balanceAfter: newBalance,
      referenceId: orderId,
      description: `Pembayaran ${order.planName} via Midtrans (${order.paymentType.toUpperCase()}) - Kuota +${plan.creditQuota} Kredit`,
      createdAt: settledAt,
    };
    setLedger((prev) => [grantRecord, ...prev]);

    // 4. Audit Log
    const auditRecord: AuditLog = {
      id: `aud_${Date.now()}`,
      action: 'MIDTRANS_PAYMENT_SETTLED',
      actorId: order.userId,
      actorName: order.userName,
      actorRole: 'user',
      targetType: 'payment',
      targetId: orderId,
      details: `Midtrans webhook terverifikasi sah. Order ${orderId} lunas: Rp ${order.grossAmount.toLocaleString('id-ID')}. Paket ${plan.name} aktif sampai ${expiryDate.toLocaleDateString('id-ID')}.`,
      timestamp: settledAt,
    };
    setAuditLogs((prev) => [auditRecord, ...prev]);

    showToast(
      `Pembayaran Berhasil! Paket ${plan.name} aktif & +${plan.creditQuota} kredit telah ditambahkan ke akun Anda.`,
      'success'
    );
    return true;
  };

  const cancelMidtransOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: 'cancel' } : o))
    );
    showToast('Transaksi dibatalkan.', 'info');
  };

  // Video Generation Workflow
  const startVideoGeneration = (params: {
    modelId: string;
    prompt: string;
    negativePrompt?: string;
    inputImageUrl?: string;
    durationSec: number;
    aspectRatio: string;
    resolution: string;
  }): { success: boolean; error?: string } => {
    if (!currentUser) {
      showToast('Silakan login terlebih dahulu untuk membuat video.', 'error');
      setAuthModalOpen(true);
      return { success: false, error: 'Belum login' };
    }

    const model = models.find((m) => m.id === params.modelId);
    if (!model) return { success: false, error: 'Model tidak valid' };

    // Cost calculation (base cost + duration multiplier)
    const durationMultiplier = params.durationSec > 10 ? 1.4 : params.durationSec > 5 ? 1.2 : 1.0;
    const totalCost = Math.round(model.creditCost * durationMultiplier);

    const currentBalance = getUserCreditBalance();
    const balanceCheck = validateCreditDeduction(currentBalance, totalCost);
    if (!balanceCheck.allowed) {
      showToast(balanceCheck.error || 'Saldo kredit tidak mencukupi.', 'error');
      return { success: false, error: balanceCheck.error };
    }

    const jobId = `job_vid_${Date.now()}`;

    // 1. Deduct credits atomically into ledger
    const deductionRecord: CreditLedgerRecord = {
      id: `led_${Date.now()}`,
      userId: currentUser.id,
      type: 'VIDEO_GENERATION',
      amount: -totalCost,
      balanceAfter: balanceCheck.remaining,
      referenceId: jobId,
      description: `Generasi video: "${params.prompt.slice(0, 35)}..." (${model.name}, ${params.durationSec}s)`,
      createdAt: new Date().toISOString(),
    };
    setLedger((prev) => [deductionRecord, ...prev]);

    // 2. Create Job
    const newJob: GenerationJob = {
      id: jobId,
      userId: currentUser.id,
      type: 'video',
      modelId: model.id,
      modelName: model.name,
      prompt: params.prompt,
      negativePrompt: params.negativePrompt,
      inputImageUrl: params.inputImageUrl,
      aspectRatio: params.aspectRatio,
      resolution: params.resolution,
      durationSec: params.durationSec,
      status: 'processing',
      progressPercent: 15,
      stageText: 'Mengantre di GPU Cluster provider...',
      costCredits: totalCost,
      createdAt: new Date().toISOString(),
    };
    setJobs((prev) => [newJob, ...prev]);

    showToast(`Job video dimulai (-${totalCost} kredit). Memproses di antrean...`, 'info');

    // Simulate Job Worker progression
    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? { ...j, progressPercent: 45, stageText: 'Merender frame difusi temporal...' }
            : j
        )
      );
    }, 2000);

    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? { ...j, progressPercent: 80, stageText: 'Encoding audio & upscale H.264 MP4...' }
            : j
        )
      );
    }, 4500);

    setTimeout(() => {
      // Pick suitable royalty-free sample video based on prompt or ratio
      const videoPool = [
        'https://assets.mixkit.co/videos/preview/mixkit-coffee-cup-being-filled-with-milk-41481-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-waves-crashing-on-a-rocky-island-41440-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-neon-lights-in-a-futuristic-tunnel-41727-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-green-screen-41566-large.mp4',
      ];
      const thumbPool = [
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80',
      ];
      const chosenVideo = videoPool[Math.floor(Math.random() * videoPool.length)];
      const chosenThumb = thumbPool[Math.floor(Math.random() * thumbPool.length)];

      const completedAt = new Date().toISOString();

      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                status: 'completed',
                progressPercent: 100,
                stageText: 'Selesai!',
                resultUrl: chosenVideo,
                thumbnailUrl: chosenThumb,
                completedAt,
              }
            : j
        )
      );

      // Save asset to user gallery
      const newAsset: GeneratedAsset = {
        id: `ast_vid_${Date.now()}`,
        userId: currentUser.id,
        jobId,
        type: 'video',
        title: params.prompt.slice(0, 40) + '...',
        prompt: params.prompt,
        modelName: model.name,
        aspectRatio: params.aspectRatio,
        resolution: params.resolution,
        durationSec: params.durationSec,
        mediaUrl: chosenVideo,
        thumbnailUrl: chosenThumb,
        createdAt: completedAt,
        favorite: false,
      };
      setAssets((prev) => [newAsset, ...prev]);

      showToast('Video Anda berhasil dibuat dan telah tersimpan di Galeri!', 'success');
    }, 7000);

    return { success: true };
  };

  // Image Generation Workflow
  const startImageGeneration = (params: {
    modelId: string;
    prompt: string;
    negativePrompt?: string;
    aspectRatio: string;
    resolution: string;
  }): { success: boolean; error?: string } => {
    if (!currentUser) {
      showToast('Silakan login terlebih dahulu untuk membuat gambar.', 'error');
      setAuthModalOpen(true);
      return { success: false, error: 'Belum login' };
    }

    const model = models.find((m) => m.id === params.modelId);
    if (!model) return { success: false, error: 'Model tidak valid' };

    const totalCost = model.creditCost;
    const currentBalance = getUserCreditBalance();
    const balanceCheck = validateCreditDeduction(currentBalance, totalCost);
    if (!balanceCheck.allowed) {
      showToast(balanceCheck.error || 'Saldo kredit tidak mencukupi.', 'error');
      return { success: false, error: balanceCheck.error };
    }

    const jobId = `job_img_${Date.now()}`;

    // 1. Deduct credits
    const deductionRecord: CreditLedgerRecord = {
      id: `led_${Date.now()}`,
      userId: currentUser.id,
      type: 'IMAGE_GENERATION',
      amount: -totalCost,
      balanceAfter: balanceCheck.remaining,
      referenceId: jobId,
      description: `Generasi gambar: "${params.prompt.slice(0, 35)}..." (${model.name})`,
      createdAt: new Date().toISOString(),
    };
    setLedger((prev) => [deductionRecord, ...prev]);

    // 2. Create Job
    const newJob: GenerationJob = {
      id: jobId,
      userId: currentUser.id,
      type: 'image',
      modelId: model.id,
      modelName: model.name,
      prompt: params.prompt,
      negativePrompt: params.negativePrompt,
      aspectRatio: params.aspectRatio,
      resolution: params.resolution,
      status: 'processing',
      progressPercent: 30,
      stageText: 'Menganalisis prompt & sampler diffusion...',
      costCredits: totalCost,
      createdAt: new Date().toISOString(),
    };
    setJobs((prev) => [newJob, ...prev]);

    showToast(`Generasi gambar dimulai (-${totalCost} kredit)...`, 'info');

    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? { ...j, progressPercent: 75, stageText: 'Super-resolution & color grading...' }
            : j
        )
      );
    }, 1800);

    setTimeout(() => {
      // High quality visual photo
      const imagePool = [
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1200&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1549490349-8643362247b5?w=1200&auto=format&fit=crop&q=80',
      ];
      const chosenImg = imagePool[Math.floor(Math.random() * imagePool.length)];
      const completedAt = new Date().toISOString();

      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                status: 'completed',
                progressPercent: 100,
                stageText: 'Selesai!',
                resultUrl: chosenImg,
                thumbnailUrl: chosenImg,
                completedAt,
              }
            : j
        )
      );

      const newAsset: GeneratedAsset = {
        id: `ast_img_${Date.now()}`,
        userId: currentUser.id,
        jobId,
        type: 'image',
        title: params.prompt.slice(0, 40) + '...',
        prompt: params.prompt,
        modelName: model.name,
        aspectRatio: params.aspectRatio,
        resolution: params.resolution,
        mediaUrl: chosenImg,
        thumbnailUrl: chosenImg,
        createdAt: completedAt,
        favorite: false,
      };
      setAssets((prev) => [newAsset, ...prev]);

      showToast('Gambar AI Anda telah selesai dibuat dan disimpan!', 'success');
    }, 3800);

    return { success: true };
  };

  // AI Chat Assistant
  const sendMessage = async (text: string) => {
    if (!text.trim() || !currentUser) return;

    const currentBalance = getUserCreditBalance();
    if (currentBalance < 1) {
      showToast('Saldo kredit habis (minimal butuh 1 kredit untuk chat).', 'error');
      return;
    }

    let convId = activeConversationId;
    if (!convId) {
      convId = `conv_${Date.now()}`;
      const newConv: Conversation = {
        id: convId,
        userId: currentUser.id,
        title: text.slice(0, 28) + (text.length > 28 ? '...' : ''),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(convId);
    }

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      conversationId: convId,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              updatedAt: new Date().toISOString(),
              messages: [...c.messages, userMsg],
            }
          : c
      )
    );

    // Deduct 1 credit for chat
    const deduction: CreditLedgerRecord = {
      id: `led_${Date.now()}`,
      userId: currentUser.id,
      type: 'CHAT_USAGE',
      amount: -1,
      balanceAfter: currentBalance - 1,
      description: `AI Chat Assistant: "${text.slice(0, 30)}..."`,
      createdAt: new Date().toISOString(),
    };
    setLedger((prev) => [deduction, ...prev]);

    // Generate intelligent AI response (with prompt extraction for video/image generation button)
    setTimeout(() => {
      let replyContent = '';
      let suggestedPrompt: { type: 'video' | 'image'; prompt: string } | undefined;

      const lower = text.toLowerCase();
      if (lower.includes('video') || lower.includes('klip') || lower.includes('scene')) {
        replyContent = `Tentu! Saya telah merancang formula prompt sinematik khusus untuk model video (seperti Runway Gen-2 atau Kling AI):\n\n**Visual Prompt:**\n\`Cinematic 4k shot of ${text}, highly detailed textures, dramatic lighting, subtle camera dolly in, 60fps photoreal\`\n\n**Rekomendasi Pengaturan:**\n- Rasio: 16:9 untuk video lanskap atau 9:16 untuk media sosial vertical.\n- Durasi: 8 detik.\n- Model: Runway Gen-2 atau Sora Preview untuk konsistensi fisika terbaik.`;
        suggestedPrompt = {
          type: 'video',
          prompt: `Cinematic 4k shot of ${text}, dramatic lighting, subtle camera movement, photorealistic 8k`,
        };
      } else if (lower.includes('gambar') || lower.includes('foto') || lower.includes('image') || lower.includes('ilustrasi')) {
        replyContent = `Berikut rancangan prompt visual ultra-detail yang optimal untuk Flux.1 Pro atau Midjourney:\n\n**Master Prompt:**\n\`Award-winning photorealistic image of ${text}, intricate lighting, ray tracing reflections, cinematic depth of field, 8k resolution, Unreal Engine 5 render style\`\n\nAnda dapat langsung mengklik tombol **"Jadikan Prompt Gambar"** di bawah untuk merender visual ini di AI Image Generator!`;
        suggestedPrompt = {
          type: 'image',
          prompt: `Award-winning photorealistic image of ${text}, intricate volumetric lighting, ray tracing, 8k resolution, cinematic composition`,
        };
      } else {
        replyContent = `Halo! Saya asisten kreatif **Kreasi AI Studio**. Saya siap membantu Anda menyusun ide konten, skrip video TikTok/YouTube, memoles prompt difusi AI agar lebih realistis, atau membuat alur kerja visual terintegrasi.\n\nContoh yang bisa Anda tanyakan:\n1. *"Buatkan prompt video sinematik mobil melaju di jalanan basah malam hari"* \n2. *"Susun naskah iklan 15 detik produk kosmetik"* \n3. *"Perbaiki prompt gambar saya agar lebih fotorealistik"*`;
      }

      const botMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        conversationId: convId!,
        role: 'assistant',
        content: replyContent,
        createdAt: new Date().toISOString(),
        suggestedPrompt,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                updatedAt: new Date().toISOString(),
                messages: [...c.messages, botMsg],
              }
            : c
        )
      );
    }, 1200);
  };

  const createNewChat = () => {
    if (!currentUser) return;
    const newId = `conv_${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      userId: currentUser.id,
      title: 'Percakapan Baru',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newId);
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
    showToast('Percakapan telah dihapus.', 'info');
  };

  // AI Agent Execution Workflow
  const runAgent = async (agentId: string, topic: string) => {
    if (!currentUser) {
      showToast('Silakan login untuk menjalankan AI Agent.', 'error');
      setAuthModalOpen(true);
      return;
    }

    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;

    const currentBalance = getUserCreditBalance();
    const balanceCheck = validateCreditDeduction(currentBalance, agent.costPerRun);
    if (!balanceCheck.allowed) {
      showToast(balanceCheck.error || 'Saldo kredit tidak mencukupi untuk agent ini.', 'error');
      return;
    }

    // Deduct
    const deduction: CreditLedgerRecord = {
      id: `led_${Date.now()}`,
      userId: currentUser.id,
      type: 'CHAT_USAGE',
      amount: -agent.costPerRun,
      balanceAfter: balanceCheck.remaining,
      description: `Eksekusi AI Agent: ${agent.name} ("${topic.slice(0, 25)}...")`,
      createdAt: new Date().toISOString(),
    };
    setLedger((prev) => [deduction, ...prev]);

    const executionId = `exec_${Date.now()}`;
    const initialExecution: AgentExecution = {
      id: executionId,
      agentId: agent.id,
      agentName: agent.name,
      userId: currentUser.id,
      topic,
      status: 'running',
      steps: [
        { stepNumber: 1, title: 'Analisis Brief & Target Audiens', status: 'running' },
        { stepNumber: 2, title: 'Menyusun Ide & Struktur Kreatif', status: 'pending' },
        { stepNumber: 3, title: 'Generate Copy & Prompt Visual Khusus', status: 'pending' },
        { stepNumber: 4, title: 'Validasi & Penataan Output Siap Pakai', status: 'pending' },
      ],
      totalCreditsUsed: agent.costPerRun,
      createdAt: new Date().toISOString(),
    };

    setAgentExecutions((prev) => [initialExecution, ...prev]);
    showToast(`Agent "${agent.name}" mulai dijalankan...`, 'info');

    // Simulate Step 1
    setTimeout(() => {
      setAgentExecutions((prev) =>
        prev.map((e) =>
          e.id === executionId
            ? {
                ...e,
                steps: e.steps.map((s) =>
                  s.stepNumber === 1
                    ? { ...s, status: 'completed', outputSnippet: `Keyword target: ${topic}` }
                    : s.stepNumber === 2
                    ? { ...s, status: 'running' }
                    : s
                ),
              }
            : e
        )
      );
    }, 1500);

    // Simulate Step 2
    setTimeout(() => {
      setAgentExecutions((prev) =>
        prev.map((e) =>
          e.id === executionId
            ? {
                ...e,
                steps: e.steps.map((s) =>
                  s.stepNumber === 2
                    ? { ...s, status: 'completed', outputSnippet: '3 Angle Narasi telah disusun' }
                    : s.stepNumber === 3
                    ? { ...s, status: 'running' }
                    : s
                ),
              }
            : e
        )
      );
    }, 3000);

    // Simulate Step 3 & 4 (Complete)
    setTimeout(() => {
      const resultData = {
        title: `Hasil Eksekusi Agent: ${topic}`,
        angle: 'Emosional, Sinematik, dan Relevan dengan Audiens Urban',
        hook: [
          '“Jangan buat video biasa kalau bisa buat visual selevel Hollywood dalam 60 detik.”',
          '“Ini rahasia para brand besar di TikTok yang jarang diungkapkan...”',
          '“Stop buang waktu edit berjam-jam, coba trik ini.”',
        ],
        script: `[Scene 1 - 0s-3s]: Close up visual menakjubkan dari ${topic}.\n[Scene 2 - 4s-8s]: Transisi dinamis memperlihatkan proses instan dan hasil profesional.\n[Scene 3 - 9s-15s]: Call to Action kuat dengan penawaran eksklusif.`,
        suggestedVideoPrompt: `Cinematic hyperrealistic shot focused on ${topic}, studio dramatic light, 8k resolution, shot on Arri Alexa, master color grading`,
        suggestedImagePrompt: `Modern aesthetic commercial advertisement for ${topic}, elegant minimalist backdrop, sharp details, warm studio flash, photorealism 8k`,
      };

      setAgentExecutions((prev) =>
        prev.map((e) =>
          e.id === executionId
            ? {
                ...e,
                status: 'completed',
                steps: e.steps.map((s) => ({ ...s, status: 'completed' })),
                resultData,
              }
            : e
        )
      );
      showToast(`Agent "${agent.name}" telah menyelesaikan seluruh alur kerja!`, 'success');
    }, 5000);
  };

  // Admin and configuration updates
  const updatePlan = (id: string, updates: Partial<SubscriptionPlan>) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      action: 'UPDATE_SUBSCRIPTION_PLAN',
      actorId: currentUser?.id || 'admin',
      actorName: currentUser?.name || 'Administrator',
      actorRole: 'admin',
      targetType: 'plan',
      targetId: id,
      details: `Paket ${id} diperbarui: ${JSON.stringify(updates)}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [audit, ...prev]);
    showToast(`Paket ${id} berhasil diperbarui.`, 'success');
  };

  const updateModel = (id: string, updates: Partial<AIModel>) => {
    setModels((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      action: 'UPDATE_AI_MODEL',
      actorId: currentUser?.id || 'admin',
      actorName: currentUser?.name || 'Administrator',
      actorRole: 'admin',
      targetType: 'model',
      targetId: id,
      details: `Model ${id} diperbarui: ${JSON.stringify(updates)}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [audit, ...prev]);
    showToast(`Model ${id} berhasil diperbarui.`, 'success');
  };

  const updateUserBlockStatus = (userId: string, isBlocked: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBlocked } : u))
    );
    const audit: AuditLog = {
      id: `aud_${Date.now()}`,
      action: isBlocked ? 'BLOCK_USER' : 'UNBLOCK_USER',
      actorId: currentUser?.id || 'admin',
      actorName: currentUser?.name || 'Administrator',
      actorRole: 'admin',
      targetType: 'user',
      targetId: userId,
      details: `Status akun user ${userId} diubah menjadi: ${isBlocked ? 'DIBLOKIR' : 'AKTIF'}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [audit, ...prev]);
    showToast(`User berhasil ${isBlocked ? 'diblokir' : 'diaktifkan kembali'}.`, 'info');
  };

  const updateSettings = (updates: Partial<AppSetting>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    showToast('Pengaturan sistem berhasil disimpan.', 'success');
  };

  const toggleFavoriteAsset = (assetId: string) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === assetId ? { ...a, favorite: !a.favorite } : a))
    );
  };

  const deleteAsset = (assetId: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
    showToast('Aset telah dihapus dari galeri.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        plans,
        models,
        assets,
        jobs,
        ledger,
        orders,
        agents,
        agentExecutions,
        conversations,
        activeConversationId,
        auditLogs,
        settings,
        activeNav,
        setActiveNav,
        checkoutModalPlan,
        setCheckoutModalPlan,
        midtransSnapActiveOrder,
        setMidtransSnapActiveOrder,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        toastMessage,
        showToast,
        login,
        loginWithGoogle,
        switchUser,
        logout,
        register,
        createMidtransOrder,
        settleMidtransOrder,
        cancelMidtransOrder,
        getUserCreditBalance,
        startVideoGeneration,
        startImageGeneration,
        sendMessage,
        createNewChat,
        setActiveConversationId,
        deleteConversation,
        runAgent,
        updatePlan,
        updateModel,
        updateUserBlockStatus,
        updateSettings,
        toggleFavoriteAsset,
        deleteAsset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
