import { v } from "convex/values";
import { action } from "./_generated/server";
import { sendEmail, sendTelegramMessage, emailLayout, BRAND, ctaButton, codeBlock } from "./emailCore";

/**
 * Send email verification link
 */
export const sendVerifyEmail = action({
  args: {
    to: v.string(),
    token: v.string(),
    firstName: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://admin.forhemit.com"}/verify?token=${args.token}`;
    const greeting = args.firstName ? `Hi ${args.firstName},` : "Hello,";

    const html = emailLayout({
      title: "Verify Your Email",
      preheader: "Confirm your email address to get started with Forhemit",
      transactional: true,
      content: `
        <p style="color: ${BRAND.textBody}; font-size: 15px; line-height: 1.6;">
          ${greeting}
        </p>
        <p style="color: ${BRAND.textBody}; font-size: 15px; line-height: 1.6;">
          Thanks for signing up with Forhemit. Please verify your email address to activate your account.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          ${ctaButton("Verify Email Address", verifyUrl)}
        </div>
        <p style="color: ${BRAND.textGray}; font-size: 13px; line-height: 1.5;">
          This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
        </p>
      `,
    });

    const text = `${greeting}\n\nThanks for signing up with Forhemit. Please verify your email address:\n\n${verifyUrl}\n\nThis link expires in 24 hours. If you didn't create an account, ignore this email.`;

    const emailResult = await sendEmail({
      to: args.to,
      subject: "Verify your email — Forhemit",
      html,
      text,
    });

    const telegramResult = await sendTelegramMessage(
      `📧 Verification email sent to ${args.to}`
    );

    return {
      success: emailResult.success,
      email: emailResult,
      telegram: telegramResult,
    };
  },
});

/**
 * Send magic link login email
 */
export const sendMagicLink = action({
  args: {
    to: v.string(),
    token: v.string(),
    firstName: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://admin.forhemit.com"}/auth/magic-link?token=${args.token}`;
    const greeting = args.firstName ? `Hi ${args.firstName},` : "Hello,";

    const html = emailLayout({
      title: "Your Login Link",
      preheader: "Sign in to your Forhemit account with one click",
      transactional: true,
      content: `
        <p style="color: ${BRAND.textBody}; font-size: 15px; line-height: 1.6;">
          ${greeting}
        </p>
        <p style="color: ${BRAND.textBody}; font-size: 15px; line-height: 1.6;">
          Click the button below to sign in to your Forhemit account. No password needed.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          ${ctaButton("Sign In to Forhemit", loginUrl)}
        </div>
        <p style="color: ${BRAND.textGray}; font-size: 13px; line-height: 1.5;">
          This link expires in 15 minutes and can only be used once. If you didn't request this, you can safely ignore this email.
        </p>
      `,
    });

    const text = `${greeting}\n\nClick the link below to sign in to your Forhemit account:\n\n${loginUrl}\n\nThis link expires in 15 minutes and can only be used once. If you didn't request this, ignore this email.`;

    const emailResult = await sendEmail({
      to: args.to,
      subject: "Your login link — Forhemit",
      html,
      text,
    });

    const telegramResult = await sendTelegramMessage(
      `📧 Magic link sent to ${args.to}`
    );

    return {
      success: emailResult.success,
      email: emailResult,
      telegram: telegramResult,
    };
  },
});

/**
 * Send two-factor authentication code
 */
export const sendTwoFactorCode = action({
  args: {
    to: v.string(),
    code: v.string(),
    firstName: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const greeting = args.firstName ? `Hi ${args.firstName},` : "Hello,";

    const html = emailLayout({
      title: "Your Verification Code",
      preheader: "Use this code to complete your sign-in",
      transactional: true,
      content: `
        <p style="color: ${BRAND.textBody}; font-size: 15px; line-height: 1.6;">
          ${greeting}
        </p>
        <p style="color: ${BRAND.textBody}; font-size: 15px; line-height: 1.6;">
          Enter this code to complete your sign-in:
        </p>
        ${codeBlock(args.code)}
        <p style="color: ${BRAND.textGray}; font-size: 13px; line-height: 1.5; text-align: center;">
          This code expires in 5 minutes. Never share it with anyone.
        </p>
      `,
    });

    const text = `${greeting}\n\nYour Forhemit verification code is:\n\n${args.code}\n\nThis code expires in 5 minutes. Never share it with anyone.`;

    const emailResult = await sendEmail({
      to: args.to,
      subject: `Your verification code: ${args.code} — Forhemit`,
      html,
      text,
    });

    const telegramResult = await sendTelegramMessage(
      `📧 2FA code sent to ${args.to}`
    );

    return {
      success: emailResult.success,
      email: emailResult,
      telegram: telegramResult,
    };
  },
});
