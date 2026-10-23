import React from 'react';
import Link from 'next/link';
import { Users, ShieldCheck, Mail, MapPin, Award, CheckCircle2, ArrowRight, Radio, Sparkles } from 'lucide-react';
import { getSiteSettings } from '@/lib/data/store';
import type { Metadata } from 'next';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Susunan Redaksi — Ruang Siar.id',
  description: 'Struktur organisasi dan susunan dewan redaksi media radio siar kontemporer Ruang Siar.',
};

export default async function RedaksiPage() {
  const settings = await getSiteSettings();

  const defaultMembers = [
    { role: 'Pemimpin Umum / Penanggung Jawab', name: 'Sigit', bio: 'Inisiator platform dan pengarah visi penyiaran Ruang Siar.' },
    { role: 'Pemimpin Redaksi', name: 'Alvin', bio: 'Penanggung jawab keredaksian, standar jurnalistik, dan integrasi teknologi media.' },
    { role: 'Redaktur Pelaksana', name: 'Tim Editorial Ruang Siar', bio: 'Penyelaras konten warta, narasi kurasi, dan rilis harian siaran.' },
    { role: 'Kurator Musik & Broadcaster', name: 'Sigit & Rekan', bio: 'Penyusun tema, atmosfer siaran, dan seleksi playlist resmi YouTube.' },
    { role: 'Reporter & Kontributor Lapangan', name: 'Traffic Crew & Komunitas Mitra', bio: 'Laporan lalu lintas, pantauan cuaca, dan warta langsung dari lapangan.' },
  ];

  const members = (settings.redaksiMembers && settings.redaksiMembers.length > 0)
    ? settings.redaksiMembers
    : defaultMembers;

  return (
    <div className="relative min-h-screen">
      {/* Ambient background glow */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-amber-500/8 via-purple-500/4 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-black uppercase tracking-widest mb-4">
            <Users className="w-3.5 h-3.5" />
            Dewan Redaksi &amp; Struktur Organisasi
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            {settings.redaksiTitle || 'Susunan Redaksi Ruang Siar'}
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {settings.redaksiDescription ||
              'Ruang Siar dikelola secara profesional dengan mengedepankan etika jurnalistik penyiaran, kurasi musik berlisensi resmi, serta transparansi informasi publik.'}
          </p>
        </div>

        {/* Structure Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          {members.map((member, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#0d1117] border border-white/[0.08] hover:border-amber-500/30 transition-all duration-300 space-y-3 relative overflow-hidden group shadow-xl shadow-black/40"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold uppercase tracking-wider">
                  {member.role}
                </span>
                <span className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-slate-500 text-xs font-mono font-bold">
                  0{idx + 1}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                {member.name}
              </h2>

              {member.bio && (
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Kode Etik & Standar */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/40 border border-slate-800 mb-16 space-y-6">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
            <Award className="w-4 h-4" />
            Prinsip &amp; Standar Keredaksian
          </div>
          
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Komitmen Integritas Konten Ruang Siar
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Verifikasi Informasi Lapangan</strong>
                Laporan dari kontributor dan traffic crew selalu melalui pengecekan silang sebelum dipublikasikan.
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Hak Cipta Musik</strong>
                Seluruh materi audio-visual menggunakan pemutar sematan resmi YouTube untuk menjamin hak musisi.
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Independensi Editorial</strong>
                Kurasi siaran dan warta disajikan secara objektif demi kenyamanan dan wawasan pendengar setia.
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block mb-1">Koreksi &amp; Hak Jawab</strong>
                Redaksi terbuka terhadap masukan dan perbaikan data demi akurasi informasi publik.
              </div>
            </div>
          </div>
        </div>

        {/* Kontak Redaksi Strip */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">
              Hubungi Sekretariat Redaksi
            </h3>
            <p className="text-xs text-slate-400">
              Kirimkan press release, informasi lalu lintas, atau undangan peliputan ke redaksi kami.
            </p>
          </div>
          <a
            href={`mailto:${settings.contactEmail || 'redaksi@ruangsiar.id'}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 shrink-0"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Kirim Surel Redaksi</span>
          </a>
        </div>
      </div>
    </div>
  );
}
