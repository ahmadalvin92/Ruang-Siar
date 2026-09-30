import { NextRequest, NextResponse } from 'next/server';
import { getBroadcasts, createBroadcast } from '@/lib/data/store';
import { isYouTubePlaylist } from '@/lib/youtube';
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/auth';
import { BroadcastFormData } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as any;
    const category = searchParams.get('kategori') || undefined;
    const search = searchParams.get('q') || undefined;

    const list = await getBroadcasts({
      status: status || undefined,
      category,
      search,
    });

    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengambil data siaran' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ success: false, error: 'Silakan login ke CMS terlebih dahulu.' }, { status: 401 });
  }
  try {
    const body = (await request.json()) as BroadcastFormData;

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Judul siaran wajib diisi' },
        { status: 400 }
      );
    }

    if (!body.youtubePlaylistUrl || !body.youtubePlaylistUrl.trim()) {
      return NextResponse.json(
        { success: false, error: 'URL Playlist YouTube wajib diisi' },
        { status: 400 }
      );
    }

    if (!isYouTubePlaylist(body.youtubePlaylistUrl)) {
      return NextResponse.json(
        { success: false, error: 'Masukkan link playlist YouTube yang valid, bukan link satu video.' },
        { status: 400 }
      );
    }

    const created = await createBroadcast(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menyimpan siaran' },
      { status: 500 }
    );
  }
}
