import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const images = await prisma.gallery.findMany({
      orderBy: [{ year: 'desc' }, { id: 'desc' }]
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    const newImage = await prisma.gallery.create({
      data: {
        year: parseInt(data.year),
        title: data.title || 'Gallery Image',
        program: data.program || 'Durga Puja',
        category: data.category || 'General',
        src: data.src,
      }
    });

    return NextResponse.json({ success: true, image: newImage });
  } catch (error) {
    console.error('Gallery save error:', error);
    return NextResponse.json({ error: 'Failed to save gallery data' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }
    await prisma.gallery.delete({
      where: { id: parseInt(id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gallery delete error:', error);
    return NextResponse.json({ error: 'Failed to delete gallery image' }, { status: 500 });
  }
}
