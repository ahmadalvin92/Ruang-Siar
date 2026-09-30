import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getBroadcastBySlug, getBroadcasts } from '@/lib/data/store';
import YoutubePlayer from '@/components/YoutubePlayer';
import BroadcastCard from '@/components/BroadcastCard';
import RundownWidget from '@/components/RundownWidget';
import AdSenseBanner from '@/components/AdSenseBanner';
import { formatDateIndonesian, formatDateTimeIndonesian } from '@/lib/utils';
import { ArrowLeft, Clock, Calendar, Disc3, Radio, Share2, Music2, Info } from 'lucide-react';

export const revalidate = 0;

interface SiaranDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: SiaranDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const broadcast = await getBroadcastBySlug(slug);

  if (!broadcast) {
    return {
      title: 'Siaran Tidak Ditemukan',
    };
  }

  return {
    title: broadcast.title,
    description: broadcast.description,
    openGraph: {
      title: `${broadcast.title} | RUANG SIAR`,
      description: broadcast.description,
      images: broadcast.thumbnailUrl ? [broadcast.thumbnailUrl] : [],
    },
  };
}

export default async function SiaranDetailPage({ params }: SiaranDetailPageProps) {
  const { slug } = await params;
  const broadcast = await getBroadcastBySlug(slug);

  if (!broadcast) {
    notFound();
  }

  const allBroadcasts = await getBroadcasts({ status: 'Published' });
  const relatedBroadcasts = allBroadcasts
    .filter((b) => b.id !== broadcast.id)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/siaran"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Siaran</span>
        </Link>
      </div>

      {/* Main Player & Broadcast Focus */}
      <div className="space-y-6 mb-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              {broadcast.category}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-live" />
              Tersedia
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
              {formatDateTimeIndonesian(broadcast.publishedAt)}
            </span>
          </div>
        </div>

        {/* The YouTube Media Player Component */}
        <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
          <YoutubePlayer
            playlistUrl={broadcast.youtubePlaylistUrl}
            title={broadcast.title}
            posterUrl={broadcast.thumbnailUrl}
            deferUntilPlay
            autoPlay={false}
          />
        </div>

        {/* Narrative & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          <div className="lg:col-span-8 space-y-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {broadcast.title}
            </h1>

            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-base sm:text-lg">
              <p>{broadcast.description}</p>
            </div>

            {/* Rundown & Tracklist Siaran */}
            {broadcast.rundown && broadcast.rundown.length > 0 && (
              <RundownWidget
                rundown={broadcast.rundown}
                title="Rundown & Catatan Tracklist Episode"
              />
            )}

            {/* Editorial / Broadcaster Notes */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Music2 className="w-4 h-4" />
                Catatan Kurasi Musik & Siaran
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Episode ini dirangkai untuk memberikan keseimbangan antara informasi verbal dan alunan melodi. Seluruh lagu dalam playlist dimainkan melalui pemutar resmi YouTube tanpa pengunduhan data ilegal, menjamin kompensasi dan hak cipta bagi kreator dan musisi terkait.
              </p>
            </div>
          </div>

          {/* Sidebar Metadata */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Informasi Program
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Format</span>
                  <span className="text-slate-200 font-medium">Radio Audio-Visual</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Kategori</span>
                  <span className="text-amber-400 font-medium">{broadcast.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Durasi</span>
                  <span className="text-slate-200 font-medium">{broadcast.duration || 'Penuh'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Tanggal Tayang</span>
                  <span className="text-slate-200 font-medium">{formatDateIndonesian(broadcast.publishedAt)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Sumber Playlist</span>
                  <span className="text-slate-300 font-mono text-[11px] truncate max-w-[160px]">
                    YouTube Official Embed
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar AdSense Sponsor */}
            <AdSenseBanner format="rectangle" slotName="Sidebar Siaran Detail" />

            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 flex items-start gap-3">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 leading-relaxed">
                Gunakan kontrol pemutar YouTube untuk mengatur volume, daftar putar antrean lagu, atau resolusi video.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Broadcasts */}
      {relatedBroadcasts.length > 0 && (
        <section className="pt-12 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Episode Siaran Terkait
            </h2>
            <Link
              href="/siaran"
              className="text-xs font-semibold text-amber-400 hover:underline"
            >
              Lihat Katalog Lengkap →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedBroadcasts.map((b) => (
              <BroadcastCard key={b.id} broadcast={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
