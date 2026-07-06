import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'haki-drop-production-secret-change-in-env';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '30d';
const SALT_ROUNDS = 12;
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const MAX_RESEND_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const ADMIN_EMAILS = ['pookrish81@gmail.com', 'devadraprasadkumar@gmail.com'];

interface User {
  id: string;
  email: string;
  passwordHash?: string;
  name: string;
  role: string;
  avatar?: string;
  emailVerified: boolean;
  provider: 'email' | 'google' | 'apple';
  providerId?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface Session {
  id: string;
  userId: string;
  refreshToken: string;
  userAgent: string;
  device: string;
  browser: string;
  ip: string;
  createdAt: string;
  loginTime: string;
  lastSeen: string;
  expiresAt: string;
}

interface OTPRecord {
  email: string;
  otp: string;
  expiresAt: number;
  attempts: number;
  resendAttempts: number;
  verified: boolean;
}

interface PasswordResetToken {
  token: string;
  userId: string;
  email: string;
  expiresAt: number;
  used: boolean;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const resetTokens = new Map<string, PasswordResetToken>();
const rateLimitStore = new Map<string, RateLimitEntry>();

const camelToSnake = (obj: any): any => {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(camelToSnake);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`),
      v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date) ? camelToSnake(v) : v,
    ])
  );
};

const snakeToCamel = (obj: any): any => {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/_([a-z])/g, (_, l) => l.toUpperCase()),
      v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Date) ? snakeToCamel(v) : v,
    ])
  );
};

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

function sanitizeUser(user: User) {
  const { passwordHash, ...safe } = user;
  if (ADMIN_EMAILS.includes(safe.email.toLowerCase())) {
    safe.role = 'ADMIN';
  }
  return safe;
}

export async function findUserByEmail(email: string) {
  const { data } = await supabase.from('users').select('*').eq('email', email.toLowerCase()).maybeSingle();
  return data ? (snakeToCamel(data) as User) : null;
}

export async function findUserById(id: string) {
  const { data } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
  return data ? (snakeToCamel(data) as User) : null;
}

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX_ATTEMPTS) return false;
  entry.count++;
  return true;
}

export async function registerUser(email: string, password: string, name: string) {
  const existing = await findUserByEmail(email);
  if (existing) {
    return { error: 'Email already registered', status: 409 };
  }
  const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
  const user: User = {
    id: generateId('usr'),
    email,
    passwordHash,
    name,
    role: 'customer',
    emailVerified: false,
    provider: 'email',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const { error } = await supabase.from('users').insert(camelToSnake(user));
  if (error) return { error: error.message, status: 500 };
  return { user: sanitizeUser(user) };
}

export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return { error: 'Invalid email or password', status: 401 };
  if (!user.passwordHash) return { error: 'This account uses social login', status: 400 };
  if (!user.emailVerified) return { error: 'Please verify your email before logging in', status: 403 };
  if (!bcrypt.compareSync(password, user.passwordHash)) return { error: 'Invalid email or password', status: 401 };
  return { user: sanitizeUser(user) };
}

export async function authenticateWithProvider(provider: 'google' | 'apple', providerId: string, email: string, name: string, profileImage?: string) {
  const existing = await findUserByEmail(email);
  if (existing) {
    if (existing.provider !== provider && existing.provider !== 'email') {
      return { error: `Account already exists with ${existing.provider}`, status: 409 };
    }
    const updates: Partial<User> = { providerId, profileImage: profileImage || existing.profileImage, updatedAt: new Date().toISOString() };
    const { error } = await supabase.from('users').update(camelToSnake(updates)).eq('id', existing.id);
    if (error) return { error: error.message, status: 500 };
    return { user: sanitizeUser({ ...existing, ...updates }) };
  }
  const user: User = {
    id: generateId('usr'),
    email,
    name,
    role: ADMIN_EMAILS.includes(email.toLowerCase()) ? 'ADMIN' : 'CUSTOMER',
    emailVerified: true,
    provider,
    providerId,
    profileImage,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const { error } = await supabase.from('users').insert(camelToSnake(user));
  if (error) return { error: error.message, status: 500 };
  return { user: sanitizeUser(user) };
}

export async function generateOTP(email: string) {
  const { data: existing } = await supabase.from('otps').select('*').eq('email', email.toLowerCase()).maybeSingle();
  if (existing && existing.resend_attempts >= MAX_RESEND_ATTEMPTS) {
    return { error: 'Maximum OTP resend attempts reached. Try again later.', status: 429 };
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const record: OTPRecord = {
    email: email.toLowerCase(),
    otp,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
    resendAttempts: (existing?.resend_attempts || 0) + 1,
    verified: false,
  };
  const { error } = await supabase.from('otps').upsert(camelToSnake(record), { onConflict: 'email' });
  if (error) return { error: error.message, status: 500 };
  console.log(`[DEV] OTP for ${email}: ${otp}`);
  return { otp };
}

export async function verifyOTP(email: string, otp: string) {
  const { data: record } = await supabase.from('otps').select('*').eq('email', email.toLowerCase()).maybeSingle();
  if (!record) return { error: 'No OTP found. Request a new one.', status: 400 };
  if (record.verified) return { error: 'OTP already verified', status: 400 };
  if (Date.now() > record.expires_at) {
    await supabase.from('otps').delete().eq('email', email.toLowerCase());
    return { error: 'OTP expired. Request a new one.', status: 410 };
  }
  if (record.attempts >= MAX_OTP_ATTEMPTS) {
    await supabase.from('otps').delete().eq('email', email.toLowerCase());
    return { error: 'Maximum OTP attempts exceeded. Request a new one.', status: 429 };
  }
  const { error: attErr } = await supabase.from('otps').update({ attempts: record.attempts + 1 }).eq('email', email.toLowerCase());
  if (attErr) return { error: attErr.message, status: 500 };
  if (record.otp !== otp) return { error: 'Invalid OTP', status: 400 };
  const { error: verErr } = await supabase.from('otps').update({ verified: true }).eq('email', email.toLowerCase());
  if (verErr) return { error: verErr.message, status: 500 };
  return { success: true };
}

export async function markEmailVerified(email: string) {
  const { error } = await supabase.from('users').update({ email_verified: true, updated_at: new Date().toISOString() }).eq('email', email.toLowerCase());
  return !error;
}

export async function clearOTP(email: string) {
  await supabase.from('otps').delete().eq('email', email.toLowerCase());
}

export async function createSession(userId: string, userAgent: string, ip: string) {
  const refreshToken = jwt.sign({ userId, type: 'refresh' }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  const ua = userAgent.toLowerCase();
  const device = ua.includes('mobile') ? 'Mobile' : ua.includes('tablet') ? 'Tablet' : 'Desktop';
  const browser = ua.includes('chrome') ? 'Chrome' : ua.includes('firefox') ? 'Firefox' : ua.includes('safari') ? 'Safari' : ua.includes('edge') ? 'Edge' : 'Unknown';
  const session: Session = {
    id: generateId('sess'),
    userId,
    refreshToken,
    userAgent,
    device,
    browser,
    ip,
    createdAt: new Date().toISOString(),
    loginTime: new Date().toISOString(),
    lastSeen: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
  const { error } = await supabase.from('sessions').insert(camelToSnake(session));
  if (error) throw new Error('Failed to create session');
  return session;
}

export async function findSessionByRefreshToken(refreshToken: string) {
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string };
    const { data: session } = await supabase.from('sessions').select('*').eq('refresh_token', refreshToken).maybeSingle();
    if (!session) return null;
    if (new Date(session.expires_at) < new Date()) {
      await supabase.from('sessions').delete().eq('refresh_token', refreshToken);
      return null;
    }
    await supabase.from('sessions').update({ last_seen: new Date().toISOString() }).eq('refresh_token', refreshToken);
    return snakeToCamel(session) as Session;
  } catch {
    await supabase.from('sessions').delete().eq('refresh_token', refreshToken);
    return null;
  }
}

export async function removeSession(refreshToken: string) {
  await supabase.from('sessions').delete().eq('refresh_token', refreshToken);
}

export async function removeUserSessions(userId: string) {
  await supabase.from('sessions').delete().eq('user_id', userId);
}

export async function getUserSessions(userId: string) {
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('expires_at', new Date().toISOString())
    .order('login_time', { ascending: false });
  return (sessions || []).map((s: any) => snakeToCamel(s) as Session);
}

export function generateAccessToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function verifyAccessToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; role: string };
    return { userId: decoded.sub, role: decoded.role };
  } catch {
    return null;
  }
}

export async function generatePasswordResetToken(email: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const token = jwt.sign({ userId: user.id, email, type: 'reset' }, JWT_SECRET, { expiresIn: '15m' });
  resetTokens.set(token, {
    token,
    userId: user.id,
    email: user.email,
    expiresAt: Date.now() + 15 * 60 * 1000,
    used: false,
  });
  return token;
}

export function verifyPasswordResetToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; type: string };
    if (decoded.type !== 'reset') return null;
    const record = resetTokens.get(token);
    if (!record || record.used) return null;
    if (Date.now() > record.expiresAt) {
      resetTokens.delete(token);
      return null;
    }
    return { userId: decoded.userId, email: decoded.email };
  } catch {
    return null;
  }
}

export async function resetPasswordWithToken(token: string, newPassword: string) {
  const decoded = verifyPasswordResetToken(token);
  if (!decoded) return { error: 'Invalid or expired reset token', status: 400 };
  const passwordHash = bcrypt.hashSync(newPassword, SALT_ROUNDS);
  const { error } = await supabase.from('users').update({ password_hash: passwordHash, updated_at: new Date().toISOString() }).eq('id', decoded.userId);
  if (error) return { error: error.message, status: 500 };
  const record = resetTokens.get(token);
  if (record) record.used = true;
  resetTokens.delete(token);
  return { success: true };
}

export function getAuthEvents(userId?: string) {
  return {
    timestamp: new Date().toISOString(),
    userId,
  };
}
