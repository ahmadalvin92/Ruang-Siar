import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const playlistId = searchParams.get('playlistId');

  if (!playlistId) {
    return NextResponse.json({ success: false, error: 'playlistId diperlukan' }, { status: 400 });
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: 'YouTube API key belum dikonfigurasi' }, { status: 500 });
  }

  try {
    // Step 1: Fetch playlist items (up to 50 videos)
    const itemsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}`
    );
    const itemsData = await itemsRes.json();

    if (!itemsRes.ok || itemsData.error) {
      const msg = itemsData.error?.message || 'Gagal mengambil data playlist';
      return NextResponse.json({ success: false, error: msg }, { status: 400 });
    }

    const items: { videoId: string; title: string }[] = (itemsData.items || []).map((item: any) => ({
      videoId: item.snippet?.resourceId?.videoId,
      title: item.snippet?.title || 'Untitled',
    })).filter((i: any) => i.videoId);

    if (items.length === 0) {
      return NextResponse.json({ success: false, error: 'Playlist kosong atau tidak ditemukan' }, { status: 404 });
    }

    // Step 2: Fetch durations for all videos in one batch call
    const videoIds = items.map((i) => i.videoId).join(',');
    const durRes = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`
    );
    const durData = await durRes.json();

    // Build a map of videoId -> duration in seconds
    const durationMap: Record<string, number> = {};
    for (const vid of (durData.items || [])) {
      const dur = vid.contentDetails?.duration || 'PT0S';
      durationMap[vid.id] = parseDuration(dur);
    }

    // Step 3: Build rundown text with cumulative timestamps
    const lines: string[] = [];
    let cumSeconds = 0;

    for (const item of items) {
      const timeStr = formatSeconds(cumSeconds);
      const cleanTitle = cleanYouTubeTitle(item.title);
      lines.push(`${timeStr} - ${cleanTitle}`);
      cumSeconds += durationMap[item.videoId] || 0;
    }

    // Also get playlist thumbnail
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${apiKey}`
    );
    const playlistData = await playlistRes.json();
    const playlist = playlistData.items?.[0];
    const thumbnail =
      playlist?.snippet?.thumbnails?.maxres?.url ||
      playlist?.snippet?.thumbnails?.high?.url ||
      playlist?.snippet?.thumbnails?.default?.url ||
      null;
    const playlistTitle = playlist?.snippet?.title || '';

    return NextResponse.json({
      success: true,
      rundownText: lines.join('\n'),
      tracks: items.map((item, i) => ({
        title: cleanYouTubeTitle(item.title),
        videoId: item.videoId,
        durationSeconds: durationMap[item.videoId] || 0,
      })),
      thumbnail,
      playlistTitle,
      totalTracks: items.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Terjadi kesalahan' }, { status: 500 });
  }
}

// Parse ISO 8601 duration (e.g., PT3M15S) to seconds
function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const h = parseInt(match[1] || '0', 10);
  const m = parseInt(match[2] || '0', 10);
  const s = parseInt(match[3] || '0', 10);
  return h * 3600 + m * 60 + s;
}

// Format seconds to MM:SS or H:MM:SS
function formatSeconds(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Clean YouTube titles (remove channel names, extra symbols)
function cleanYouTubeTitle(title: string): string {
  return title
    .replace(/\s*\[.*?\]\s*/g, '') // remove [Official Video] etc
    .replace(/\s*\(.*?(?:official|video|audio|mv|lyric|lyrics|hd|4k).*?\)\s*/gi, '') // remove (Official Video) etc
    .replace(/\s*official\s*(?:music\s*)?video\s*/gi, '')
    .replace(/\s*official\s*audio\s*/gi, '')
    .replace(/\s*-\s*topic\s*/gi, '')
    .trim();
}
