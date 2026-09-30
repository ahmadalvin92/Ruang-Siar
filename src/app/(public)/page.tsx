import React from 'react';
import Link from 'next/link';
import { getBroadcasts, getNewsList } from '@/lib/data/store';
import HeroBroadcast from '@/components/HeroBroadcast';
import BroadcastGrid from '@/components/BroadcastGrid';
import NewsGrid from '@/components/NewsGrid';
import AdSenseBanner from '@/components/AdSenseBanner';
import { Radio, ArrowRight, Disc3, Sparkles, Headphones, Music2, ShieldCheck, Zap, MessageCircle, Users } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Ruang Siar.id — Radio & Media Audio-Visual Indonesia',
  description: 'Platform siaran kontemporer Indonesia. Nikmati narasi penyiar yang hangat dipadukan kurasi playlist YouTube resmi untuk pengalaman audio-visual yang menginspirasi.',
  openGraph: {
    title: 'Ruang Siar.id — Radio & Media Audio-Visual Indonesia',
    description: 'Platform siaran kontemporer Indonesia. Narasi penyiar berpadu playlist resmi YouTube.',
    siteName: 'Ruang Siar',
    type: 'website',
  },
};

export default async function HomePage() {
  const publishedBroadcasts = await getBroadcasts({ status: 'Published' });
  const publishedNews = await getNewsList({ status: 'Published', limit: 4 });

  const mainBroadcast = publishedBroadcasts[0];
  const otherBroadcasts = publishedBroadcasts.slice(1, 7);

  const stats = [
    { icon: <Disc3 className="w-5 h-5" />, value: `${publishedBroadcasts.length}+`, label: 'Episode Siaran', color: 'text-amber-400' },
    { icon: <Users className="w-5 h-5" />, value: '10K+', label: 'Pendengar Aktif', color: 'text-sky-400' },
    { icon: <Music2 className="w-5 h-5" />, value: '500+', label: 'Lagu Dikurasi', color: 'text-purple-400' },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      value: 'WhatsApp',
      label: '+62 896-3017-2935',
      color: 'text-emerald-400',
      href: 'https://wa.me/6289630172935',
    },
  ];

  return (
    <div className="space-y-0">
      {/* ====================== */}
      {/* 1. HERO / MAIN BROADCAST */}
      {/* ====================== */}
      {mainBroadcast ? (
        <HeroBroadcast broadcast={mainBroadcast} />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 mb-6">
            <Radio className="w-10 h-10 text-amber-500" />
          </div>
          <p className="text-slate-400 text-lg">Belum ada siaran utama yang dipublikasikan.</p>
          <Link href="/admin/siaran/baru" className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors">
            <Zap className="w-4 h-4" />
            Buat Siaran Pertama
          </Link>
        </div>
      )}

      {/* ====================== */}
      {/* 2. STATS STRIP */}
      {/* ====================== */}
      <section className="py-6 border-y border-white/[0.05] bg-gradient-to-r from-transparent via-amber-500/[0.02] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const content = <>
                <div className={`${stat.color} shrink-0`}>{stat.icon}</div>
                <div>
                  <div className={`text-xl sm:text-2xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">{stat.label}</div>
                </div>
              </>;

              return stat.href ? (
                <a key={stat.label} href={stat.href} target="_blank" rel="noopener noreferrer" className="stat-card rounded-2xl p-4 sm:p-5 flex items-center gap-4 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors" aria-label="Hubungi Ruang Siar melalui WhatsApp">
                  {content}
                </a>
              ) : (
                <div key={stat.label} className="stat-card rounded-2xl p-4 sm:p-5 flex items-center gap-4">{content}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================== */}
      {/* 3. LATEST BROADCASTS */}
      {/* ====================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-widest text-amber-500 mb-2">
              <Disc3 className="w-4 h-4 animate-spin-slow" />
              Kurasi Terbaru
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Siaran <span className="gradient-text-vibrant">Pilihan Lainnya</span>
            </h2>
          </div>
          <Link
            href="/siaran"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>Lihat Semua Siaran</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <BroadcastGrid broadcasts={otherBroadcasts} />
      </section>

      {/* ====================== */}
      {/* 4. ADSENSE LEADERBOARD */}
      {/* ====================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <AdSenseBanner format="leaderboard" slotName="Homepage Leaderboard" />
      </section>

      {/* ====================== */}
      {/* 5. CONCEPT HIGHLIGHT  */}
      {/* ====================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-[#131824] to-[#1a0f2e]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.12),transparent_50%)] " />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.10),transparent_50%)]" />
          <div className="absolute inset-0 border border-white/[0.07] rounded-3xl" />

          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold uppercase tracking-wider mb-5">
                <Headphones className="w-3.5 h-3.5" />
                Pengalaman Siar Berbeda
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-5 leading-tight">
                Harmonisasi Narasi Suara & <span className="gradient-text-vibrant">Playlist YouTube Resmi</span>
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-10 max-w-2xl">
                Ruang Siar menyajikan format penyiaran modern — broadcaster meramu narasi dan kabar terkini, sementara alunan musik dinikmati via pemutar sematan resmi YouTube. Bersih dari unduhan ilegal, menghormati hak cipta musisi.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  {
                    icon: <ShieldCheck className="w-5 h-5" />,
                    title: '100% Pemutar Resmi',
                    desc: 'Menggunakan API sematan YouTube resmi tanpa scraping atau re-hosting.',
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-500/8 border-emerald-500/20',
                  },
                  {
                    icon: <Music2 className="w-5 h-5" />,
                    title: 'Kurasi Lagu Berkualitas',
                    desc: 'Playlist disusun tematis sesuai ritme waktu dan suasana siaran.',
                    color: 'text-amber-400',
                    bg: 'bg-amber-500/8 border-amber-500/20',
                  },
                  {
                    icon: <Sparkles className="w-5 h-5" />,
                    title: 'Antarmuka Audio-Visual',
                    desc: 'Pengalaman visual berkelas dan responsif di seluruh gawai.',
                    color: 'text-purple-400',
                    bg: 'bg-purple-500/8 border-purple-500/20',
                  },
                ].map((item) => (
                  <div key={item.title} className={`p-5 rounded-2xl border ${item.bg} space-y-3`}>
                    <div className={item.color}>{item.icon}</div>
                    <div className="text-sm font-bold text-white">{item.title}</div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== */}
      {/* 6. LATEST NEWS SECTION */}
      {/* ====================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-rose-400 mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-live" />
              Kabar & Catatan Editorial
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Warta <span className="gradient-text-fire">Ruang Siar</span>
            </h2>
          </div>
          <Link
            href="/berita"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-rose-400 hover:text-rose-300 transition-colors"
          >
            <span>Semua Berita</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <NewsGrid newsList={publishedNews} />
      </section>
    </div>
  );
}
