import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const data = await request.json();
    
    const newMember = await prisma.member.create({
      data: {
        year: parseInt(data.year),
        name: data.name,
        role: data.role,
        image: data.image || null,
      }
    });

    return NextResponse.json({ success: true, member: newMember });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const updateData = {
      year: parseInt(data.year),
      name: data.name,
      role: data.role,
    };
    if (data.image !== undefined) {
      updateData.image = data.image;
    }
    const updated = await prisma.member.update({
      where: { id: parseInt(data.id) },
      data: updateData
    });
    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await prisma.member.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
