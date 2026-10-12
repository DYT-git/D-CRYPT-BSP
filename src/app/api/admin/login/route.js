import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST() {
  return NextResponse.json(
    {
      error: 'পাসওয়ার্ড লগইন নিষ্ক্রিয় করা হয়েছে। অনুগ্রহ করে অনুমোদিত গুগল অ্যাকাউন্ট (pdyutiranjan@gmail.com) দিয়ে লগইন করুন।',
      code: 'PASSWORD_LOGIN_DISABLED',
    },
    { status: 403 }
  );
}
