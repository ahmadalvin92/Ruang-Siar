import React from 'react';
import { getBroadcasts, getNewsList } from '@/lib/data/store';
import AdminHeader from '@/components/admin/AdminHeader';
import BroadcastTableClient from '@/components/admin/BroadcastTableClient';
import NewsTableClient from '@/components/admin/NewsTableClient';
import { Archive, Radio, Newspaper } from 'lucide-react';

export const revalidate = 0;

export default async function AdminRecycleBinPage() {
  const allBroadcasts = await getBroadcasts({ includeFuture: true });
  const allNews = await getNewsList({ includeFuture: true });

  const archivedBroadcasts = allBroadcasts.filter((b) => b.status === 'Archived');
  const archivedNews = allNews.filter((n) => n.status === 'Archived');

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="Tempat Sampah (Recycle Bin)"
        subtitle="Daftar siaran dan warta yang dihapus sementara. Anda dapat memulihkannya kembali atau menghapusnya secara permanen."
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-10">
        {/* Banner Info */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <Archive className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-white">Sistem Backup & Soft Delete:</span> Data di halaman ini adalah siaran dan warta yang telah dipindahkan ke tempat sampah dan tidak tayang di website publik. Klik <span className="font-semibold text-emerald-400">Pulihkan</span> untuk mengembalikannya ke status Draf, atau <span className="font-semibold text-red-400">Hapus Permanen</span> untuk melenyapkannya dari database server.
          </div>
        </div>

        {/* Siaran in Recycle Bin */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Radio className="w-4 h-4 text-amber-400" />
            <span>Siaran di Tempat Sampah ({archivedBroadcasts.length})</span>
          </div>
          <BroadcastTableClient initialBroadcasts={archivedBroadcasts} isTrashView={true} />
        </section>

        {/* Berita in Recycle Bin */}
        <section className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
            <Newspaper className="w-4 h-4 text-amber-400" />
            <span>Warta / Berita di Tempat Sampah ({archivedNews.length})</span>
          </div>
          <NewsTableClient initialNews={archivedNews} isTrashView={true} />
        </section>
      </div>
    </div>
  );
}
