/**
 * YouTube Utility functions for Ruang Siar
 * Safely parses YouTube playlist, live stream, and video URLs into official embed formats
 * without scraping or downloading media files.
 */

export interface ParsedYouTube {
  isValid: boolean;
  type: 'playlist' | 'video' | 'live' | 'invalid';
  playlistId: string | null;
  videoId: string | null;
  embedUrl: string | null;
  defaultThumbnail: string | null;
  isLive?: boolean;
  errorMessage?: string;
}

export function parseYouTubeUrl(rawUrl: string | null | undefined): ParsedYouTube {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
    return {
      isValid: false,
      type: 'invalid',
      playlistId: null,
      videoId: null,
      embedUrl: null,
      defaultThumbnail: null,
      errorMessage: 'URL YouTube belum diisi',
    };
  }

  const cleanUrl = rawUrl.trim();

  // 1. Direct YouTube playlist ID (e.g., PLxxxxxxxx, RDxxxxxxx)
  if (/^(?:PL|UU|LL|FL|RD|OLAK5uy_|PLa)[a-zA-Z0-9_-]{8,}$/.test(cleanUrl)) {
    return {
      isValid: true,
      type: 'playlist',
      playlistId: cleanUrl,
      videoId: null,
      embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${cleanUrl}&autoplay=0&rel=0&enablejsapi=1&playsinline=1`,
      defaultThumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
    };
  }

  // 2. Direct 11-char video or live ID (e.g. dQw4w9WgXcQ)
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return {
      isValid: true,
      type: 'video',
      playlistId: null,
      videoId: cleanUrl,
      embedUrl: `https://www.youtube-nocookie.com/embed/${cleanUrl}?autoplay=0&rel=0&enablejsapi=1&playsinline=1`,
      defaultThumbnail: `https://img.youtube.com/vi/${cleanUrl}/hqdefault.jpg`,
    };
  }

  try {
    // Attempt standard URL parse
    const url = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
    const hostname = url.hostname.replace('www.', '').replace('m.', '');

    if (hostname !== 'youtube.com' && hostname !== 'youtu.be') {
      return {
        isValid: false,
        type: 'invalid',
        playlistId: null,
        videoId: null,
        embedUrl: null,
        defaultThumbnail: null,
        errorMessage: 'Gunakan tautan resmi dari YouTube (Playlist, Live Stream, atau Video)',
      };
    }

    const isExplicitLive = url.pathname.startsWith('/live/') || url.searchParams.get('live') === '1';
    let playlistId = url.searchParams.get('list');
    let videoId = url.searchParams.get('v');

    if (hostname === 'youtu.be') {
      videoId = url.pathname.slice(1).split('/')[0] || null;
    } else if (hostname.includes('youtube.com')) {
      if (url.pathname.startsWith('/embed/videoseries')) {
        playlistId = url.searchParams.get('list');
      } else if (url.pathname.startsWith('/embed/')) {
        videoId = url.pathname.replace('/embed/', '').split('/')[0] || null;
      } else if (url.pathname.startsWith('/playlist')) {
        playlistId = url.searchParams.get('list');
      } else if (url.pathname.startsWith('/live/')) {
        videoId = url.pathname.replace('/live/', '').split('/')[0].split('?')[0] || null;
      }
    }

    // A. Playlist URL (priority if list param exists and not explicit /live/)
    if (playlistId && !isExplicitLive) {
      const embedUrl = `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&autoplay=0&rel=0&enablejsapi=1&playsinline=1`;

      return {
        isValid: true,
        type: 'playlist',
        playlistId,
        videoId,
        embedUrl,
        defaultThumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
      };
    }

    // B. Live Stream or Single Video URL
    if (videoId) {
      const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&enablejsapi=1&playsinline=1`;

      return {
        isValid: true,
        type: isExplicitLive ? 'live' : 'video',
        playlistId: null,
        videoId,
        embedUrl,
        isLive: isExplicitLive,
        defaultThumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      };
    }

    return {
      isValid: false,
      type: 'invalid',
      playlistId: null,
      videoId: null,
      embedUrl: null,
      defaultThumbnail: null,
      errorMessage: 'Tautan YouTube tidak memuat ID playlist atau ID video yang valid',
    };
  } catch {
    return {
      isValid: false,
      type: 'invalid',
      playlistId: null,
      videoId: null,
      embedUrl: null,
      defaultThumbnail: null,
      errorMessage: 'Format tautan YouTube tidak dikenali',
    };
  }
}

/** True only for a valid YouTube playlist URL or copied playlist ID. */
export function isYouTubePlaylist(rawUrl: string | null | undefined): boolean {
  const parsed = parseYouTubeUrl(rawUrl);
  return parsed.isValid && parsed.type === 'playlist' && Boolean(parsed.playlistId);
}

/** True for a valid YouTube Live stream or video. */
export function isYouTubeLiveOrVideo(rawUrl: string | null | undefined): boolean {
  const parsed = parseYouTubeUrl(rawUrl);
  return parsed.isValid && (parsed.type === 'video' || parsed.type === 'live');
}

/** True for any valid YouTube URL (playlist, video, or live stream). */
export function isYouTubeValid(rawUrl: string | null | undefined): boolean {
  const parsed = parseYouTubeUrl(rawUrl);
  return parsed.isValid;
}
