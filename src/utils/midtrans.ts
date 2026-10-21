import { sha512 } from './sha512.ts';

export type MidtransTransactionStatus =
  | 'pending'
  | 'settlement'
  | 'challenge'
  | 'deny'
  | 'expire'
  | 'cancel'
  | 'refund';

export interface MidtransNotificationPayload {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
  transaction_id?: string;
  transaction_time?: string;
  settlement_time?: string;
}

/**
 * Computes official Midtrans SHA512 signature:
 * SHA512(order_id + status_code + gross_amount + ServerKey)
 */
export function calculateMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string
): string {
  const payload = `${orderId}${statusCode}${grossAmount}${serverKey}`;
  return sha512(payload);
}

/**
 * Validates incoming webhook signature against merchant server key
 */
export function verifyMidtransNotification(
  notification: MidtransNotificationPayload,
  serverKey: string
): boolean {
  if (!notification || !notification.signature_key) return false;
  const expected = calculateMidtransSignature(
    notification.order_id,
    notification.status_code,
    notification.gross_amount,
    serverKey
  );
  return expected.toLowerCase() === notification.signature_key.toLowerCase();
}

/**
 * Maps raw Midtrans transaction status and fraud status to final state
 */
export function resolvePaymentStatus(
  transactionStatus: string,
  fraudStatus?: string
): MidtransTransactionStatus {
  if (transactionStatus === 'capture') {
    if (fraudStatus === 'challenge') {
      return 'challenge';
    } else if (fraudStatus === 'accept') {
      return 'settlement';
    }
  } else if (transactionStatus === 'settlement') {
    return 'settlement';
  } else if (transactionStatus === 'pending') {
    return 'pending';
  } else if (transactionStatus === 'deny') {
    return 'deny';
  } else if (transactionStatus === 'expire') {
    return 'expire';
  } else if (transactionStatus === 'cancel') {
    return 'cancel';
  } else if (transactionStatus === 'refund') {
    return 'refund';
  }
  return 'pending';
}

/**
 * Calculates subscription expiration date: exactly 3 months (90 days) from activation
 */
export function calculateSubscriptionExpiry(startDate: Date = new Date()): Date {
  const expiry = new Date(startDate);
  expiry.setMonth(expiry.getMonth() + 3);
  return expiry;
}
