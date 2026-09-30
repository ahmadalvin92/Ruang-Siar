import React from 'react';
import Link from 'next/link';
import { getDashboardStats } from '@/lib/data/store';
import AdminHeader from '@/components/admin/AdminHeader';
import { formatDateIndonesian } from '@/lib/utils';
import { YoutubeIcon } from '@/components/icons';
import {
  Radio,
  Newspaper,
  CheckCircle2,
  Clock,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  Edit,
  ShieldCheck,
  Eye,
} from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="Ringkasan Studio & Kurasi"
        subtitle="Pantau status siaran aktif, artikel berita, dan playlist YouTube resmi"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Siaran */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">Total Siaran</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Radio className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {stats.totalBroadcasts}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="text-emerald-400 font-semibold">{stats.publishedBroadcasts} Tayang</span>
              <span>•</span>
              <span className="text-amber-400">{stats.draftBroadcasts} Draf</span>
            </div>
          </div>

          {/* Card 2: Status Pemutar */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-red-500/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">Integrasi YouTube</span>
              <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
                <YoutubeIcon className="w-4 h-4 fill-current" />
              </div>
            </div>
            <div className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Embed Resmi Aktif
            </div>
            <div className="text-xs text-slate-400">
              Zero-download, patuh lisensi
            </div>
          </div>

          {/* Card 3: Total Berita */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">Total Berita</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Newspaper className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white mb-1">
              {stats.totalNews}
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="text-emerald-400 font-semibold">{stats.publishedNews} Terbit</span>
              <span>•</span>
              <span className="text-amber-400">{stats.draftNews} Draf</span>
            </div>
          </div>

          {/* Card 4: Status Database */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">Arsitektur DB</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-emerald-400 mb-1">
              PostgreSQL Ready
            </div>
            <div className="text-xs text-slate-400">
              Prisma ORM schema loaded
            </div>
          </div>
        </div>

        {/* Action Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              Siap mempublikasikan siaran baru?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Cukup masukkan URL playlist YouTube, pilih kategori, dan tuliskan catatan penyiar.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/siaran/baru"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              + Buat Siaran Baru
            </Link>
            <Link
              href="/admin/berita/baru"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
            >
              + Tulis Warta
            </Link>
          </div>
        </div>

        {/* Recent Broadcasts Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Daftar Siaran Terbaru</h2>
              <p className="text-xs text-slate-400">5 siaran paling baru ditambahkan</p>
            </div>
            <Link
              href="/admin/siaran"
              className="text-xs font-semibold text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Kelola Semua Siaran</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Judul & Kategori</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Durasi</th>
                    <th className="px-5 py-3.5">Tanggal</th>
                    <th className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stats.recentBroadcasts.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-white max-w-xs sm:max-w-md truncate">
                          {b.title}
                        </div>
                        <div className="text-[11px] text-amber-400/80">{b.category}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'Published'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">{b.duration || '-'}</td>
                      <td className="px-5 py-3.5 text-slate-400">
                        {formatDateIndonesian(b.publishedAt)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/siaran/${b.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            title="Pratinjau Publik"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/siaran/${b.id}`}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                            title="Edit Siaran"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent News Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Daftar Warta Terbaru</h2>
              <p className="text-xs text-slate-400">Artikel kabar dan catatan editorial redaksi</p>
            </div>
            <Link
              href="/admin/berita"
              className="text-xs font-semibold text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Kelola Semua Warta</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Judul & Rubrik</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Tanggal Terbit</th>
                    <th className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stats.recentNews.map((n) => (
                    <tr key={n.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-white max-w-xs sm:max-w-md truncate">
                          {n.title}
                        </div>
                        <div className="text-[11px] text-slate-500">{n.category}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            n.status === 'Published'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {n.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">
                        {formatDateIndonesian(n.publishedAt)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/berita/${n.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                            title="Pratinjau Publik"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/admin/berita/${n.id}`}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                            title="Edit Berita"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
