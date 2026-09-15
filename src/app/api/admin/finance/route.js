import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const data = await request.json();
    
    const newDoc = await prisma.finance.create({
      data: {
        year: parseInt(data.year),
        title: data.title,
        url: data.url,
      }
    });

    return NextResponse.json({ success: true, document: newDoc });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add document' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await prisma.finance.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
