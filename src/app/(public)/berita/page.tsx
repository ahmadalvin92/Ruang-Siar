import React from 'react';
import Link from 'next/link';
import { getNewsList } from '@/lib/data/store';
import NewsGrid from '@/components/NewsGrid';
import { Newspaper, Search } from 'lucide-react';

export const revalidate = 0;

interface BeritaPageProps {
  searchParams: Promise<{
    kategori?: string;
    q?: string;
  }>;
}

export default async function BeritaPage({ searchParams }: BeritaPageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.kategori || 'Semua';
  const query = resolvedParams.q || '';

  const newsList = await getNewsList({
    status: 'Published',
    category: currentCategory !== 'Semua' ? currentCategory : undefined,
    search: query || undefined,
  });

  const categories = [
    'Semua',
    'Kabar Musik',
    'Media & Tren',
    'Budaya & Seni',
    'Teknologi',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Newspaper className="w-3.5 h-3.5" />
          Redaksi & Warta
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
          Kabar & Berita Terkini
        </h1>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
          Kilas warta seputar dunia penyiaran kontemporer, liputan ekosistem musik lokal, ulasan budaya, dan perkembangan teknologi media digital.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = currentCategory === cat;
            return (
              <Link
                key={cat}
                href={cat === 'Semua' ? '/berita' : `/berita?kategori=${encodeURIComponent(cat)}`}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Search Input Form */}
        <form method="GET" action="/berita" className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          {currentCategory !== 'Semua' && (
            <input type="hidden" name="kategori" value={currentCategory} />
          )}
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Cari artikel berita..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition-colors"
          />
        </form>
      </div>

      {/* Results */}
      <div>
        <div className="text-xs text-slate-400 mb-6 flex items-center justify-between">
          <span>Menampilkan {newsList.length} artikel warta</span>
          {(currentCategory !== 'Semua' || query) && (
            <Link
              href="/berita"
              className="text-amber-400 hover:underline transition-colors"
            >
              Reset Filter
            </Link>
          )}
        </div>

        <NewsGrid
          newsList={newsList}
          emptyMessage="Tidak ada artikel berita yang cocok dengan kriteria pencarian Anda."
        />
      </div>
    </div>
  );
}
