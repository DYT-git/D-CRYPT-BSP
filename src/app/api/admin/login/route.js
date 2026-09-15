import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const admin = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (admin && admin.password === password) {
      // For phase 1 testing, just set a simple cookie
      const cookieStore = await cookies();
      cookieStore.set('admin_session', admin.username, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Server error during login' },
      { status: 500 }
    );
  }
}
