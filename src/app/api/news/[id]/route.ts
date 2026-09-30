import { NextRequest, NextResponse } from 'next/server';
import { getNewsById, updateNews, deleteNews } from '@/lib/data/store';
import { NewsFormData } from '@/types';
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/auth';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const item = await getNewsById(id);

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Berita tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengambil berita' },
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
    const body = (await request.json()) as Partial<NewsFormData>;

    const updated = await updateNews(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Berita tidak ditemukan untuk diperbarui' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memperbarui berita' },
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
    const deleted = await deleteNews(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Berita tidak ditemukan untuk dihapus' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Berita berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menghapus berita' },
      { status: 500 }
    );
  }
}
