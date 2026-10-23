'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { parseYouTubeUrl } from '@/lib/youtube';
import {
  Play,
  Pause,
  AlertCircle,
  ExternalLink,
  Loader2,
  SkipBack,
  X,
  CheckCircle2,
  Radio,
  Video,
  Headphones,
  Disc3,
  Volume2,
  Sparkles,
} from 'lucide-react';
import LogoMark from './LogoMark';

export interface PreviousBroadcastInfo {
  id?: string;
  title: string;
  slug: string;
  youtubePlaylistUrl?: string;
  thumbnailUrl?: string;
}

interface YoutubePlayerProps {
  playlistUrl: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  posterUrl?: string;
  deferUntilPlay?: boolean;
  previousBroadcast?: PreviousBroadcastInfo | null;
  onEnded?: () => void;
  onPlayPrevious?: () => void;
  autoPlayPrevious?: boolean;
}

export default function YoutubePlayer({
  playlistUrl,
  title = 'Pemutar Siaran',
  className = '',
  autoPlay = false,
  posterUrl,
  deferUntilPlay = false,
  previousBroadcast = null,
  onEnded,
  onPlayPrevious,
  autoPlayPrevious = true,
}: YoutubePlayerProps) {
  const router = useRouter();

  // Mode: 'video' (default) vs 'audio' (MP3 Only)
  const [playerMode, setPlayerMode] = useState<'video' | 'audio'>('video');

  const [isLoading, setIsLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(!deferUntilPlay || autoPlay);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const iframeId = useRef(`yt-player-${Math.random().toString(36).substring(2, 9)}`);

  const parsed = parseYouTubeUrl(playlistUrl);

  // Send safe postMessage commands to YouTube iframe
  const sendIframeCommand = useCallback((func: string, args: any = '') => {
    try {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      }
    } catch {
      // Ignored
    }
  }, []);

  // Trigger next (previous chronologically) episode
  const handleExecutePlayPrevious = useCallback(() => {
    setCountdown(null);
    setIsFinished(false);

    if (onPlayPrevious) {
      onPlayPrevious();
    } else if (previousBroadcast?.slug) {
      router.push(`/siaran/${previousBroadcast.slug}?autoplay=1`);
    }
  }, [onPlayPrevious, previousBroadcast, router]);

  // When playback finishes (0 = ENDED)
  const handlePlaybackEnded = useCallback(() => {
    setIsFinished(true);
    setIsPlaying(false);
    if (onEnded) onEnded();

    if (autoPlayPrevious && previousBroadcast) {
      setCountdown(4); // 4-second countdown before auto-playing previous episode
    }
  }, [autoPlayPrevious, previousBroadcast, onEnded]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown <= 0) {
      handleExecutePlayPrevious();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, handleExecutePlayPrevious]);

  // Listen to YouTube postMessage events (State 0 = ENDED, State 1 = PLAYING, State 2 = PAUSED)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (!event.data) return;
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data) return;

        // Track ended
        if (
          (data.event === 'onStateChange' && data.info === 0) ||
          (data.event === 'infoDelivery' && data.info?.playerState === 0)
        ) {
          handlePlaybackEnded();
        } else if (
          (data.event === 'onStateChange' && data.info === 1) ||
          (data.event === 'infoDelivery' && data.info?.playerState === 1)
        ) {
          setIsPlaying(true);
        } else if (
          (data.event === 'onStateChange' && data.info === 2) ||
          (data.event === 'infoDelivery' && data.info?.playerState === 2)
        ) {
          setIsPlaying(false);
        }

        // Detect playlist track index change
        if (data.event === 'infoDelivery' && typeof data.info?.playlistIndex === 'number') {
          setCurrentTrackIndex(data.info.playlistIndex);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('ruangsiar:track-changed', {
                detail: { index: data.info.playlistIndex },
              })
            );
          }
        }
      } catch {
        // Non-JSON ignored
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handlePlaybackEnded]);

  // Listen to external click on rundown items ('ruangsiar:play-track')
  useEffect(() => {
    const handlePlayTrackEvent = (e: any) => {
      const trackIndex = e.detail?.index;
      if (typeof trackIndex === 'number') {
        setHasStarted(true);
        setIsLoading(false);
        setIsPlaying(true);
        setCurrentTrackIndex(trackIndex);

        // Send playVideoAt command to iframe
        sendIframeCommand('playVideoAt', [trackIndex]);

        // Send via YT Player instance if available
        try {
          if (playerRef.current && typeof playerRef.current.playVideoAt === 'function') {
            playerRef.current.playVideoAt(trackIndex);
          }
        } catch {}

        // Broadcast track changed
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('ruangsiar:track-changed', { detail: { index: trackIndex } })
          );
        }
      }
    };

    window.addEventListener('ruangsiar:play-track', handlePlayTrackEvent);
    return () => window.removeEventListener('ruangsiar:play-track', handlePlayTrackEvent);
  }, [sendIframeCommand]);

  // Safely connect YouTube IFrame API without fragile window mutations
  useEffect(() => {
    if (!hasStarted) return;

    let checkInterval: any = null;
    let attempts = 0;

    const attachPlayer = () => {
      if (typeof window === 'undefined') return false;
      const YT = (window as any).YT;
      if (YT && YT.Player && iframeRef.current) {
        try {
          playerRef.current = new YT.Player(iframeId.current, {
            events: {
              onStateChange: (event: any) => {
                if (event && event.data === 0) {
                  // 0 = YT.PlayerState.ENDED
                  handlePlaybackEnded();
                } else if (event && event.data === 1) {
                  setIsPlaying(true);
                } else if (event && event.data === 2) {
                  setIsPlaying(false);
                }
              },
            },
          });
          return true;
        } catch {
          return false;
        }
      }
      return false;
    };

    if (typeof window !== 'undefined') {
      if (!(window as any).YT && !document.getElementById('yt-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }

      if (!attachPlayer()) {
        checkInterval = setInterval(() => {
          attempts++;
          if (attachPlayer() || attempts >= 15) {
            clearInterval(checkInterval);
          }
        }, 500);
      }
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
          playerRef.current = null;
        } catch {}
      }
    };
  }, [hasStarted, handlePlaybackEnded]);

  // Reset states if URL changes
  useEffect(() => {
    setIsLoading(true);
    setCountdown(null);
    setIsFinished(false);
  }, [playlistUrl]);

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

  // Append autoplay, playsinline, enablejsapi
  const shouldAutoPlay = autoPlay || (deferUntilPlay && hasStarted);
  let finalEmbedUrl = shouldAutoPlay
    ? parsed.embedUrl.replace('autoplay=0', 'autoplay=1')
    : parsed.embedUrl;

  if (!finalEmbedUrl.includes('enablejsapi=1')) {
    finalEmbedUrl += '&enablejsapi=1';
  }
  if (!finalEmbedUrl.includes('playsinline=1')) {
    finalEmbedUrl += '&playsinline=1';
  }

  if (!hasStarted) {
    return (
      <button
        type="button"
        onClick={() => {
          setHasStarted(true);
          setIsPlaying(true);
        }}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
          <LogoMark className="w-52 sm:w-72 h-auto drop-shadow-2xl" priority />
          <span className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-amber-500 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 group-hover:bg-amber-400 group-hover:scale-105 transition-all">
            <Play className="w-4 h-4 fill-current" /> Putar Siaran
          </span>
          <span className="text-xs text-slate-200">
            {previousBroadcast
              ? `Otomatis lanjut ke episode sebelumnya (${previousBroadcast.title})`
              : 'Klik untuk membuka pemutar playlist'}
          </span>
        </div>
      </button>
    );
  }

  return (
    <div
      id="ruangsiar-main-player"
      className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-2xl shadow-black/80 group scroll-mt-24 ${className}`}
    >
      {/* Top Media Bar with Mode Switcher (Video Full vs MP3 Audio Only) */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {parsed.isLive || parsed.type === 'live' ? (
              <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-extrabold text-[10px] tracking-wider flex items-center gap-1.5 shadow-md shadow-red-600/30">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                <span>LIVE STREAM</span>
              </span>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-live" />
                <span className="font-semibold text-white tracking-wide uppercase text-[10px] sm:text-[11px]">
                  {playerMode === 'video'
                    ? parsed.type === 'video'
                      ? 'Official Video'
                      : 'Official Playlist'
                    : 'MP3 / Audio Only'}
                </span>
              </>
            )}
          </div>

          {/* Mode Switcher Buttons */}
          <div className="inline-flex p-0.5 rounded-lg bg-slate-950 border border-slate-800 ml-1">
            <button
              type="button"
              onClick={() => setPlayerMode('video')}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                playerMode === 'video'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilkan layar video 16:9 penuh"
            >
              <Video className="w-3 h-3" />
              <span>Video</span>
            </button>
            <button
              type="button"
              onClick={() => setPlayerMode('audio')}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                playerMode === 'audio'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mode MP3 Audio (Hemat Kuota & Baterai)"
            >
              <Headphones className="w-3 h-3" />
              <span>MP3 Only</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {previousBroadcast && (
            <button
              type="button"
              onClick={handleExecutePlayPrevious}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-[10px] font-semibold transition-colors"
              title={`Putar episode sebelumnya: ${previousBroadcast.title}`}
            >
              <SkipBack className="w-3 h-3" />
              <span className="hidden md:inline">Episode Sebelumnya:</span>
              <span className="truncate max-w-[120px]">{previousBroadcast.title}</span>
            </button>
          )}

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
      </div>

      {/* 16:9 Video Aspect Ratio Container */}
      <div className="relative w-full aspect-video bg-black overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 z-20">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
            <span className="text-xs text-slate-400 font-medium">Memuat pemutar siaran...</span>
          </div>
        )}

        {/* 
          The YouTube iframe is ALWAYS rendered so playback is never interrupted 
          when toggling between Video and MP3 Only mode!
        */}
        <iframe
          ref={iframeRef}
          id={iframeId.current}
          src={finalEmbedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => {
            setIsLoading(false);
            sendIframeCommand('listening');
          }}
          className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300 ${
            playerMode === 'video' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none -z-10'
          }`}
        />

        {/* ============================================================ */}
        {/* MP3 ONLY / AUDIO MODE INTERFACE */}
        {/* ============================================================ */}
        {playerMode === 'audio' && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0a0d14] to-slate-950 flex flex-col justify-between p-6 sm:p-8 z-10 select-none">
            {/* Ambient Pulse */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
            </div>

            {/* Header info */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5" />
                {parsed.isLive || parsed.type === 'live'
                  ? 'Mode MP3 (Audio Live Stream)'
                  : 'Mode MP3 / Audio Only Aktif'}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audio Streaming Berjalan</span>
              </span>
            </div>

            {/* Center Vinyl & Track Info */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8 my-auto">
              {/* Spinning Vinyl Visualizer */}
              <div className="relative shrink-0">
                <div
                  className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-900 border-4 border-slate-800 shadow-2xl flex items-center justify-center relative overflow-hidden ${
                    isPlaying ? 'animate-spin-slow' : ''
                  }`}
                  style={{ boxShadow: '0 0 30px rgba(245, 158, 11, 0.15)' }}
                >
                  <div className="absolute inset-2 rounded-full border border-white/5" />
                  <div className="absolute inset-4 rounded-full border border-white/5" />
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <Disc3 className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* Title & Control buttons */}
              <div className="text-center sm:text-left max-w-md space-y-2">
                <h3 className="text-base sm:text-lg font-black text-white line-clamp-2 leading-snug">
                  {title}
                </h3>
                <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-2">
                  <span>Ruang Siar</span>
                  <span>•</span>
                  <span className="text-amber-400 font-semibold">Trek #{currentTrackIndex + 1}</span>
                  <span>•</span>
                  <span className="text-slate-400">Hemat Kuota</span>
                </p>

                <div className="pt-2 flex items-center justify-center sm:justify-start gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (isPlaying) {
                        sendIframeCommand('pauseVideo');
                        setIsPlaying(false);
                      } else {
                        sendIframeCommand('playVideo');
                        setIsPlaying(true);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Jeda</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Lanjutkan Putar</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlayerMode('video')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Layar Video</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Strip */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-white/[0.05]">
              <div className="flex items-center gap-1.5 text-amber-400/90">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Klik baris di rundown bawah untuk ganti lagu</span>
              </div>
              <span className="hidden sm:inline">Ruang Siar Audio Engine</span>
            </div>
          </div>
        )}

        {/* Countdown Overlay when current episode finishes */}
        {countdown !== null && previousBroadcast && (
          <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/20">
              <SkipBack className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider mb-1">
              Siaran Ini Telah Selesai
            </span>
            <h4 className="text-base sm:text-lg font-black text-white mb-1.5 max-w-lg line-clamp-1">
              {previousBroadcast.title}
            </h4>
            <p className="text-xs text-slate-300 mb-5">
              Otomatis memutar episode sebelumnya dalam{' '}
              <span className="font-extrabold text-amber-400 text-sm px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30">
                {countdown}s
              </span>
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleExecutePlayPrevious}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/30 active:scale-95 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Putar Sekarang
              </button>
              <button
                type="button"
                onClick={() => setCountdown(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                <X className="w-3.5 h-3.5" />
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Finished State when NO previous broadcast remains */}
        {isFinished && !previousBroadcast && countdown === null && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2" />
            <h4 className="text-base font-bold text-white mb-1">Siaran Selesai</h4>
            <p className="text-xs text-slate-400 max-w-sm">
              Ini adalah episode siaran awal dalam arsip kami. Terima kasih telah mendengarkan Ruang Siar!
            </p>
          </div>
        )}
      </div>

      {/* Auto-play Previous Episode Info Banner */}
      {previousBroadcast && (
        <div className="px-4 py-2 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2 truncate">
            <Radio className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-slate-300 font-medium">Episode Selanjutnya:</span>
            <span className="text-amber-400 font-semibold truncate">{previousBroadcast.title}</span>
            <span className="hidden sm:inline text-slate-500">(otomatis berputar saat siaran ini selesai)</span>
          </div>
          <button
            type="button"
            onClick={handleExecutePlayPrevious}
            className="shrink-0 text-amber-400 hover:text-amber-300 hover:underline font-bold text-[11px] ml-2"
          >
            Lompat ke Episode Ini →
          </button>
        </div>
      )}
    </div>
  );
}
