export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  currentPlanId: 'starter' | 'pro' | 'ultra' | null;
  subscriptionStatus: 'active' | 'expired' | 'none';
  subscriptionExpiresAt: string | null;
  createdAt: string;
  isBlocked: boolean;
}

export interface SubscriptionPlan {
  id: 'starter' | 'pro' | 'ultra';
  name: string;
  description: string;
  equivalentPerMonth: number; // e.g. 66000, 126667, 279333
  quarterlyPrice: number;     // e.g. 198000, 380000, 838000
  comparePrice: number;       // e.g. 225000, 597000, 1047000
  discountPercent: number;    // e.g. 12, 36, 20
  creditQuota: number;        // e.g. 500, 1500, 4000
  buttonLabel: string;
  badge?: string;             // e.g. "PALING WORTH" for Ultra
  maxVideoDurationSec: number;
  maxResolution: string;
  allowedModels: string[];
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'kling' | 'runway' | 'luma' | 'stability' | 'flux' | 'sora' | 'google';
  type: 'video' | 'image' | 'chat';
  minPlan: 'starter' | 'pro' | 'ultra';
  creditCost: number;
  supportedDurations?: number[];
  supportedAspectRatios: string[];
  supportedResolutions: string[];
  description: string;
  queuePriority: 'Standard' | 'Tinggi (Prioritas)' | 'Tertinggi (Ultra VIP)';
  isAvailable: boolean;
}

export type CreditTransactionType =
  | 'INITIAL_SIGNUP'
  | 'SUBSCRIPTION_GRANT'
  | 'VIDEO_GENERATION'
  | 'IMAGE_GENERATION'
  | 'CHAT_USAGE'
  | 'JOB_REFUND'
  | 'ADMIN_ADJUSTMENT';

export interface CreditLedgerRecord {
  id: string;
  userId: string;
  type: CreditTransactionType;
  amount: number;
  balanceAfter: number;
  referenceId?: string;
  description: string;
  createdAt: string;
}

export interface GenerationJob {
  id: string;
  userId: string;
  type: 'video' | 'image';
  modelId: string;
  modelName: string;
  prompt: string;
  negativePrompt?: string;
  inputImageUrl?: string;
  aspectRatio: string;
  resolution: string;
  durationSec?: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progressPercent: number;
  stageText: string;
  costCredits: number;
  resultUrl?: string;
  thumbnailUrl?: string;
  errorReason?: string;
  createdAt: string;
  completedAt?: string;
}

export interface GeneratedAsset {
  id: string;
  userId: string;
  jobId: string;
  type: 'video' | 'image';
  title: string;
  prompt: string;
  modelName: string;
  aspectRatio: string;
  resolution: string;
  durationSec?: number;
  mediaUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  favorite: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  suggestedPrompt?: {
    type: 'video' | 'image';
    prompt: string;
  };
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface AIAgent {
  id: string;
  type: 'content_creator' | 'marketing' | 'image_workflow' | 'video_workflow' | 'custom';
  name: string;
  badge: string;
  description: string;
  iconName: string;
  requiredPlan: 'starter' | 'pro' | 'ultra';
  costPerRun: number;
  defaultPrompt: string;
  outputFormat: string;
}

export interface AgentExecutionStep {
  stepNumber: number;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  outputSnippet?: string;
}

export interface AgentExecution {
  id: string;
  agentId: string;
  agentName: string;
  userId: string;
  topic: string;
  status: 'running' | 'completed' | 'failed';
  steps: AgentExecutionStep[];
  resultData?: any;
  totalCreditsUsed: number;
  createdAt: string;
}

export type PaymentMethodType =
  | 'qris'
  | 'gopay'
  | 'bca_va'
  | 'mandiri_va'
  | 'bni_va'
  | 'bri_va'
  | 'credit_card';

export interface PaymentOrder {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: 'starter' | 'pro' | 'ultra';
  planName: string;
  grossAmount: number;
  paymentType: PaymentMethodType;
  status: 'pending' | 'settlement' | 'deny' | 'expire' | 'cancel';
  snapToken: string;
  transactionTime: string;
  settledAt?: string;
  vaNumber?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  targetType: 'user' | 'plan' | 'model' | 'payment' | 'credit';
  targetId: string;
  details: string;
  timestamp: string;
}

export interface CustomEnvVariable {
  key: string;
  value: string;
  description?: string;
  isSecret?: boolean;
}

export interface AppSetting {
  appName: string;
  studioName?: string;
  tagline?: string;
  allowPublicSignup: boolean;
  defaultFreeCredits: number;
  creditPriceRupiah: number;
  supportEmail: string;
  supportWhatsApp: string;
  telegramSupport?: string;
  maintenanceMode: boolean;

  // Midtrans Environment
  midtransEnvironment: 'sandbox' | 'production';
  midtransMerchantId: string;
  midtransClientKey: string;
  midtransServerKey: string;
  webhookUrl?: string;

  // AI & External APIs
  geminiApiKey: string;
  openaiApiKey?: string;
  runwayApiKey?: string;
  klingApiKey?: string;
  fluxApiKey?: string;

  // Cloud & Hosting
  appUrl: string;
  customDomain?: string;
  s3Endpoint?: string;
  s3Bucket?: string;
  s3AccessKey?: string;
  s3SecretKey?: string;

  // Dynamic Custom Key-Value Environment Variables
  customEnvVars: CustomEnvVariable[];
}
