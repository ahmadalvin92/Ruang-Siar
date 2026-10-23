import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/data/store';

export async function GET() {
  const settings = await getSiteSettings();
  let pubId = 'pub-5854985607866680';
  if (settings.adSensePublisherId) {
    pubId = settings.adSensePublisherId.replace(/^ca-/, '').trim();
  }
  const content = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`;
  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
