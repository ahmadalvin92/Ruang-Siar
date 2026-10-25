import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSettings } from '@/lib/data/store';
import { isAuthenticated } from '@/lib/auth';

import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isAuthed = await isAuthenticated();
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updated = await updateSiteSettings(body);

    // Revalidate public pages and layout so new schedule / settings appear immediately
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/siaran');
      revalidatePath('/berita');
      revalidatePath('/tentang');
      revalidatePath('/kontak');
    } catch (e) {
      // non-blocking
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
