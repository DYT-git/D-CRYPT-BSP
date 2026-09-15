import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const data = await request.json();
    
    const newEvent = await prisma.event.create({
      data: {
        year: parseInt(data.year),
        title: data.title,
        date: data.date, // e.g., "Saptami - 18th Oct"
        text: data.text, // e.g., "Morning Aarti 8AM"
      }
    });

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const updated = await prisma.event.update({
      where: { id: parseInt(data.id) },
      data: {
        year: parseInt(data.year),
        title: data.title,
        date: data.date,
        text: data.text,
      }
    });
    return NextResponse.json({ success: true, event: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await prisma.event.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
