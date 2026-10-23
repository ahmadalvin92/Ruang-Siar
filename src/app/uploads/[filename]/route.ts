import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface RouteContext {
  params: Promise<{
    filename: string;
  }>;
}

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { filename } = await params;
    // Sanitize filename to prevent directory traversal
    const safeName = path.basename(filename);

    const candidates = [
      path.join(process.cwd(), 'public', 'uploads', safeName),
      path.join(process.cwd(), 'uploads', safeName),
    ];

    for (const filePath of candidates) {
      if (fs.existsSync(filePath)) {
        const ext = path.extname(safeName).toLowerCase();
        const contentType = MIME_MAP[ext] || 'application/octet-stream';
        const fileBuffer = fs.readFileSync(filePath);

        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }

    return new NextResponse('File tidak ditemukan', { status: 404 });
  } catch (error) {
    return new NextResponse('Terjadi kesalahan memuat media', { status: 500 });
  }
}
