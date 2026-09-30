import React from 'react';
import { ExternalLink, Sparkles, Megaphone, Info } from 'lucide-react';

interface AdSenseBannerProps {
  format?: 'leaderboard' | 'rectangle' | 'inline';
  className?: string;
  slotName?: string;
}

export default function AdSenseBanner({
  format = 'leaderboard',
  className = '',
  slotName = 'Ruang Siar Network',
}: AdSenseBannerProps) {
  if (format === 'rectangle') {
    return (
      <div
        className={`w-full rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-slate-800/80 p-5 text-center flex flex-col justify-between items-center relative overflow-hidden shadow-lg ${className}`}
      >
        <div className="flex items-center justify-between w-full text-[10px] uppercase font-bold tracking-widest text-slate-500 pb-2 border-b border-slate-800/80">
          <span>Google AdSense Space</span>
          <span className="flex items-center gap-1 text-amber-500/80">
            <Info className="w-3 h-3" /> Sponsor
          </span>
        </div>

        <div className="py-6 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Megaphone className="w-5 h-5" />
          </div>
          <div className="text-xs font-bold text-slate-200">
            Slot Promosi & Iklan AdSense
          </div>
          <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
            Pasang promosi brand atau karya musik Anda di ekosistem siaran kontemporer Ruang Siar.
          </p>
        </div>

        <div className="w-full pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
          <span>{slotName}</span>
          <span className="text-slate-400">300 × 250</span>
        </div>
      </div>
    );
  }

  if (format === 'inline') {
    return (
      <div
        className={`w-full p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-center justify-between gap-4 text-xs ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-400 uppercase">
            AdSense
          </div>
          <span className="text-slate-300 font-medium">
            Ruang Siar Partner Network — Menjangkau Ribuan Pendengar Aktif
          </span>
        </div>
        <span className="text-[11px] text-amber-400 font-semibold hover:underline cursor-pointer">
          Info Iklan →
        </span>
      </div>
    );
  }

  // Default: Responsive Leaderboard (728x90)
  return (
    <div
      className={`w-full rounded-2xl bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-slate-900/80 border border-slate-800/80 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden shadow-md ${className}`}
    >
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <Megaphone className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Iklan Google AdSense
            </span>
            <span className="text-xs font-bold text-slate-200">
              Ruang Siar Sponsor Banner
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Hubungkan audiens muda Indonesia dengan produk dan karya terbaik Anda melalui banner media terkurasi.
          </p>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <span className="text-[10px] text-slate-500 font-mono hidden md:inline">
          Format: 728 × 90
        </span>
        <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
          Slot AdSense Aktif
        </div>
      </div>
    </div>
  );
}
