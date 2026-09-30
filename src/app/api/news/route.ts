import { NextRequest, NextResponse } from 'next/server';
import { getNewsList, createNews } from '@/lib/data/store';
import { NewsFormData } from '@/types';
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as any;
    const category = searchParams.get('kategori') || undefined;
    const search = searchParams.get('q') || undefined;

    const list = await getNewsList({
      status: status || undefined,
      category,
      search,
    });

    return NextResponse.json({ success: true, data: list });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengambil berita' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ success: false, error: 'Silakan login ke CMS terlebih dahulu.' }, { status: 401 });
  }
  try {
    const body = (await request.json()) as NewsFormData;

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Judul berita wajib diisi' },
        { status: 400 }
      );
    }

    if (!body.excerpt || !body.excerpt.trim()) {
      return NextResponse.json(
        { success: false, error: 'Ringkasan berita wajib diisi' },
        { status: 400 }
      );
    }

    if (!body.content || !body.content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Isi lengkap berita wajib diisi' },
        { status: 400 }
      );
    }

    const created = await createNews(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal menyimpan berita' },
      { status: 500 }
    );
  }
}
