import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(
      new URL('/admin/login?error=google_not_configured', request.url)
    );
  }

  // Derive redirect URI dynamically based on current origin
  const origin = request.nextUrl.origin;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/callback/google`;

  const scope = encodeURIComponent('openid email profile');
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(googleAuthUrl);
}
