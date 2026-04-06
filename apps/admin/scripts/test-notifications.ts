#!/usr/bin/env tsx
/**
 * Test script to verify email and Telegram notifications are working
 * 
 * Usage:
 *   npx tsx scripts/test-notifications.ts
 * 
 * Or with a custom message:
 *   npx tsx scripts/test-notifications.ts "Your custom test message"
 */

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'contact@forhemit.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'stefano.stokes@forhemit.com';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; error?: string; id?: string }> {
  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: payload.from || FROM_EMAIL,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        reply_to: payload.replyTo,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Resend API error:', data);
      return { success: false, error: data.message || 'Failed to send email' };
    }

    console.log('✅ Email sent successfully! ID:', data.id);
    return { success: true, id: data.id };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error sending email'
    };
  }
}

async function sendTelegramMessage(text: string): Promise<{ success: boolean; error?: string; id?: string }> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('❌ TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not configured');
    return { success: false, error: 'Telegram service not configured' };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error('❌ Telegram API error:', data);
      return { success: false, error: data.description || 'Failed to send Telegram message' };
    }

    console.log('✅ Telegram message sent successfully! ID:', data.result?.message_id);
    return { success: true, id: String(data.result?.message_id ?? '') };
  } catch (error) {
    console.error('❌ Error sending Telegram message:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error sending Telegram message',
    };
  }
}

async function main() {
  const testMessage = process.argv[2] || '🧪 This is a test notification from Forhemit website';
  const timestamp = new Date().toLocaleString();

  console.log('='.repeat(60));
  console.log('🧪 Testing Email & Telegram Notifications');
  console.log('='.repeat(60));
  console.log(`\nTest message: ${testMessage}`);
  console.log(`Timestamp: ${timestamp}\n`);

  // Check configuration
  console.log('📋 Configuration Check:');
  console.log(`  RESEND_API_KEY: ${RESEND_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`  FROM_EMAIL: ${FROM_EMAIL}`);
  console.log(`  ADMIN_EMAIL: ${ADMIN_EMAIL}`);
  console.log(`  TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ Missing'}`);
  console.log(`  TELEGRAM_CHAT_ID: ${TELEGRAM_CHAT_ID || '❌ Missing'}`);
  console.log();

  // Test Email
  console.log('📧 Sending test email...');
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #F0562E;">🧪 Test Notification</h2>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Message:</strong> ${testMessage}</p>
        <p><strong>Timestamp:</strong> ${timestamp}</p>
      </div>
      <p style="color: #666; font-size: 12px;">
        This is a test email from your Forhemit notification system.
        If you're seeing this, email notifications are working correctly! ✅
      </p>
    </div>
  `;

  const emailResult = await sendEmail({
    to: ADMIN_EMAIL,
    subject: '🧪 Test Notification from Forhemit',
    html: emailHtml,
    text: `Test Notification\n\nMessage: ${testMessage}\nTimestamp: ${timestamp}\n\nThis is a test email from your Forhemit notification system. If you're seeing this, email notifications are working correctly!`,
  });

  console.log();

  // Test Telegram
  console.log('📱 Sending test Telegram message...');
  const telegramText = [
    '🧪 <b>Test Notification</b>',
    '',
    `<b>Message:</b> ${testMessage}`,
    `<b>Timestamp:</b> ${timestamp}`,
    '',
    '✅ If you see this, Telegram notifications are working!',
  ].join('\n');

  const telegramResult = await sendTelegramMessage(telegramText);

  console.log();
  console.log('='.repeat(60));
  console.log('📊 Results Summary');
  console.log('='.repeat(60));
  console.log(`Email:      ${emailResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  if (emailResult.error) console.log(`            Error: ${emailResult.error}`);
  console.log(`Telegram:   ${telegramResult.success ? '✅ SUCCESS' : '❌ FAILED'}`);
  if (telegramResult.error) console.log(`            Error: ${telegramResult.error}`);
  console.log('='.repeat(60));

  if (!emailResult.success || !telegramResult.success) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
