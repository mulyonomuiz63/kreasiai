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
  amount: number; // positive for additions, negative for deductions
  balanceAfter: number;
  referenceId?: string; // e.g. orderId, jobId
  description: string;
  createdAt: string;
}

export function validateCreditDeduction(
  currentBalance: number,
  costCredits: number
): { allowed: boolean; remaining: number; error?: string } {
  if (costCredits < 0) {
    return { allowed: false, remaining: currentBalance, error: 'Biaya kredit tidak boleh negatif' };
  }
  if (currentBalance < costCredits) {
    return {
      allowed: false,
      remaining: currentBalance,
      error: `Saldo kredit tidak mencukupi (Tersedia: ${currentBalance}, Dibutuhkan: ${costCredits})`,
    };
  }
  return { allowed: true, remaining: currentBalance - costCredits };
}

export function reconcileBalanceFromLedger(entries: CreditLedgerRecord[]): number {
  return entries.reduce((acc, entry) => acc + entry.amount, 0);
}

export function isOrderAlreadyCredited(
  entries: CreditLedgerRecord[],
  orderId: string
): boolean {
  return entries.some(
    (entry) =>
      entry.type === 'SUBSCRIPTION_GRANT' && entry.referenceId === orderId
  );
}
