'use client';

import React from 'react';
import Link from 'next/link';
import { Broadcast } from '@/types';
import YoutubePlayer from './YoutubePlayer';
import RundownWidget from './RundownWidget';
import { formatDateIndonesian } from '@/lib/utils';
import { Radio, Clock, Calendar, ArrowRight, Share2, Volume2, Zap, Disc3, Mic2 } from 'lucide-react';

interface HeroBroadcastProps {
  broadcast: Broadcast;
}

// Equalizer visual element
const LiveEqualizer = () => (
  <div className="flex items-end gap-[3px] h-5">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className={`equalizer-bar wave-bar-${i} bg-gradient-to-t from-amber-500 to-yellow-300`}
        style={{ width: 3, borderRadius: 2 }}
      />
    ))}
  </div>
);

export default function HeroBroadcast({ broadcast }: HeroBroadcastProps) {
  const shareUrl = `/siaran/${broadcast.slug}`;

  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const fullUrl = window.location.origin + shareUrl;
    if (navigator.share) {
      navigator.share({
        title: broadcast.title,
        text: broadcast.description,
        url: fullUrl,
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      alert('Tautan siaran berhasil disalin!');
    }
  };

  return (
    <section className="relative pt-8 pb-14 overflow-hidden">
      {/* Multi-layer ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl -translate-y-1/3" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-gradient-to-l from-purple-500/6 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-gradient-to-r from-rose-500/5 to-transparent rounded-full blur-3xl" />
        <Mic2 className="absolute -left-8 top-12 w-52 h-52 sm:w-80 sm:h-80 text-slate-500/[0.07] blur-[2px] -rotate-12" />
        <Disc3 className="absolute -right-10 top-4 w-56 h-56 sm:w-96 sm:h-96 text-slate-500/[0.06] blur-[2px] animate-spin-slow" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Broadcast Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            {/* Live ON AIR badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/15 to-rose-500/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-wider uppercase shadow-md shadow-red-500/10">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-live" />
              Siaran Utama Hari Ini
              <LiveEqualizer />
            </div>
            <span className="hidden sm:inline-flex px-3 py-1.5 rounded-xl bg-white/[0.04] text-slate-300 text-xs font-semibold border border-white/[0.07] backdrop-blur-sm">
              {broadcast.category}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            {broadcast.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {broadcast.duration}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {formatDateIndonesian(broadcast.publishedAt)}
            </span>
          </div>
        </div>

        {/* Main Player — Full-width immersive */}
        <div className="mb-8 rounded-2xl p-[2px] bg-gradient-to-br from-amber-500/30 via-orange-400/15 to-purple-500/15 shadow-2xl shadow-amber-500/10">
          <div className="rounded-[14px] overflow-hidden bg-slate-950">
            <YoutubePlayer
              playlistUrl={broadcast.youtubePlaylistUrl}
              title={broadcast.title}
              posterUrl={broadcast.thumbnailUrl}
              deferUntilPlay
              className="w-full"
            />
          </div>
        </div>

        {/* Broadcast Narrative & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          <div className="lg:col-span-8 space-y-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
              {broadcast.title}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {broadcast.description}
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end lg:items-end">
            <Link
              href={`/siaran/${broadcast.slug}`}
              className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto lg:w-full"
            >
              <Volume2 className="w-4 h-4" />
              <span>Halaman Siaran Lengkap</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/[0.15] text-xs font-semibold transition-all duration-200 w-full sm:w-auto lg:w-full"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>Bagikan Siaran</span>
            </button>
          </div>
        </div>

        {/* Rundown & Tracklist */}
        {broadcast.rundown && broadcast.rundown.length > 0 && (
          <div className="pt-2">
            <RundownWidget
              rundown={broadcast.rundown}
              title={`Rundown Siaran — ${broadcast.title}`}
            />
          </div>
        )}
      </div>
    </section>
  );
}
