'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Menu, X } from 'lucide-react';
import LogoMark from './LogoMark';

const EqualiserIcon = () => (
  <div className="equalizer">
    <div className="equalizer-bar wave-bar-1" style={{ height: 8 }} />
    <div className="equalizer-bar wave-bar-2" style={{ height: 14 }} />
    <div className="equalizer-bar wave-bar-3" style={{ height: 20 }} />
    <div className="equalizer-bar wave-bar-4" style={{ height: 10 }} />
    <div className="equalizer-bar wave-bar-5" style={{ height: 16 }} />
  </div>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Siaran', href: '/siaran' },
    { name: 'Berita', href: '/berita' },
    { name: 'Tentang', href: '/tentang' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 glass-nav">
      {/* Top accent line */}
      <div className="hero-accent-line w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <LogoMark className="w-12 h-12 rounded-xl shadow-lg shadow-black/40 group-hover:scale-105 transition-all duration-300" priority />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="flex items-baseline">
                  <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">Ruang Siar</span>
                </div>
                <div className="hidden sm:flex">
                  <EqualiserIcon />
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase hidden sm:inline-block">
                Radio & Media Audio-Visual
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] p-1.5 rounded-2xl border border-white/[0.06] backdrop-blur-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block w-24" aria-hidden="true" />

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-[#06080f]/98 backdrop-blur-xl px-4 pt-4 pb-6 space-y-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isActive(link.href)
                  ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
