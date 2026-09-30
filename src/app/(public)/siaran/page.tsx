import React from 'react';
import Link from 'next/link';
import { getBroadcasts } from '@/lib/data/store';
import BroadcastGrid from '@/components/BroadcastGrid';
import AdSenseBanner from '@/components/AdSenseBanner';
import { Radio, Search, Disc3, Filter, Zap } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Semua Siaran | Ruang Siar.id',
  description: 'Temukan arsip siaran tematik harian Ruang Siar. Paduan narasi penyiar berpadu playlist kurasi YouTube untuk menemani setiap fase waktu Anda.',
};

interface SiaranPageProps {
  searchParams: Promise<{
    kategori?: string;
    q?: string;
  }>;
}

const categories = [
  { label: 'Semua', color: 'amber' },
  { label: 'Siaran Pagi', color: 'amber' },
  { label: 'Siaran Siang', color: 'orange' },
  { label: 'Siaran Sore', color: 'rose' },
  { label: 'Siaran Malam', color: 'purple' },
  { label: 'Wawancara', color: 'sky' },
  { label: 'Spesial Musik', color: 'emerald' },
];

export default async function SiaranPage({ searchParams }: SiaranPageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.kategori || 'Semua';
  const query = resolvedParams.q || '';

  const broadcasts = await getBroadcasts({
    status: 'Published',
    category: currentCategory !== 'Semua' ? currentCategory : undefined,
    search: query || undefined,
  });

  return (
    <div className="relative min-h-screen">
      {/* Background decoration */}
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-amber-500/6 via-purple-500/3 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-black uppercase tracking-widest mb-4">
            <Radio className="w-3.5 h-3.5 animate-live" style={{ animationDuration: '3s' }} />
            Katalog Audio Visual
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Semua Siaran{' '}
            <span className="gradient-text-vibrant">Ruang Siar</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Temukan arsip siaran tematik harian kami. Paduan narasi pembicara berpadu playlist kurasi YouTube untuk menemani setiap fase waktu Anda.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 mb-10 pb-8 border-b border-white/[0.06]">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
            {categories.map((cat) => {
              const isSelected = currentCategory === cat.label;
              const selectedStyles: Record<string, string> = {
                amber: 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-transparent shadow-lg shadow-amber-500/25',
                orange: 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 border-transparent shadow-lg shadow-orange-500/25',
                rose: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-transparent shadow-lg shadow-rose-500/25',
                purple: 'bg-gradient-to-r from-purple-500 to-violet-500 text-white border-transparent shadow-lg shadow-purple-500/25',
                sky: 'bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 border-transparent shadow-lg shadow-sky-500/25',
                emerald: 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 border-transparent shadow-lg shadow-emerald-500/25',
              };
              return (
                <Link
                  key={cat.label}
                  href={cat.label === 'Semua' ? '/siaran' : `/siaran?kategori=${encodeURIComponent(cat.label)}`}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                    isSelected
                      ? (selectedStyles[cat.color] || selectedStyles.amber)
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/[0.07] hover:border-white/[0.15]'
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>

          {/* Search Input */}
          <form method="GET" action="/siaran" className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            {currentCategory !== 'Semua' && (
              <input type="hidden" name="kategori" value={currentCategory} />
            )}
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Cari judul siaran..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </form>
        </div>

        {/* Results Count */}
        <div className="text-xs text-slate-500 mb-6 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Disc3 className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
            Menampilkan <strong className="text-slate-300 ml-1">{broadcasts.length}</strong>&nbsp;episode siaran
          </span>
          {(currentCategory !== 'Semua' || query) && (
            <Link href="/siaran" className="text-amber-400 hover:underline hover:text-amber-300 transition-colors font-semibold">
              Reset Filter →
            </Link>
          )}
        </div>

        {/* Broadcast Grid */}
        <BroadcastGrid
          broadcasts={broadcasts}
          emptyMessage="Tidak ada siaran yang sesuai dengan pencarian atau filter."
        />

        {/* Inline AdSense */}
        {broadcasts.length > 3 && (
          <div className="mt-10">
            <AdSenseBanner format="inline" slotName="Siaran List Inline" />
          </div>
        )}
      </div>
    </div>
  );
}
