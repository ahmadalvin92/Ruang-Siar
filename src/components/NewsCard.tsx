import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { News } from '@/types';
import { formatDateIndonesian } from '@/lib/utils';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';

interface NewsCardProps {
  news: News;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <article className="group flex flex-col sm:flex-row gap-5 p-4 rounded-2xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all duration-300">
      {/* Thumbnail */}
      <Link
        href={`/berita/${news.slug}`}
        className="relative w-full sm:w-48 h-40 rounded-xl overflow-hidden bg-slate-950 shrink-0 block"
      >
        {news.thumbnailUrl ? (
          <Image
            src={news.thumbnailUrl}
            alt={news.title}
            fill
            sizes="(max-width: 640px) 100vw, 200px"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-700">
            <Newspaper className="w-8 h-8" />
          </div>
        )}
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2.5 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md text-[10px] font-semibold text-amber-400 border border-slate-700/60">
            {news.category}
          </span>
        </div>
      </Link>

      {/* Narrative */}
      <div className="flex flex-col justify-between flex-1 py-1">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <time dateTime={news.publishedAt}>
              {formatDateIndonesian(news.publishedAt)}
            </time>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-2 leading-snug">
            <Link href={`/berita/${news.slug}`}>
              {news.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {news.excerpt}
          </p>
        </div>

        <div className="pt-3 mt-2 flex items-center">
          <Link
            href={`/berita/${news.slug}`}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Baca Selengkapnya</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
