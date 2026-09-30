/**
 * YouTube Utility functions for Ruang Siar
 * Safely parses YouTube playlist and video URLs into official embed formats
 * without scraping or downloading media files.
 */

export interface ParsedYouTube {
  isValid: boolean;
  type: 'playlist' | 'invalid';
  playlistId: string | null;
  videoId: string | null;
  embedUrl: string | null;
  defaultThumbnail: string | null;
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

  // Handle a copied YouTube playlist ID (e.g., PLxxxxxxxx). Playlist IDs
  // normally begin with one of these prefixes; accepting only these avoids
  // mistaking an arbitrary video ID for a playlist.
  if (/^(?:PL|UU|LL|FL|RD|OLAK5uy_|PLa)[a-zA-Z0-9_-]{8,}$/.test(cleanUrl)) {
    return {
      isValid: true,
      type: 'playlist',
      playlistId: cleanUrl,
      videoId: null,
      embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${cleanUrl}&autoplay=0&rel=0`,
      defaultThumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
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
        errorMessage: 'Gunakan tautan playlist dari YouTube',
      };
    }
    
    // Extract playlist ID if present in searchParams
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
      }
    }

    if (playlistId) {
      // Always start from the playlist sequence. A shared video URL can carry
      // both `v` and `list`; using videoseries prevents it from bypassing the
      // first item, which must be the uploaded MP4 opening broadcast.
      const embedUrl = `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&autoplay=0&rel=0`;

      return {
        isValid: true,
        type: 'playlist',
        playlistId,
        videoId,
        embedUrl,
        defaultThumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
      };
    }

    return {
      isValid: false,
      type: 'invalid',
      playlistId: null,
      videoId: null,
      embedUrl: null,
      defaultThumbnail: null,
      errorMessage: 'Masukkan link playlist YouTube, bukan link satu video',
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
