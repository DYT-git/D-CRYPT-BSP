import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(notices);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // If this notice is urgent, we could optionally un-mark others, 
    // but for now we'll just let the frontend pick the latest urgent one.
    
    const newNotice = await prisma.notice.create({
      data: {
        year: parseInt(data.year),
        title: data.title,
        text: data.text,
        date: new Date().toISOString(),
        isUrgent: data.isUrgent || false,
      }
    });

    return NextResponse.json({ success: true, notice: newNotice });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create notice' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const updated = await prisma.notice.update({
      where: { id: parseInt(data.id) },
      data: {
        title: data.title,
        text: data.text,
        year: data.year ? parseInt(data.year) : undefined,
        isUrgent: data.isUrgent !== undefined ? Boolean(data.isUrgent) : undefined,
      }
    });
    return NextResponse.json({ success: true, notice: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notice: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await prisma.notice.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete notice' }, { status: 500 });
  }
}
