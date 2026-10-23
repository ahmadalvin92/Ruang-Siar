import React from 'react';
import Link from 'next/link';
import { Radio, Mail, MapPin, ExternalLink, Disc3, Zap, Heart, Globe } from 'lucide-react';
import Image from 'next/image';
import { YoutubeIcon, InstagramIcon, TwitterIcon } from '@/components/icons';
import { getSiteSettings } from '@/lib/data/store';

export default async function Footer() {
  const year = new Date().getFullYear();
  const settings = await getSiteSettings();

  return (
    <footer className="relative border-t border-white/[0.06] bg-gradient-to-b from-[#06080f] to-[#040609] pt-16 pb-10 mt-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-t from-amber-500/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-[400px] h-[200px] bg-gradient-to-br from-purple-500/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-gradient-to-bl from-rose-500/4 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block group focus:outline-none">
              <Image
                src="/brand/ruang-siar-logo.png"
                alt="Ruang Siar — Ada Untuk Anda"
                width={175}
                height={41}
                className="h-10 w-auto object-contain transition-all duration-300 group-hover:opacity-90 group-hover:scale-[1.02]"
              />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings.siteDescription}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-1">
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-200"
                  aria-label="YouTube Channel Ruang Siar"
                >
                  <YoutubeIcon className="w-4 h-4 fill-current" />
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all duration-200"
                  aria-label="Instagram Ruang Siar"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {settings.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all duration-200"
                  aria-label="Twitter/X Ruang Siar"
                >
                  <TwitterIcon className="w-3.5 h-3.5 fill-current" />
                </a>
              )}
            </div>

            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/8 border border-red-500/20 text-red-400 text-[11px] font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-live" />
              {settings.activeStatusText || 'Siaran Aktif — 24 Jam'}
            </div>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-amber-400 mb-5">
              Jelajahi
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/siaran', label: 'Semua Siaran' },
                { href: '/berita', label: 'Kabar & Berita' },
                { href: '/tentang', label: 'Tentang Kami' },
                { href: '/redaksi', label: 'Susunan Redaksi' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2.5 h-px bg-amber-500 transition-all duration-200 overflow-hidden" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Jadwal Siar */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-amber-400 mb-5">
              Jadwal Siar
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              {(settings.schedules || []).map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full bg-current shrink-0 ${item.color || 'text-amber-400'}`} />
                  <span className="font-mono text-[10px] text-slate-500">{item.time}</span>
                  <span className={item.color || 'text-amber-400'}>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-amber-400 mb-5">
              Kontak
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{settings.contactLocation || 'Jakarta Selatan, Indonesia'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <a
                  href={`mailto:${settings.contactEmail || 'redaksi@ruangsiar.id'}`}
                  className="hover:text-amber-400 transition-colors"
                >
                  {settings.contactEmail || 'redaksi@ruangsiar.id'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        {/* Legal & Compliance Links (AdSense Compliance) */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-5 text-xs text-slate-400 mb-6 pb-6 border-b border-slate-800/60 font-medium">
          <Link href="/tentang" className="hover:text-amber-400 transition-colors">
            Tentang Kami
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/redaksi" className="hover:text-amber-400 transition-colors">
            Susunan Redaksi
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/kebijakan-privasi" className="hover:text-amber-400 transition-colors">
            Kebijakan Privasi
          </Link>
          <span className="text-slate-700">•</span>
          <Link href="/syarat-ketentuan" className="hover:text-amber-400 transition-colors">
            Syarat &amp; Ketentuan
          </Link>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-4">
            <p>© {year} <span className="text-slate-400 font-semibold">RUANG SIAR</span>. Hak Cipta Dilindungi.</p>
            <span className="hidden sm:inline text-slate-700">•</span>
            <a
              href="https://vinsky-techfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all duration-200 group"
              title="Kunjungi Portofolio Alvin"
            >
              <Globe className="w-3.5 h-3.5 text-amber-500 group-hover:rotate-45 transition-transform duration-300" />
              <span>Developed by <span className="text-slate-200 group-hover:text-amber-300 font-bold">Alvin</span></span>
            </a>
          </div>

          <p className="flex items-center gap-2 text-slate-500">
            <Disc3 className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
            <span>Powered by YouTube Official Embed — No illegal downloads.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
