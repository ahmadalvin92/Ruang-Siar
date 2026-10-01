'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Radio,
  Newspaper,
  PlusCircle,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const links = [
    {
      name: 'Ringkasan',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: 'Kelola Siaran',
      href: '/admin/siaran',
      icon: Radio,
      exact: false,
    },
    {
      name: 'Kelola Berita',
      href: '/admin/berita',
      icon: Newspaper,
      exact: false,
    },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-950/90 flex flex-col justify-between h-screen sticky top-0">
      <div className="p-6">
        {/* Brand */}
        <div className="mb-8">
          <Link href="/" className="block group focus:outline-none">
            <Image
              src="/brand/ruang-siar-logo.png"
              alt="Ruang Siar"
              width={160}
              height={38}
              priority
              className="h-8 w-auto object-contain transition-opacity group-hover:opacity-90"
            />
          </Link>
          <div className="mt-3">
            <span className="text-[10px] text-amber-400 font-bold tracking-wider uppercase inline-flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <ShieldCheck className="w-3 h-3" /> Panel Kurator
            </span>
          </div>
        </div>

        {/* Quick Create Buttons */}
        <div className="mb-6 space-y-2">
          <Link
            href="/admin/siaran/baru"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/15 transition-all duration-200 hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Siaran Baru</span>
          </Link>
          <Link
            href="/admin/berita/baru"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-semibold transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Tulis Berita Baru</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Menu Utama
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Website Link */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 text-xs text-slate-300 hover:text-white transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Lihat Web Publik</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
        </Link>
        <button onClick={logout} className="mt-2 w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-colors">
          <LogOut className="w-3.5 h-3.5" /> Keluar dari CMS
        </button>
      </div>
    </aside>
  );
}
