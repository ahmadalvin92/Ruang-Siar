'use client';

import React, { useState, useEffect } from 'react';
import { RundownItem } from '@/types';
import { Mic, Music, Clock, ListOrdered, ChevronDown, Play, Volume2 } from 'lucide-react';

interface RundownWidgetProps {
  rundown?: RundownItem[];
  title?: string;
  className?: string;
}

// Mini animated equalizer bars for currently playing item
const MiniEqualizer = () => (
  <div className="flex items-end gap-[2px] h-3.5">
    <span className="w-1 bg-amber-400 rounded-sm animate-pulse h-2" />
    <span className="w-1 bg-amber-300 rounded-sm animate-pulse h-3.5" />
    <span className="w-1 bg-amber-500 rounded-sm animate-pulse h-2.5" />
  </div>
);

export default function RundownWidget({
  rundown,
  title = 'Rundown & Susunan Putar Siaran',
  className = '',
}: RundownWidgetProps) {
  // Collapsed / hidden by default when opening website, can be opened by clicking
  const [isOpen, setIsOpen] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState<number | null>(null);

  // Listen to track-changed event from YoutubePlayer
  useEffect(() => {
    const handleTrackChanged = (e: any) => {
      const idx = e.detail?.index;
      if (typeof idx === 'number') {
        setActiveTrackIndex(idx);
      }
    };

    window.addEventListener('ruangsiar:track-changed', handleTrackChanged);
    return () => window.removeEventListener('ruangsiar:track-changed', handleTrackChanged);
  }, []);

  if (!rundown || rundown.length === 0) {
    return null;
  }

  const handlePlayTrack = (index: number) => {
    setActiveTrackIndex(index);

    // Dispatch event to YoutubePlayer
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('ruangsiar:play-track', { detail: { index } })
      );

      // Smooth scroll to the main player on mobile / desktop
      const playerEl = document.getElementById('ruangsiar-main-player');
      if (playerEl) {
        playerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div
      className={`rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-xl transition-all duration-300 overflow-hidden ${
        isOpen ? 'p-5 sm:p-6 space-y-4' : 'p-4 sm:p-5'
      } ${className}`}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
          isOpen ? 'pb-3 border-b border-slate-800' : 'hover:opacity-95'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white tracking-wide truncate">
                {title}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 text-[10px] font-mono font-bold border border-slate-700/60">
                {rundown.length} Bagian
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {isOpen
                ? 'Klik judul lagu / siaran di bawah untuk langsung memutarnya di pemutar video'
                : 'Klik untuk membuka susunan acara & putar lagu tertentu'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider px-3 py-1.5 rounded-xl transition-all shrink-0 border ${
            isOpen
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-amber-500/50'
          }`}
        >
          <span>{isOpen ? 'Tutup' : 'Lihat Rundown'}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="space-y-2">
          {rundown.map((item, index) => {
            const isSiaran = item.type === 'siaran';
            const isCurrentlyPlaying = activeTrackIndex === index;

            return (
              <div
                key={index}
                onClick={() => handlePlayTrack(index)}
                className={`group flex items-start sm:items-center justify-between gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  isCurrentlyPlaying
                    ? 'bg-amber-500/15 border border-amber-500/50 shadow-lg shadow-amber-500/10 scale-[1.01]'
                    : isSiaran
                    ? 'bg-amber-500/5 hover:bg-amber-500/15 border border-amber-500/20 hover:border-amber-500/40'
                    : 'bg-slate-950/60 hover:bg-slate-900 border border-slate-800/60 hover:border-amber-500/30'
                }`}
                title={`Klik untuk memutar video #${index + 1}: ${item.title}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePlayTrack(index);
                  }
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Track Number / Index Badge */}
                  <span
                    className={`font-mono text-[10px] font-bold w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                      isCurrentlyPlaying
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                        : 'bg-slate-900 text-slate-400 border-slate-800 group-hover:border-amber-500/40 group-hover:text-amber-400'
                    }`}
                  >
                    {isCurrentlyPlaying ? (
                      <MiniEqualizer />
                    ) : (
                      index + 1
                    )}
                  </span>

                  {/* Time Badge */}
                  <span className="flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-900 border border-slate-700/70 text-amber-400 shrink-0 shadow-inner">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {item.time}
                  </span>

                  {/* Type Icon */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isCurrentlyPlaying
                        ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50'
                        : isSiaran
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                    title={isSiaran ? 'Sesi Siaran Suara' : 'Video Klip Lagu'}
                  >
                    {isSiaran ? (
                      <Mic className="w-3.5 h-3.5" />
                    ) : (
                      <Music className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Title & Artist/Speaker */}
                  <div className="min-w-0">
                    <div
                      className={`text-xs font-semibold truncate transition-colors ${
                        isCurrentlyPlaying
                          ? 'text-amber-300 font-bold'
                          : isSiaran
                          ? 'text-amber-200 group-hover:text-amber-300'
                          : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {item.title}
                    </div>
                    {item.artistOrSpeaker && (
                      <div className="text-[11px] text-slate-400 truncate">
                        {item.artistOrSpeaker}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action / Status */}
                <div className="shrink-0 flex items-center gap-2">
                  {isCurrentlyPlaying ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md shadow-amber-500/20">
                      <Volume2 className="w-3 h-3 animate-pulse" />
                      <span>Diputar</span>
                    </span>
                  ) : (
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-400 text-[10px] font-bold uppercase tracking-wider transition-all border border-slate-700/60 group-hover:border-amber-400">
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Putar</span>
                    </span>
                  )}

                  {/* Category Pill */}
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isSiaran
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {isSiaran ? 'Siaran' : 'Lagu'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
