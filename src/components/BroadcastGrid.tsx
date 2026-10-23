'use client';

import React, { useState } from 'react';
import { Broadcast } from '@/types';
import BroadcastCard from './BroadcastCard';
import { ChevronDown, Disc3, CheckCircle2 } from 'lucide-react';

interface BroadcastGridProps {
  broadcasts: Broadcast[];
  emptyMessage?: string;
  initialLimit?: number;
  step?: number;
  showLoadMore?: boolean;
}

export default function BroadcastGrid({
  broadcasts,
  emptyMessage = 'Belum ada siaran yang tersedia saat ini.',
  initialLimit,
  step = 6,
  showLoadMore = false,
}: BroadcastGridProps) {
  const [visibleCount, setVisibleCount] = useState(
    initialLimit ? Math.min(initialLimit, broadcasts.length) : broadcasts.length
  );

  if (broadcasts.length === 0) {
    return (
      <div className="w-full py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8">
        <p className="text-slate-400 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  const visibleBroadcasts = showLoadMore
    ? broadcasts.slice(0, visibleCount)
    : broadcasts;

  const hasMore = showLoadMore && visibleCount < broadcasts.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + step, broadcasts.length));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleBroadcasts.map((broadcast) => (
          <BroadcastCard key={broadcast.id} broadcast={broadcast} />
        ))}
      </div>

      {/* Load More Button (Lihat Selengkapnya) */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center pt-4 gap-2">
          <button
            type="button"
            onClick={handleLoadMore}
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-amber-500/10 hover:to-orange-500/10 text-amber-400 hover:text-amber-300 border border-amber-500/25 hover:border-amber-500/40 text-xs sm:text-sm font-bold shadow-xl shadow-black/40 transition-all duration-300 active:scale-95"
          >
            <Disc3 className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500 text-amber-500" />
            <span>Lihat Selengkapnya ({broadcasts.length - visibleCount} episode lagi)</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
          <span className="text-[11px] text-slate-500">
            Menampilkan {visibleCount} dari total {broadcasts.length} episode siaran
          </span>
        </div>
      )}

      {showLoadMore && !hasMore && broadcasts.length > (initialLimit || 0) && (
        <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Semua {broadcasts.length} episode siaran telah ditampilkan.</span>
        </div>
      )}
    </div>
  );
}
