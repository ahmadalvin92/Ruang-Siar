import { NextRequest, NextResponse } from 'next/server';
import { getBroadcastById, updateBroadcast, deleteBroadcast } from '@/lib/data/store';
import { isYouTubePlaylist } from '@/lib/youtube';
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/auth';
import { BroadcastFormData } from '@/types';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const broadcast = await getBroadcastById(id);

    if (!broadcast) {
      return NextResponse.json(
        { success: false, error: 'Siaran tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: broadcast });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengambil siaran' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ success: false, error: 'Silakan login ke CMS terlebih dahulu.' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = (await request.json()) as Partial<BroadcastFormData>;

    if (body.youtubePlaylistUrl !== undefined && !isYouTubePlaylist(body.youtubePlaylistUrl)) {
      return NextResponse.json(
        { success: false, error: 'Masukkan link playlist YouTube yang valid, bukan link satu video.' },
        { status: 400 }
      );
    }

    const updated = await updateBroadcast(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Siaran tidak ditemukan untuk diperbarui' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memperbarui siaran' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ success: false, error: 'Silakan login ke CMS terlebih dahulu.' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const deleted = await deleteBroadcast(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Siaran tidak ditemukan untuk dihapus' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Siaran berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menghapus siaran' },
      { status: 500 }
    );
  }
}
