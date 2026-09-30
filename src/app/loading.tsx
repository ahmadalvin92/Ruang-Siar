import React from 'react';
import { Loader2, Radio } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Radio className="w-6 h-6 animate-pulse" />
        </div>
        <div className="absolute -bottom-1 -right-1">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-live block" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-bold text-white tracking-wide">Menghubungkan Frekuensi Ruang Siar...</p>
        <p className="text-xs text-slate-500">Memuat kurasi siaran dan warta terbaru</p>
      </div>
    </div>
  );
}
