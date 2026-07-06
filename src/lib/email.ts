import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const RESEND_FROM = process.env.RESEND_FROM || 'One Piece Store <onboarding@resend.dev>';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function getSMTPTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 8000,
  });
}

function buildOTPHTML(otp: string) {
  return `
    <div style="font-family: 'Courier New', monospace; background: #0a0f1c; padding: 40px; text-align: center;">
      <div style="background: #1a1f2e; border: 1px solid #F4C430; border-radius: 16px; padding: 32px; max-width: 400px; margin: 0 auto;">
        <h1 style="color: #F4C430; font-size: 28px; margin: 0 0 8px;">ONE PIECE</h1>
        <p style="color: #888; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">Email Verification</p>
        <div style="margin: 32px 0; padding: 20px; background: #0a0f1c; border-radius: 12px; border: 1px dashed #F4C430;">
          <p style="color: #aaa; font-size: 12px; margin: 0 0 8px;">Your verification code</p>
          <p style="color: #F4C430; font-size: 42px; letter-spacing: 12px; font-weight: bold; margin: 0;">${otp}</p>
        </div>
        <p style="color: #666; font-size: 12px;">This code expires in 5 minutes.</p>
        <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;" />
        <p style="color: #555; font-size: 11px;">If you didn't request this, ignore this email.</p>
      </div>
    </div>`;
}

function buildResetHTML(resetUrl: string) {
  return `
    <div style="font-family: 'Courier New', monospace; background: #0a0f1c; padding: 40px; text-align: center;">
      <div style="background: #1a1f2e; border: 1px solid #F4C430; border-radius: 16px; padding: 32px; max-width: 400px; margin: 0 auto;">
        <h1 style="color: #F4C430; font-size: 28px; margin: 0 0 8px;">ONE PIECE</h1>
        <p style="color: #888; font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">Password Reset</p>
        <p style="color: #ccc; font-size: 14px; margin: 24px 0;">Click below to reset your password. This link expires in 15 minutes.</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: #F4C430; color: #000; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">RESET PASSWORD</a>
        <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;" />
        <p style="color: #555; font-size: 11px;">If you didn't request this, ignore this email.</p>
      </div>
    </div>`;
}

export async function sendOTPEmail(email: string, otp: string) {
  const smtp = getSMTPTransporter();
  if (smtp) {
    try {
      await Promise.race([
        smtp.sendMail({
          from: `"One Piece Store" <${process.env.SMTP_USER}>`,
          to: email,
          subject: 'Your OTP for Email Verification',
          html: buildOTPHTML(otp),
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('SMTP timeout')), 8000)),
      ]);
      console.log(`[EMAIL] OTP sent to ${email} via SMTP`);
      return { sent: true, provider: 'smtp' as const };
    } catch (err) {
      console.error('[EMAIL] SMTP failed:', err);
    }
  }
  const resend = getResend();
  if (resend) {
    try {
      const result = await resend.emails.send({
        from: RESEND_FROM,
        to: email,
        subject: 'Your OTP for Email Verification',
        html: buildOTPHTML(otp),
      });
      if (result.error) {
        console.error('[EMAIL] Resend error:', result.error);
      } else {
        return { sent: true, provider: 'resend' as const };
      }
    } catch (err) {
      console.error('[EMAIL] Resend failed:', err);
    }
  }
  return { sent: false, devOtp: otp };
}

export async function sendResetEmail(email: string, resetToken: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
  const smtp = getSMTPTransporter();
  if (smtp) {
    try {
      await smtp.sendMail({
        from: `"One Piece Store" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Reset Your Password',
        html: buildResetHTML(resetUrl),
      });
      console.log(`[EMAIL] Reset email sent to ${email} via SMTP`);
      return { sent: true, provider: 'smtp' as const };
    } catch (err) {
      console.error('[EMAIL] SMTP failed:', err);
    }
  }
  const resend = getResend();
  if (resend) {
    try {
      const result = await resend.emails.send({
        from: RESEND_FROM,
        to: email,
        subject: 'Reset Your Password',
        html: buildResetHTML(resetUrl),
      });
      if (result.error) {
        console.error('[EMAIL] Resend error:', result.error);
      } else {
        return { sent: true, provider: 'resend' as const };
      }
    } catch (err) {
      console.error('[EMAIL] Resend failed:', err);
    }
  }
  console.log(`[DEV] No email provider configured. Reset token for ${email}: ${resetToken}`);
  return { sent: false, devToken: resetToken };
}
