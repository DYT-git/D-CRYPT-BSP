import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');
    const type = data.get('type') || 'upload'; // 'hero-morning', 'hero-afternoon', 'hero-evening', 'hero-fallback', 'hero', 'audio', 'gallery', 'committee', 'finance'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Map hero type to setting key & standard filename
    const heroMap = {
      'hero-morning': { filename: 'durga-morning.png', settingKey: 'heroImageMorning' },
      'hero-afternoon': { filename: 'durga-afternoon.png', settingKey: 'heroImageAfternoon' },
      'hero-evening': { filename: 'durga-evening.png', settingKey: 'heroImageEvening' },
      'hero-fallback': { filename: 'durga-hero.png', settingKey: 'heroImageFallback' },
      'hero': { filename: 'durga-hero.png', settingKey: 'heroImageFallback' },
      'audio': { filename: 'dhak.mp3', settingKey: 'dhakAudio' }
    };

    const isAsset = Boolean(heroMap[type]);
    let publicUrl = '';

    // ═══ Optional Cloud Storage (Cloudinary Direct REST API) ═══
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (cloudName && uploadPreset) {
      try {
        const cloudFormData = new FormData();
        const base64String = `data:${file.type || 'application/octet-stream'};base64,${buffer.toString('base64')}`;
        cloudFormData.append('file', base64String);
        cloudFormData.append('upload_preset', uploadPreset);
        cloudFormData.append('folder', `sonali-park/${type}`);

        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: 'POST',
          body: cloudFormData,
        });

        if (cloudRes.ok) {
          const cloudData = await cloudRes.json();
          publicUrl = cloudData.secure_url;
        } else {
          console.warn('Cloudinary upload returned non-200, falling back to local');
        }
      } catch (cloudErr) {
        console.warn('Cloudinary upload failed, falling back to local:', cloudErr.message);
      }
    }

    // ═══ Local Storage Fallback & Static Assets ═══
    let filename = file.name;
    let saveDir = path.join(process.cwd(), 'public', 'uploads');

    if (isAsset) {
      filename = heroMap[type].filename;
      saveDir = path.join(process.cwd(), 'public', 'assets');
    } else {
      const ext = path.extname(file.name) || (type === 'finance' ? '.pdf' : '.jpg');
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      filename = `${type}-${uniqueSuffix}${ext}`;
    }

    await mkdir(saveDir, { recursive: true });
    const filepath = path.join(saveDir, filename);
    await writeFile(filepath, buffer);

    if (!publicUrl) {
      publicUrl = isAsset ? `/assets/${filename}` : `/uploads/${filename}`;
    }

    // Persist setting in database for time-of-day hero banners & audio
    if (isAsset && heroMap[type].settingKey) {
      try {
        await prisma.siteSetting.upsert({
          where: { key: heroMap[type].settingKey },
          update: { value: publicUrl },
          create: { key: heroMap[type].settingKey, value: publicUrl }
        });
      } catch (dbErr) {
        console.warn('Failed to persist siteSetting:', dbErr.message);
      }
    }

    return NextResponse.json({ success: true, url: publicUrl, type });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file: ' + error.message }, { status: 500 });
  }
}
