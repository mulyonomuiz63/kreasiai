import type { AppSetting, CustomEnvVariable } from '../types/index.ts';

export interface ParsedEnvVar {
  key: string;
  value: string;
}

/**
 * Parses a standard .env formatted string into key-value pairs
 */
export function parseEnvString(text: string): ParsedEnvVar[] {
  const lines = text.split('\n');
  const result: ParsedEnvVar[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    // Skip empty lines or comment lines
    if (!line || line.startsWith('#')) continue;

    const eqIndex = line.indexOf('=');
    if (eqIndex === -1) continue;

    const rawKey = line.slice(0, eqIndex).trim();
    let rawVal = line.slice(eqIndex + 1).trim();

    // Remove surrounding double or single quotes if present
    if (
      (rawVal.startsWith('"') && rawVal.endsWith('"')) ||
      (rawVal.startsWith("'") && rawVal.endsWith("'"))
    ) {
      rawVal = rawVal.slice(1, -1);
    }

    if (rawKey) {
      result.push({ key: rawKey, value: rawVal });
    }
  }

  return result;
}

/**
 * Serializes the current dynamic system settings into a valid, production-ready .env string
 */
export function buildEnvString(settings: AppSetting): string {
  const lines: string[] = [
    '# =========================================================',
    '# KREASI AI STUDIO - PRODUCTION ENVIRONMENT CONFIGURATION',
    '# Generated dynamically from Admin Settings Panel',
    `# Exported at: ${new Date().toISOString()}`,
    '# =========================================================',
    '',
    '# --- CORE APPLICATION ---',
    `APP_NAME="${settings.appName || 'KREASI AI STUDIO'}"`,
    `APP_URL="${settings.appUrl || 'http://localhost:3000'}"`,
    `CUSTOM_DOMAIN="${settings.customDomain || ''}"`,
    `ALLOW_PUBLIC_SIGNUP="${settings.allowPublicSignup ? 'true' : 'false'}"`,
    `DEFAULT_FREE_CREDITS="${settings.defaultFreeCredits || 50}"`,
    `CREDIT_PRICE_RUPIAH="${settings.creditPriceRupiah || 150}"`,
    `MAINTENANCE_MODE="${settings.maintenanceMode ? 'true' : 'false'}"`,
    '',
    '# --- MIDTRANS PAYMENT GATEWAY ---',
    `MIDTRANS_ENVIRONMENT="${settings.midtransEnvironment || 'sandbox'}"`,
    `MIDTRANS_IS_PRODUCTION="${settings.midtransEnvironment === 'production' ? 'true' : 'false'}"`,
    `MIDTRANS_MERCHANT_ID="${settings.midtransMerchantId || ''}"`,
    `MIDTRANS_CLIENT_KEY="${settings.midtransClientKey || ''}"`,
    `MIDTRANS_SERVER_KEY="${settings.midtransServerKey || ''}"`,
    `MIDTRANS_WEBHOOK_URL="${settings.webhookUrl || ''}"`,
    '',
    '# --- AI INTELLIGENCE & PROVIDER KEYS ---',
    `GEMINI_API_KEY="${settings.geminiApiKey || ''}"`,
    `OPENAI_API_KEY="${settings.openaiApiKey || ''}"`,
    `RUNWAY_API_KEY="${settings.runwayApiKey || ''}"`,
    `KLING_API_KEY="${settings.klingApiKey || ''}"`,
    `FLUX_API_KEY="${settings.fluxApiKey || ''}"`,
    '',
    '# --- CLOUD OBJECT STORAGE (S3 COMPATIBLE) ---',
    `S3_ENDPOINT="${settings.s3Endpoint || ''}"`,
    `S3_BUCKET="${settings.s3Bucket || ''}"`,
    `S3_ACCESS_KEY="${settings.s3AccessKey || ''}"`,
    `S3_SECRET_KEY="${settings.s3SecretKey || ''}"`,
    '',
    '# --- SUPPORT & CONTACT ---',
    `SUPPORT_EMAIL="${settings.supportEmail || 'support@kreasi.id'}"`,
    `SUPPORT_WHATSAPP="${settings.supportWhatsApp || '+6281234567890'}"`,
    `TELEGRAM_SUPPORT="${settings.telegramSupport || ''}"`,
    '',
    '# --- DYNAMIC CUSTOM VARIABLES ---',
  ];

  if (settings.customEnvVars && settings.customEnvVars.length > 0) {
    for (const v of settings.customEnvVars) {
      if (v.description) {
        lines.push(`# ${v.description}`);
      }
      lines.push(`${v.key}="${v.value}"`);
    }
  } else {
    lines.push('# (Belum ada variabel kustom tambahan)');
  }

  return lines.join('\n');
}

