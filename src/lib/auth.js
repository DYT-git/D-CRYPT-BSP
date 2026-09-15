import crypto from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'sonali-park-secret-key-2026-bengali-pujas';

export function signToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + 86400 * 7 })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  if (signature !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value || cookieStore.get('admin_session')?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (payload) return payload;

    // Fallback: check legacy plain username cookie
    const admin = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { username: token },
          { email: token }
        ]
      }
    });

    if (admin) {
      return {
        id: admin.id,
        email: admin.email || admin.username,
        name: admin.name || admin.username,
        role: admin.role,
        image: admin.image
      };
    }
    return null;
  } catch (err) {
    return null;
  }
}

export function isEmailAllowed(email) {
  if (!email) return false;
  const allowedStr = process.env.ALLOWED_ADMIN_EMAILS || '';
  const allowedList = allowedStr.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  
  // If no whitelist is configured, allow for setup, but log warning
  if (allowedList.length === 0) return true;
  return allowedList.includes(email.trim().toLowerCase());
}
