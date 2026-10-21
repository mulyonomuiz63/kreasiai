import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRupiah,
  calculateDiscount,
  calculateEquivalentPerMonth,
  checkPlanAccess,
} from './pricing.ts';

test('formatRupiah formats Indonesian Rupiah without decimals', () => {
  const result = formatRupiah(198000);
  assert.ok(result.includes('198.000'), `Expected formatted string with 198.000, got: ${result}`);
});

test('calculateDiscount calculates correct discount percentage', () => {
  // Starter: compare 225.000 vs actual 198.000 -> 12%
  const starterDiscount = calculateDiscount(225000, 198000);
  assert.equal(starterDiscount, 12);

  // Pro: compare 597.000 vs actual 380.000 -> 36%
  const proDiscount = calculateDiscount(597000, 380000);
  assert.equal(proDiscount, 36);

  // Ultra: compare 1.047.000 vs actual 838.000 -> 20%
  const ultraDiscount = calculateDiscount(1047000, 838000);
  assert.equal(ultraDiscount, 20);
});

test('calculateEquivalentPerMonth divides 3 months evenly', () => {
  assert.equal(calculateEquivalentPerMonth(198000), 66000);
  assert.equal(calculateEquivalentPerMonth(380000), 126667);
  assert.equal(calculateEquivalentPerMonth(838000), 279333);
});

test('checkPlanAccess respects hierarchical tier permissions', () => {
  assert.equal(checkPlanAccess('ultra', 'pro'), true);
  assert.equal(checkPlanAccess('pro', 'starter'), true);
  assert.equal(checkPlanAccess('starter', 'pro'), false);
  assert.equal(checkPlanAccess('free', 'starter'), false);
  assert.equal(checkPlanAccess('pro', 'pro'), true);
});
