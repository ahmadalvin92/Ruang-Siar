import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Radio, MessageSquare, Send, Clock, ShieldCheck } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, TwitterIcon } from '@/components/icons';
import { getSiteSettings } from '@/lib/data/store';
import type { Metadata } from 'next';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Hubungi Kami & Sekretariat Redaksi — Ruang Siar.id',
  description: 'Informasi kontak resmi, layanan kerjasama, kirim siaran pers, dan sekretariat redaksi Ruang Siar.',
};

export default async function KontakPage() {
  const settings = await getSiteSettings();

  const contactEmail = settings.contactEmail || 'redaksi@ruangsiar.id';
  const whatsappNumber = settings.whatsappNumber || '+62 896-3017-2935';
  const location = settings.contactLocation || 'Jakarta Selatan, Indonesia';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="relative min-h-screen">
      {/* Background glow */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-amber-500/8 via-purple-500/4 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-black uppercase tracking-widest mb-4">
            <Radio className="w-3.5 h-3.5" />
            Layanan Komunikasi &amp; Kemitraan
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-5">
            Hubungi Redaksi Ruang Siar
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Pintu komunikasi terbuka bagi musisi, komunitas, pendengar setia, maupun mitra penyiaran untuk kolaborasi dan pengiriman siaran pers.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Email Card */}
          <div className="p-6 rounded-2xl bg-[#0d1117] border border-white/[0.08] hover:border-amber-500/40 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Surel Resmi
              </span>
              <h2 className="text-base font-bold text-white mb-1.5">Sekretariat Redaksi</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Pengiriman press release, rilis album musik, dan penawaran kemitraan resmi.
              </p>
            </div>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>{contactEmail}</span>
            </a>
          </div>

          {/* WhatsApp Card */}
          <div className="p-6 rounded-2xl bg-[#0d1117] border border-white/[0.08] hover:border-emerald-500/40 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Saluran Cepat WhatsApp
              </span>
              <h2 className="text-base font-bold text-white mb-1.5">Layanan Informasi</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Informasi lalu lintas kilat, kirim laporan cuaca lokal, dan sapa penyiar siaga.
              </p>
            </div>
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>{whatsappNumber}</span>
            </a>
          </div>

          {/* Studio Location Card */}
          <div className="p-6 rounded-2xl bg-[#0d1117] border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                Lokasi Studio
              </span>
              <h2 className="text-base font-bold text-white mb-1.5">Studio &amp; Kantor Siar</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Pusat kurasi playlist harian dan studio rekaman narasi radio kontemporer.
              </p>
            </div>
            <p className="text-xs font-medium text-slate-300">
              {location}
            </p>
          </div>
        </div>

        {/* Social Media Strip */}
        <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-lg font-bold text-white">Ikuti Kanal Resmi Ruang Siar</h2>
            <p className="text-xs text-slate-400">
              Dapatkan update siaran harian, cuplikan kurasi musisi, dan warta terbaru di linimasa kami.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-pink-500/20 border border-slate-700/80 hover:border-pink-500/40 flex items-center justify-center text-slate-300 hover:text-pink-400 transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5 fill-current" />
              </a>
            )}
            {settings.youtubeUrl && (
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-red-500/20 border border-slate-700/80 hover:border-red-500/40 flex items-center justify-center text-slate-300 hover:text-red-400 transition-all"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-5 h-5 fill-current" />
              </a>
            )}
            {settings.twitterUrl && (
              <a
                href={settings.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-sky-500/20 border border-slate-700/80 hover:border-sky-500/40 flex items-center justify-center text-slate-300 hover:text-sky-400 transition-all"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-5 h-5 fill-current" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links back */}
        <div className="mt-12 text-center">
          <Link
            href="/redaksi"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
          >
            <span>Lihat Susunan Dewan Redaksi Ruang Siar</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
