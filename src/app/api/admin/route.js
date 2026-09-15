import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const action = formData.get('action');

    if (action === 'addNotice') {
      await prisma.notice.create({
        data: {
          year: Number(formData.get('year')),
          title: formData.get('title'),
          text: formData.get('text'),
          date: formData.get('date'),
        }
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'deleteNotice') {
      await prisma.notice.delete({ where: { id: Number(formData.get('id')) } });
      return NextResponse.json({ success: true });
    }

    if (action === 'addMember') {
      await prisma.member.create({
        data: {
          year: Number(formData.get('year')),
          name: formData.get('name'),
          role: formData.get('role'),
        }
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'deleteMember') {
      await prisma.member.delete({ where: { id: Number(formData.get('id')) } });
      return NextResponse.json({ success: true });
    }

    // Handle File Uploads for Gallery/Finances
    if (action === 'addGallery' || action === 'addFinance') {
      const year = Number(formData.get('year'));
      const title = formData.get('title');
      const file = formData.get('file'); // File object
      
      let fileUrl = '';
      if (file && file.name) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(process.cwd(), 'public/uploads', fileName);
        fs.writeFileSync(filePath, buffer);
        fileUrl = `/uploads/${fileName}`;
      } else {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      if (action === 'addGallery') {
        const program = formData.get('program') || 'Durga Puja';
        const category = formData.get('category') || 'General';
        await prisma.gallery.create({ data: { year, title, program, category, src: fileUrl } });
      } else {
        await prisma.finance.create({ data: { year, title, url: fileUrl } });
      }
      return NextResponse.json({ success: true });
    }

    // Deletes for files
    if (action === 'deleteGallery') {
      await prisma.gallery.delete({ where: { id: Number(formData.get('id')) } });
      return NextResponse.json({ success: true });
    }
    if (action === 'deleteFinance') {
      await prisma.finance.delete({ where: { id: Number(formData.get('id')) } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("Admin API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