/**
 * Applies parsed environment variables back into partial AppSetting and custom variables
 */
export function applyParsedEnvToSettings(
  parsed: ParsedEnvVar[],
  currentSettings: AppSetting
): { updatedSettings: AppSetting; importedCount: number } {
  const updated: AppSetting = {
    ...currentSettings,
    customEnvVars: [...(currentSettings.customEnvVars || [])],
  };

  let count = 0;

  for (const { key, value } of parsed) {
    count++;
    switch (key.toUpperCase()) {
      case 'APP_NAME':
        updated.appName = value;
        break;
      case 'APP_URL':
        updated.appUrl = value;
        break;
      case 'CUSTOM_DOMAIN':
        updated.customDomain = value;
        break;
      case 'ALLOW_PUBLIC_SIGNUP':
        updated.allowPublicSignup = value.toLowerCase() === 'true';
        break;
      case 'DEFAULT_FREE_CREDITS':
        updated.defaultFreeCredits = Number(value) || updated.defaultFreeCredits;
        break;
      case 'CREDIT_PRICE_RUPIAH':
        updated.creditPriceRupiah = Number(value) || updated.creditPriceRupiah;
        break;
      case 'MAINTENANCE_MODE':
        updated.maintenanceMode = value.toLowerCase() === 'true';
        break;
      case 'MIDTRANS_ENVIRONMENT':
        updated.midtransEnvironment = value.toLowerCase() === 'production' ? 'production' : 'sandbox';
        break;
      case 'MIDTRANS_MERCHANT_ID':
        updated.midtransMerchantId = value;
        break;
      case 'MIDTRANS_CLIENT_KEY':
        updated.midtransClientKey = value;
        break;
      case 'MIDTRANS_SERVER_KEY':
        updated.midtransServerKey = value;
        break;
      case 'MIDTRANS_WEBHOOK_URL':
        updated.webhookUrl = value;
        break;
      case 'GEMINI_API_KEY':
        updated.geminiApiKey = value;
        break;
      case 'OPENAI_API_KEY':
        updated.openaiApiKey = value;
        break;
      case 'RUNWAY_API_KEY':
        updated.runwayApiKey = value;
        break;
      case 'KLING_API_KEY':
        updated.klingApiKey = value;
        break;
      case 'FLUX_API_KEY':
        updated.fluxApiKey = value;
        break;
      case 'S3_ENDPOINT':
        updated.s3Endpoint = value;
        break;
      case 'S3_BUCKET':
        updated.s3Bucket = value;
        break;
      case 'S3_ACCESS_KEY':
        updated.s3AccessKey = value;
        break;
      case 'S3_SECRET_KEY':
        updated.s3SecretKey = value;
        break;
      case 'SUPPORT_EMAIL':
        updated.supportEmail = value;
        break;
      case 'SUPPORT_WHATSAPP':
        updated.supportWhatsApp = value;
        break;
      case 'TELEGRAM_SUPPORT':
        updated.telegramSupport = value;
        break;
      default: {
        // Add or update in customEnvVars
        const existingIdx = updated.customEnvVars.findIndex((c) => c.key === key);
        if (existingIdx >= 0) {
          updated.customEnvVars[existingIdx] = {
            ...updated.customEnvVars[existingIdx],
            value,
          };
        } else {
          updated.customEnvVars.push({
            key,
            value,
            description: 'Diimpor otomatis dari input environment variable',
            isSecret: key.includes('SECRET') || key.includes('KEY') || key.includes('TOKEN') || key.includes('PASSWORD'),
          });
        }
        break;
      }
    }
  }

  return { updatedSettings: updated, importedCount: count };
}
