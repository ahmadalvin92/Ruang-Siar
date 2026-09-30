import React from 'react';
import Link from 'next/link';
import { Radio, Mail, MapPin, ExternalLink, Disc3, Zap, Heart } from 'lucide-react';
import { YoutubeIcon, InstagramIcon, TwitterIcon } from '@/components/icons';
import LogoMark from './LogoMark';

export default function Footer() {
  const year = new Date().getFullYear();

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
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <LogoMark className="w-12 h-12 rounded-xl shadow-lg shadow-black/30 group-hover:scale-105 transition-transform" />
              <div className="flex items-baseline">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">Ruang Siar</span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Platform radio siar kontemporer Indonesia. Suara hangat penyiar berpadu kurasi playlist resmi YouTube — pengalaman audio-visual yang menginspirasi setiap hari.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://youtube.com/@ruangsiar"
                target="_blank"
                rel="noreferrer"
                className="group w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-200"
                aria-label="YouTube Channel Ruang Siar"
              >
                <YoutubeIcon className="w-4 h-4 fill-current" />
              </a>
              <a
                href="https://instagram.com/ruangsiar.id"
                target="_blank"
                rel="noreferrer"
                className="group w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-pink-400 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all duration-200"
                aria-label="Instagram Ruang Siar"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/ruangsiar"
                target="_blank"
                rel="noreferrer"
                className="group w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all duration-200"
                aria-label="Twitter/X Ruang Siar"
              >
                <TwitterIcon className="w-3.5 h-3.5 fill-current" />
              </a>
            </div>

            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/8 border border-red-500/20 text-red-400 text-[11px] font-bold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-live" />
              Siaran Aktif — 24 Jam
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
              {[
                { time: '06:00 – 09:00', name: 'Pagi', color: 'text-amber-400' },
                { time: '12:00 – 14:00', name: 'Siang', color: 'text-orange-400' },
                { time: '16:30 – 19:00', name: 'Sore', color: 'text-rose-400' },
                { time: '21:00 – 23:00', name: 'Malam', color: 'text-purple-400' },
                { time: 'Khusus', name: 'Wawancara & Eksklusif', color: 'text-sky-400' },
              ].map((item) => (
                <li key={item.name} className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full bg-current shrink-0 ${item.color}`} />
                  <span className="font-mono text-[10px] text-slate-500">{item.time}</span>
                  <span className={item.color}>{item.name}</span>
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
                <span>Jakarta Selatan, Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <a
                  href="mailto:redaksi@ruangsiar.id"
                  className="hover:text-amber-400 transition-colors"
                >
                  redaksi@ruangsiar.id
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hero-accent-line w-full mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© {year} <span className="text-slate-400 font-semibold">RUANG SIAR</span>. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-2">
            <Disc3 className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
            <span>Powered by YouTube Official Embed — No illegal downloads.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
