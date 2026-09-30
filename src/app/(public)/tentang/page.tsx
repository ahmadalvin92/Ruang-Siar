import React from 'react';
import Link from 'next/link';
import { Radio, ShieldCheck, Music, Sparkles, Heart, CheckCircle2, ArrowRight } from 'lucide-react';
import { YoutubeIcon } from '@/components/icons';

export const metadata = {
  title: 'Tentang Ruang Siar',
  description: 'Mengenal visi, konsep, dan filosofi media siar kontemporer Ruang Siar.',
};

export default function TentangPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Radio className="w-3.5 h-3.5" />
          Filosofi & Visi Platform
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6">
          Mendefinisikan Ulang Pengalaman Radio Siar di Era Digital
        </h1>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Ruang Siar lahir dari kerinduan akan kehangatan suara penyiar radio yang dipadukan secara elegan dengan katalog musik tak terbatas dari YouTube resmi.
        </p>
      </div>

      {/* 3 Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Narasi Bermakna</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Penyiar memandu pendengar dengan kabar terkini, obrolan hangat, dan konteks cerita di balik setiap pemilihan lagu.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center font-bold">
            <YoutubeIcon className="w-5 h-5 fill-current" />
          </div>
          <h3 className="text-lg font-bold text-white">100% Pemutar Resmi</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Tidak ada pengunduhan file, konversi suara, atau re-hosting data. Semua lagu disajikan via pemutar sematan resmi YouTube.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Hormati Hak Cipta</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Setiap kali pemutar diputar, metrik tontonan dan royalti langsung tercatat resmi bagi sang musisi di kanal aslinya.
          </p>
        </div>
      </div>

      {/* How it works for broadcaster & admin */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/40 border border-slate-800 mb-16 space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Bagaimana Ruang Siar Bekerja?
        </h2>
        
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">1. Kurasi Playlist:</strong> Broadcaster atau kurator menyiapkan playlist lagu tematik di YouTube yang cocok dengan tema siaran (misalnya: Pagi Santai, Senja Akustik, dsb).
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">2. Input Melalui CMS:</strong> Melalui portal admin Ruang Siar, pengelola cukup memasukkan tautan playlist YouTube, judul siaran, serta catatan penyiaran.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">3. Tampilan Audio-Visual Mewah:</strong> Website otomatis mengekstrak identifier pemutar, menampilkan pemutar 16:9 responsif berkelas, dan menyajikannya secara mulus kepada seluruh pendengar.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center space-y-4">
        <h3 className="text-xl font-bold text-white">
          Siap mendengarkan program siaran hari ini?
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/siaran"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-colors"
          >
            <span>Dengarkan Siaran Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-sm font-semibold transition-colors"
          >
            <span>Masuk ke Panel Pengelola</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
