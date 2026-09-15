import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { signToken, isEmailAllowed } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(new URL('/admin/login?error=google_failed', request.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const origin = request.nextUrl.origin;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/callback/google`;

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('Failed to exchange code for token:', errText);
      return NextResponse.redirect(new URL('/admin/login?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenRes.json();

    // 2. Fetch Google User Profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!profileRes.ok) {
      console.error('Failed to fetch user profile from Google');
      return NextResponse.redirect(new URL('/admin/login?error=profile_fetch_failed', request.url));
    }

    const profile = await profileRes.json();
    const email = profile.email;

    // 3. Security Check: Is email allowed?
    if (!isEmailAllowed(email)) {
      console.warn(`Unauthorized login attempt by: ${email}`);
      return NextResponse.redirect(new URL('/admin/login?error=unauthorized_email', request.url));
    }

    // 4. Upsert AdminUser in Database
    let admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      admin = await prisma.adminUser.create({
        data: {
          email,
          name: profile.name || email.split('@')[0],
          image: profile.picture || null,
          role: 'admin',
        },
      });
    } else {
      admin = await prisma.adminUser.update({
        where: { id: admin.id },
        data: {
          name: profile.name || admin.name,
          image: profile.picture || admin.image,
        },
      });
    }

    // 5. Create Secure JWT Session Token & set HTTP-only cookie
    const token = signToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      image: admin.image,
    });

    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
    });

    // Also set legacy cookie for backwards compatibility
    cookieStore.set('admin_session', admin.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.redirect(new URL('/admin', request.url));
  } catch (err) {
    console.error('Unexpected Google OAuth error:', err);
    return NextResponse.redirect(new URL('/admin/login?error=auth_error', request.url));
  }
}
