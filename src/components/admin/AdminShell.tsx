'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ExternalLink, LayoutDashboard, LogOut, Menu, Newspaper, Radio, X } from 'lucide-react';
import Image from 'next/image';
import AdminSidebar from '@/components/admin/AdminSidebar';

const links = [
  { name: 'Ringkasan', href: '/admin', icon: LayoutDashboard },
  { name: 'Kelola Siaran', href: '/admin/siaran', icon: Radio },
  { name: 'Kelola Berita', href: '/admin/berita', icon: Newspaper },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col md:flex-row">
      <div className="hidden md:block"><AdminSidebar /></div>
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/brand/ruang-siar-logo.png"
            alt="Ruang Siar"
            width={130}
            height={30}
            className="h-7 w-auto object-contain"
          />
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
            CMS
          </span>
        </Link>

        <div className="flex items-center gap-1"><Link href="/" target="_blank" className="p-2 text-slate-400" title="Lihat website"><ExternalLink className="w-4 h-4" /></Link><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button></div>
      </div>
      {mobileMenuOpen && <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-2">{links.map((link) => { const Icon = link.icon; const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href)); return <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold ${active ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-900'}`}><Icon className="w-4 h-4" />{link.name}</Link>; })}<button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"><LogOut className="w-4 h-4" />Keluar</button></div>}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}
