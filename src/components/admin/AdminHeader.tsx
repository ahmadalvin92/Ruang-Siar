'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, Radio, ShieldCheck, User } from 'lucide-react';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function AdminHeader({
  title = 'Panel Kurator & Admin',
  subtitle = 'Kelola siaran, daftar putar YouTube resmi, dan warta editorial',
}: AdminHeaderProps) {
  return (
    <header className="h-20 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {title}
        </h1>
        <p className="text-xs text-slate-400 hidden sm:block">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
        >
          <Radio className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Pratinjau Situs</span>
        </Link>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-xs">
            A
          </div>
          <div className="hidden sm:block text-left text-xs">
            <div className="font-semibold text-slate-200">Admin Sigit</div>
            <div className="text-[10px] text-slate-500">Ruang Siar Studio</div>
          </div>
        </div>
      </div>
    </header>
  );
}
