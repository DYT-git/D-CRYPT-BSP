import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import dns from 'dns';
import { prisma } from '@/lib/prisma';

// Ensure fast IPv4 resolution on all environments (prevents Node.js EAI_AGAIN on Windows/Node)
try {
  dns.setDefaultResultOrder?.('ipv4first');
} catch {}

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const data = await request.formData();
    // Support data.getAll('files') or data.getAll('file')
    const rawFiles = data.getAll('files').length > 0 ? data.getAll('files') : data.getAll('file');
    const type = data.get('type') || 'upload'; // 'hero-morning', 'hero-afternoon', 'hero-evening', 'hero-fallback', 'hero', 'audio', 'gallery', 'committee', 'finance'

    if (!rawFiles || rawFiles.length === 0) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Map hero type to setting key & standard filename
    const heroMap = {
      'hero-morning': { filename: 'durga-morning.png', settingKey: 'heroImageMorning' },
      'hero-afternoon': { filename: 'durga-afternoon.png', settingKey: 'heroImageAfternoon' },
      'hero-evening': { filename: 'durga-evening.png', settingKey: 'heroImageEvening' },
      'hero-fallback': { filename: 'durga-hero.png', settingKey: 'heroImageFallback' },
      'hero': { filename: 'durga-hero.png', settingKey: 'heroImageFallback' },
      'club-hero': { filename: 'club-hero-banner.jpg', settingKey: 'clubHeroImage' },
      'samiti-hero': { filename: 'samiti-hero-banner.jpg', settingKey: 'samitiHeroImage' },
      'audio': { filename: 'dhak.mp3', settingKey: 'dhakAudio' }
    };

    const isAsset = Boolean(heroMap[type]);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    const uploadedUrls = [];

    for (const file of rawFiles) {
      if (!file || typeof file === 'string') continue;
      const bytes = await file.arrayBuffer();
      if (!bytes || bytes.byteLength === 0) continue;
      const buffer = Buffer.from(bytes);

      let publicUrl = '';
      const isPdf = Boolean(
        type === 'finance' ||
        type === 'notice' ||
        file.name?.toLowerCase().endsWith('.pdf') ||
        (file.type && file.type === 'application/pdf')
      );

      // 1. Cloudinary Upload (Essential for Live Website / Vercel Serverless CDN)
      if (cloudName && uploadPreset) {
        try {
          const cloudFormData = new FormData();
          const mimeType = file.type || (type === 'audio' ? 'audio/mpeg' : isPdf ? 'application/pdf' : 'image/jpeg');
          const blob = new Blob([buffer], { type: mimeType });
          cloudFormData.append('file', blob, file.name || 'upload.jpg');
          cloudFormData.append('upload_preset', uploadPreset);
          cloudFormData.append('folder', `sonali-park/${type}`);

          const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
            method: 'POST',
            body: cloudFormData,
            signal: AbortSignal.timeout(15000),
          });

          if (cloudRes.ok) {
            const cloudData = await cloudRes.json();
            if (cloudData.secure_url) {
              publicUrl = cloudData.secure_url;
            }
          } else {
            const errText = await cloudRes.text().catch(() => '');
            console.warn(`Cloudinary upload returned ${cloudRes.status}:`, errText);
          }
        } catch (cloudErr) {
          console.warn('Cloudinary upload attempt error, checking local fallback:', cloudErr.message);
        }
      }

      // 2. Local disk backup & fallback (Used when running locally or if Cloudinary is unavailable)
      try {
        let filename = file.name || 'upload.jpg';
        let saveDir = path.join(process.cwd(), 'public', 'uploads');

        if (isAsset) {
          filename = heroMap[type].filename;
          saveDir = path.join(process.cwd(), 'public', 'assets');
        } else {
          const ext = path.extname(filename) || (isPdf ? '.pdf' : type === 'audio' ? '.mp3' : '.jpg');
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const safeBasename = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30) || 'doc';
          filename = `${type}-${safeBasename}-${uniqueSuffix}${ext}`;
        }

        await mkdir(saveDir, { recursive: true });
        const filepath = path.join(saveDir, filename);
        await writeFile(filepath, buffer);

        // If Cloudinary was not available or didn't return a URL, use local file URL
        if (!publicUrl) {
          publicUrl = isAsset ? `/assets/${filename}` : `/uploads/${filename}`;
        }
      } catch (fsErr) {
        // Read-only filesystem is expected on serverless hosts like Vercel
      }

      // 3. For site assets (like hero banners), update local asset file if filesystem allows
      if (isAsset && publicUrl && publicUrl.startsWith('http')) {
        try {
          const filename = heroMap[type].filename;
          const saveDir = path.join(process.cwd(), 'public', 'assets');
          await mkdir(saveDir, { recursive: true });
          await writeFile(path.join(saveDir, filename), buffer);
        } catch (fsErr) {
          // Non-fatal on serverless hosts
        }
      }

      // 4. Persist setting in database for time-of-day hero banners & audio
      if (isAsset && heroMap[type].settingKey && publicUrl) {
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

      if (publicUrl) {
        uploadedUrls.push(publicUrl);
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json({
        error: 'ফাইল আপলোড ব্যর্থ হয়েছে। ক্লাউড স্টোরেজ ও লোকাল ফাইল সিস্টেমে ফাইল সংরক্ষণ করা সম্ভব হয়নি।'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: uploadedUrls.length,
      urls: uploadedUrls,
      url: uploadedUrls[0] || '',
      type
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file: ' + error.message }, { status: 500 });
  }
}

