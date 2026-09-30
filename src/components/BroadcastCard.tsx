import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Broadcast } from '@/types';
import { formatDateIndonesian } from '@/lib/utils';
import { Play, Clock, Calendar, Disc3, Radio } from 'lucide-react';

interface BroadcastCardProps {
  broadcast: Broadcast;
}

// Category color mapping for vibrant pills
const getCategoryStyle = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('pagi'))    return 'pill-pagi';
  if (cat.includes('siang'))   return 'pill-siang';
  if (cat.includes('sore'))    return 'pill-sore';
  if (cat.includes('malam'))   return 'pill-malam';
  return 'pill-special';
};

export default function BroadcastCard({ broadcast }: BroadcastCardProps) {
  const catStyle = getCategoryStyle(broadcast.category);

  return (
    <article className="group relative flex flex-col rounded-2xl bg-[#0d1117] border border-white/[0.06] hover:border-amber-500/40 overflow-hidden transition-all duration-300 card-hover">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/5 group-hover:to-orange-500/3 transition-all duration-500 pointer-events-none z-10 rounded-2xl" />

      {/* Thumbnail Aspect 16:9 */}
      <Link href={`/siaran/${broadcast.slug}`} className="relative aspect-video w-full overflow-hidden bg-slate-950 block">
        {broadcast.thumbnailUrl ? (
          <Image
            src={broadcast.thumbnailUrl}
            alt={broadcast.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
            style={{ scale: '1' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
            <Disc3 className="w-14 h-14 text-slate-700 animate-spin-slow" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/30 to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-300" />

        {/* Floating Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/40 opacity-0 group-hover:opacity-100 group-hover:scale-110 scale-75 transition-all duration-300">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold backdrop-blur-sm ${catStyle}`}>
            {broadcast.category}
          </span>
          {broadcast.duration && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-medium text-slate-300 border border-white/10">
              <Clock className="w-3 h-3 text-amber-400" />
              {broadcast.duration}
            </span>
          )}
        </div>

        {/* Bottom Rundown Badge */}
        {broadcast.rundown && broadcast.rundown.length > 0 && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] font-semibold text-slate-300">
              <Radio className="w-2.5 h-2.5 text-amber-400" />
              {broadcast.rundown.length} Rundown
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 relative z-10">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
          <Calendar className="w-3.5 h-3.5" />
          <time dateTime={broadcast.publishedAt}>
            {formatDateIndonesian(broadcast.publishedAt)}
          </time>
        </div>

        <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-2 leading-snug">
          <Link href={`/siaran/${broadcast.slug}`}>
            {broadcast.title}
          </Link>
        </h3>

        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
          {broadcast.description}
        </p>

        <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
          <Link
            href={`/siaran/${broadcast.slug}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 group-hover:translate-x-0.5 transition-all"
          >
            <Play className="w-3 h-3 fill-current" />
            Putar Siaran
          </Link>
          <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
            <Disc3 className="w-3 h-3 text-amber-500" />
          </div>
        </div>
      </div>
    </article>
  );
}
