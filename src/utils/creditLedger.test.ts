import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateCreditDeduction,
  reconcileBalanceFromLedger,
  isOrderAlreadyCredited,
  type CreditLedgerRecord,
} from './creditLedger.ts';

test('validateCreditDeduction prevents negative balances', () => {
  const result = validateCreditDeduction(100, 150);
  assert.equal(result.allowed, false);
  assert.equal(result.remaining, 100);
  assert.ok(result.error?.includes('Saldo kredit tidak mencukupi'));
});

test('validateCreditDeduction allows sufficient balances', () => {
  const result = validateCreditDeduction(100, 30);
  assert.equal(result.allowed, true);
  assert.equal(result.remaining, 70);
});

test('reconcileBalanceFromLedger computes exact sum from transactions', () => {
  const records: CreditLedgerRecord[] = [
    {
      id: 'tx-1',
      userId: 'u1',
      type: 'INITIAL_SIGNUP',
      amount: 50,
      balanceAfter: 50,
      description: 'Bonus pendaftaran',
      createdAt: '2026-10-20T00:00:00Z',
    },
    {
      id: 'tx-2',
      userId: 'u1',
      type: 'SUBSCRIPTION_GRANT',
      amount: 1500,
      balanceAfter: 1550,
      referenceId: 'ORD-1234',
      description: 'Paket Pro 3 Bulan',
      createdAt: '2026-10-20T01:00:00Z',
    },
    {
      id: 'tx-3',
      userId: 'u1',
      type: 'VIDEO_GENERATION',
      amount: -45,
      balanceAfter: 1505,
      referenceId: 'JOB-999',
      description: 'Generasi video Runway Gen-2',
      createdAt: '2026-10-20T02:00:00Z',
    },
    {
      id: 'tx-4',
      userId: 'u1',
      type: 'JOB_REFUND',
      amount: 45,
      balanceAfter: 1550,
      referenceId: 'JOB-999',
      description: 'Pengembalian kredit - Job gagal',
      createdAt: '2026-10-20T02:05:00Z',
    },
  ];

  const reconciled = reconcileBalanceFromLedger(records);
  assert.equal(reconciled, 1550);
});

test('isOrderAlreadyCredited prevents duplicate credit grant for same order', () => {
  const records: CreditLedgerRecord[] = [
    {
      id: 'tx-2',
      userId: 'u1',
      type: 'SUBSCRIPTION_GRANT',
      amount: 1500,
      balanceAfter: 1500,
      referenceId: 'ORD-1234',
      description: 'Paket Pro',
      createdAt: '2026-10-20T01:00:00Z',
    },
  ];

  assert.equal(isOrderAlreadyCredited(records, 'ORD-1234'), true);
  assert.equal(isOrderAlreadyCredited(records, 'ORD-9999'), false);
});
