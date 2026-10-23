import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/auth';

// Allowed MIME types for image uploads
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
];

export async function POST(request: NextRequest) {
  // Validate admin auth
  if (!isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json(
      { success: false, error: 'Silakan login ke CMS terlebih dahulu.' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada file yang diunggah.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Format file tidak didukung (${file.type}). Gunakan JPG, PNG, WEBP, atau GIF.`,
        },
        { status: 400 }
      );
    }

    // Limit to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Ukuran foto maksimal 10MB.' },
        { status: 400 }
      );
    }

    // Prepare uploads directory
    const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const localUploadsDir = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(publicUploadsDir)) {
      fs.mkdirSync(publicUploadsDir, { recursive: true });
    }
    if (!fs.existsSync(localUploadsDir)) {
      fs.mkdirSync(localUploadsDir, { recursive: true });
    }

    // Sanitize file name
    const ext = path.extname(file.name) || `.${file.type.split('/')[1] || 'jpg'}`;
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const filename = `${Date.now()}_${cleanBase}${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // Save to public/uploads
    fs.writeFileSync(path.join(publicUploadsDir, filename), buffer);
    // Also save to root uploads for backup
    try {
      fs.writeFileSync(path.join(localUploadsDir, filename), buffer);
    } catch {
      // non-blocking
    }

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengunggah foto.' },
      { status: 500 }
    );
  }
}
