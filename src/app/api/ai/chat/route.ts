import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from '@/lib/auth';
import { askGemini, generateNewsWithAI, generateBroadcastWithAI } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ success: false, error: 'Silakan login ke CMS terlebih dahulu.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, prompt, history, topic, angle, playlistContext, playlistTitle, trackList, customNotes } = body;

    // 1. Generate News / Warta with Gemini
    if (action === 'generate-news') {
      if (!topic || !topic.trim()) {
        return NextResponse.json({ success: false, error: 'Topik berita wajib diisi.' }, { status: 400 });
      }
      const article = await generateNewsWithAI(topic, angle, playlistContext);
      return NextResponse.json({ success: true, data: article });
    }

    // 2. Generate Broadcast from Playlist with Gemini
    if (action === 'generate-broadcast') {
      const broadcastData = await generateBroadcastWithAI({
        playlistTitle,
        trackList,
        customNotes,
      });
      return NextResponse.json({ success: true, data: broadcastData });
    }

    // 3. Default: Interactive Chatbot Assistant
    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ success: false, error: 'Pesan tidak boleh kosong.' }, { status: 400 });
    }

    const reply = await askGemini(prompt, history || []);
    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi gangguan sementara saat menghubungi AI. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
