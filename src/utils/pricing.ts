export interface PricingCalculation {
  equivalentPerMonth: number;
  quarterlyTotal: number;
  compareQuarterlyPrice: number;
  discountPercent: number;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount).replace(/\s+/g, '');
}

export function calculateDiscount(comparePrice: number, actualPrice: number): number {
  if (comparePrice <= 0 || actualPrice >= comparePrice) return 0;
  return Math.round(((comparePrice - actualPrice) / comparePrice) * 100);
}

export function calculateEquivalentPerMonth(quarterlyPrice: number): number {
  return Math.round(quarterlyPrice / 3);
}

export function checkPlanAccess(
  userPlanLevel: 'free' | 'starter' | 'pro' | 'ultra',
  requiredPlanLevel: 'free' | 'starter' | 'pro' | 'ultra'
): boolean {
  const planHierarchy: Record<'free' | 'starter' | 'pro' | 'ultra', number> = {
    free: 0,
    starter: 1,
    pro: 2,
    ultra: 3,
  };
  return planHierarchy[userPlanLevel] >= planHierarchy[requiredPlanLevel];
}
