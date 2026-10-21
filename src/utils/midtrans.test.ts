import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMidtransSignature,
  verifyMidtransNotification,
  resolvePaymentStatus,
  calculateSubscriptionExpiry,
  type MidtransNotificationPayload,
} from './midtrans.ts';

test('calculateMidtransSignature creates deterministic SHA512 hash', () => {
  const sig1 = calculateMidtransSignature('ORDER-001', '200', '198000.00', 'SB-Mid-server-test');
  const sig2 = calculateMidtransSignature('ORDER-001', '200', '198000.00', 'SB-Mid-server-test');
  assert.equal(sig1, sig2);
  assert.equal(sig1.length, 128); // SHA-512 hex is 128 characters
});

test('verifyMidtransNotification approves authentic payload and rejects forged signature', () => {
  const serverKey = 'SB-Mid-server-secret-key';
  const orderId = 'ORD-2026-STARTER-1';
  const statusCode = '200';
  const grossAmount = '198000.00';
  const correctSig = calculateMidtransSignature(orderId, statusCode, grossAmount, serverKey);

  const authenticPayload: MidtransNotificationPayload = {
    order_id: orderId,
    status_code: statusCode,
    gross_amount: grossAmount,
    signature_key: correctSig,
    transaction_status: 'settlement',
  };

  assert.equal(verifyMidtransNotification(authenticPayload, serverKey), true);

  const forgedPayload: MidtransNotificationPayload = {
    ...authenticPayload,
    signature_key: 'deadbeef1234567890abcdef',
  };

  assert.equal(verifyMidtransNotification(forgedPayload, serverKey), false);
});

test('resolvePaymentStatus handles all standard Midtrans transaction states', () => {
  assert.equal(resolvePaymentStatus('settlement'), 'settlement');
  assert.equal(resolvePaymentStatus('capture', 'accept'), 'settlement');
  assert.equal(resolvePaymentStatus('capture', 'challenge'), 'challenge');
  assert.equal(resolvePaymentStatus('pending'), 'pending');
  assert.equal(resolvePaymentStatus('deny'), 'deny');
  assert.equal(resolvePaymentStatus('expire'), 'expire');
  assert.equal(resolvePaymentStatus('cancel'), 'cancel');
});

test('calculateSubscriptionExpiry sets date 3 months into the future', () => {
  const baseDate = new Date('2026-01-15T00:00:00Z');
  const expiry = calculateSubscriptionExpiry(baseDate);
  assert.equal(expiry.getUTCMonth(), 3); // 0-indexed month: Jan (0) + 3 = April (3)
  assert.equal(expiry.getUTCDate(), 15);
});
