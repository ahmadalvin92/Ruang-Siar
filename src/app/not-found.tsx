import React from 'react';
import Link from 'next/link';
import { Radio, ArrowLeft, Disc3 } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#090b10] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
          <Radio className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-white tracking-tight">404</h1>
          <h2 className="text-xl font-bold text-slate-200">Halaman Tidak Ditemukan</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Episode siaran atau halaman yang Anda tuju sedang di luar jangkauan sinyal atau telah dipindahkan.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
