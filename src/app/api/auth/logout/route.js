import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  cookieStore.delete('admin_session');

  return NextResponse.json({ success: true });
}

export async function GET(request) {
  const cookieStore = await cookies();
  cookieStore.delete('admin_token');
  cookieStore.delete('admin_session');

  return NextResponse.redirect(new URL('/admin/login', request.url));
}
