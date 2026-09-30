import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getNewsBySlug, getNewsList } from '@/lib/data/store';
import NewsCard from '@/components/NewsCard';
import { formatDateIndonesian } from '@/lib/utils';
import { ArrowLeft, Calendar, User, Share2, Newspaper } from 'lucide-react';

export const revalidate = 0;

interface BeritaDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BeritaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return {
      title: 'Berita Tidak Ditemukan',
    };
  }

  return {
    title: news.title,
    description: news.excerpt,
    openGraph: {
      title: `${news.title} | RUANG SIAR`,
      description: news.excerpt,
      images: news.thumbnailUrl ? [news.thumbnailUrl] : [],
    },
  };
}

export default async function BeritaDetailPage({ params }: BeritaDetailPageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  const allNews = await getNewsList({ status: 'Published' });
  const otherNews = allNews.filter((n) => n.id !== news.id).slice(0, 2);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Indeks Berita</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            {news.category}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <time dateTime={news.publishedAt}>{formatDateIndonesian(news.publishedAt)}</time>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {news.title}
        </h1>

        <p className="text-base sm:text-xl text-slate-300 font-medium leading-relaxed border-l-2 border-amber-500 pl-4 py-1">
          {news.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold">
              R
            </div>
            <span>Redaksi Ruang Siar</span>
          </div>

          <span className="text-slate-500">Estimasi Baca: 3 Menit</span>
        </div>
      </header>

      {/* Cover Image */}
      {news.thumbnailUrl && (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-10 bg-slate-900 border border-slate-800 shadow-2xl">
          <Image
            src={news.thumbnailUrl}
            alt={news.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-base sm:text-lg space-y-6 mb-16">
        {news.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Other News */}
      {otherNews.length > 0 && (
        <section className="pt-12 border-t border-slate-800">
          <h2 className="text-xl font-bold text-white mb-6">
            Kabar Lainnya dari Redaksi
          </h2>
          <div className="grid grid-cols-1 gap-5">
            {otherNews.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
