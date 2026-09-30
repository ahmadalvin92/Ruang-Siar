'use client';

import React, { useState } from 'react';
import { parseYouTubeUrl } from '@/lib/youtube';
import { Play, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';
import LogoMark from './LogoMark';

interface YoutubePlayerProps {
  playlistUrl: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  posterUrl?: string;
  deferUntilPlay?: boolean;
}

export default function YoutubePlayer({
  playlistUrl,
  title = 'Pemutar Siaran',
  className = '',
  autoPlay = false,
  posterUrl,
  deferUntilPlay = false,
}: YoutubePlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(!deferUntilPlay);
  const parsed = parseYouTubeUrl(playlistUrl);

  if (!parsed.isValid || !parsed.embedUrl) {
    return (
      <div
        className={`w-full aspect-video rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-6 text-center shadow-xl ${className}`}
      >
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h4 className="text-lg font-bold text-white mb-2">Playlist Belum Dikonfigurasi</h4>
        <p className="text-sm text-slate-400 max-w-md mb-5 leading-relaxed">
          {parsed.errorMessage ||
            'Tautan YouTube belum disetel dengan benar atau format tautan tidak didukung. Kelola melalui panel Admin.'}
        </p>
        <div className="flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 max-w-full truncate">
          <span className="text-amber-500">Input:</span> {playlistUrl || '(kosong)'}
        </div>
      </div>
    );
  }

  // Append autoplay param if requested
  const shouldAutoPlay = autoPlay || (deferUntilPlay && hasStarted);
  const finalEmbedUrl = shouldAutoPlay
    ? parsed.embedUrl.replace('autoplay=0', 'autoplay=1')
    : parsed.embedUrl;

  if (!hasStarted) {
    return (
      <button
        type="button"
        onClick={() => setHasStarted(true)}
        className={`relative w-full aspect-video overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 text-left group ${className}`}
        aria-label={`Putar ${title}`}
      >
        {posterUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-65 group-hover:opacity-80 transition-opacity duration-300"
            style={{ backgroundImage: `url("${posterUrl}")` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <LogoMark className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl shadow-2xl" priority />
          <span className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 group-hover:bg-amber-400 group-hover:scale-105 transition-all">
            <Play className="w-4 h-4 fill-current" /> Putar Siaran
          </span>
          <span className="text-xs text-slate-200">Klik untuk membuka pemutar playlist</span>
        </div>
      </button>
    );
  }

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-2xl shadow-black/80 group ${className}`}>
      {/* Top Media Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-live" />
            <span className="font-semibold text-white tracking-wide uppercase text-[11px]">
              {parsed.type === 'playlist' ? 'Official YouTube Playlist' : 'Official YouTube Video'}
            </span>
          </div>
          {parsed.playlistId && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
              ID: {parsed.playlistId.slice(0, 14)}...
            </span>
          )}
        </div>

        <a
          href={playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors"
          title="Buka di YouTube"
        >
          <span className="hidden sm:inline text-[11px]">Buka Asli</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 16:9 Video Aspect Ratio Container */}
      <div className="relative w-full aspect-video bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-10">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
            <span className="text-xs text-slate-400 font-medium">Memuat pemutar siaran...</span>
          </div>
        )}

        <iframe
          src={finalEmbedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    </div>
  );
}
