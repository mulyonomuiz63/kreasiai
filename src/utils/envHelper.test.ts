import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { parseEnvString, buildEnvString, applyParsedEnvToSettings } from './envHelper.ts';
import type { AppSetting } from '../types/index.ts';

const MOCK_SETTINGS: AppSetting = {
  appName: 'KREASI AI STUDIO',
  allowPublicSignup: true,
  defaultFreeCredits: 50,
  creditPriceRupiah: 150,
  supportEmail: 'support@kreasi.id',
  supportWhatsApp: '+6281234567890',
  maintenanceMode: false,
  midtransEnvironment: 'sandbox',
  midtransMerchantId: 'G129384812',
  midtransClientKey: 'SB-Mid-client-W2p-9Lz4N9k',
  midtransServerKey: 'SB-Mid-server-8Km-vQ2r7P',
  geminiApiKey: '',
  appUrl: 'http://localhost:3000',
  customEnvVars: [],
};

describe('envHelper utilities', () => {
  test('parseEnvString accurately parses lines, trims whitespace, and removes quotes', () => {
    const raw = `
# Comment line
MIDTRANS_SERVER_KEY="SB-Mid-server-test123"
MIDTRANS_CLIENT_KEY='SB-Mid-client-test456'
MIDTRANS_ENVIRONMENT=sandbox
GEMINI_API_KEY=AIzaSy_fake_test_key

CUSTOM_API_KEY="custom_value_xyz"
`;
    const parsed = parseEnvString(raw);
    assert.strictEqual(parsed.length, 5);
    assert.strictEqual(parsed[0].key, 'MIDTRANS_SERVER_KEY');
    assert.strictEqual(parsed[0].value, 'SB-Mid-server-test123');
    assert.strictEqual(parsed[1].key, 'MIDTRANS_CLIENT_KEY');
    assert.strictEqual(parsed[1].value, 'SB-Mid-client-test456');
    assert.strictEqual(parsed[2].key, 'MIDTRANS_ENVIRONMENT');
    assert.strictEqual(parsed[2].value, 'sandbox');
    assert.strictEqual(parsed[3].key, 'GEMINI_API_KEY');
    assert.strictEqual(parsed[3].value, 'AIzaSy_fake_test_key');
    assert.strictEqual(parsed[4].key, 'CUSTOM_API_KEY');
    assert.strictEqual(parsed[4].value, 'custom_value_xyz');
  });

  test('buildEnvString generates valid .env format from AppSetting', () => {
    const envString = buildEnvString(MOCK_SETTINGS);
    assert.ok(envString.includes('MIDTRANS_SERVER_KEY="SB-Mid-server-8Km-vQ2r7P"'));
    assert.ok(envString.includes('MIDTRANS_CLIENT_KEY="SB-Mid-client-W2p-9Lz4N9k"'));
    assert.ok(envString.includes('APP_NAME="KREASI AI STUDIO"'));
  });

  test('applyParsedEnvToSettings updates core settings and custom variables dynamically', () => {
    const parsed = [
      { key: 'MIDTRANS_MERCHANT_ID', value: 'G999999999' },
      { key: 'GEMINI_API_KEY', value: 'AIzaSy_NewKey_789' },
      { key: 'NEW_INTEGRATION_KEY', value: 'val_123' },
    ];
    const { updatedSettings, importedCount } = applyParsedEnvToSettings(parsed, MOCK_SETTINGS);
    assert.strictEqual(importedCount, 3);
    assert.strictEqual(updatedSettings.midtransMerchantId, 'G999999999');
    assert.strictEqual(updatedSettings.geminiApiKey, 'AIzaSy_NewKey_789');

    const customVar = updatedSettings.customEnvVars.find((c) => c.key === 'NEW_INTEGRATION_KEY');
    assert.ok(customVar);
    assert.strictEqual(customVar.value, 'val_123');
  });
});
