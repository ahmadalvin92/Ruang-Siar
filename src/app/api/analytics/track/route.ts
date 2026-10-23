import { NextRequest, NextResponse } from 'next/server';
import { recordVisit } from '@/lib/analytics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorId, path, pageTitle } = body;

    if (!visitorId || !path) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    await recordVisit({
      visitorId,
      path,
      pageTitle: pageTitle || '',
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
