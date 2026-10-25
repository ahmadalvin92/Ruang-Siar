'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { News } from '@/types';
import { formatDateTimeIndonesian } from '@/lib/utils';
import {
  Edit,
  Trash2,
  Eye,
  PlusCircle,
  Search,
  CheckCircle,
  AlertTriangle,
  Newspaper,
  RotateCcw,
  Archive,
  Inbox,
} from 'lucide-react';

interface NewsTableClientProps {
  initialNews: News[];
  isTrashView?: boolean;
}

export default function NewsTableClient({
  initialNews,
  isTrashView = false,
}: NewsTableClientProps) {
  const [newsList, setNewsList] = useState<News[]>(
    isTrashView
      ? initialNews.filter((n) => n.status === 'Archived')
      : initialNews
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'Published' | 'Scheduled' | 'Draft' | 'Archived'>(
    isTrashView ? 'Archived' : 'all'
  );
  const [permanentDeletingItem, setPermanentDeletingItem] = useState<News | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  // Sync newsList when initialNews updates from server revalidation
  useEffect(() => {
    setNewsList(isTrashView ? initialNews.filter((n) => n.status === 'Archived') : initialNews);
  }, [initialNews, isTrashView]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Toggle status between Published and Draft
  const handleToggleStatus = async (item: News) => {
    if (item.status === 'Archived') return;
    setIsProcessing(true);
    const newStatus = item.status === 'Published' ? 'Draft' : 'Published';
    try {
      const res = await fetch(`/api/news/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setNewsList((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, status: newStatus } : n))
        );
        showToast(
          `Status warta "${item.title}" diubah menjadi ${newStatus === 'Published' ? 'Terbit' : 'Draf'}`
        );
        router.refresh();
      } else {
        alert(data.error || 'Gagal mengubah status');
      }
    } catch {
      alert('Terjadi kesalahan jaringan');
    } finally {
      setIsProcessing(false);
    }
  };

  // Move to Recycle Bin (Soft Delete)
  const handleSoftDelete = async (item: News) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/news/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Archived' }),
      });
      const data = await res.json();
      if (data.success) {
        setNewsList((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, status: 'Archived' } : n))
        );
        showToast(`Warta "${item.title}" dipindahkan ke Tempat Sampah`);
        router.refresh();
      } else {
        alert(data.error || 'Gagal memindahkan warta ke Tempat Sampah');
      }
    } catch {
      alert('Terjadi kesalahan jaringan');
    } finally {
      setIsProcessing(false);
    }
  };

  // Restore from Recycle Bin
  const handleRestore = async (item: News) => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/news/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Draft' }), // Restores to Draft
      });
      const data = await res.json();
      if (data.success) {
        if (isTrashView) {
          // Remove from trash list
          setNewsList((prev) => prev.filter((n) => n.id !== item.id));
        } else {
          setNewsList((prev) =>
            prev.map((n) => (n.id === item.id ? { ...n, status: 'Draft' } : n))
          );
        }
        showToast(`Warta "${item.title}" berhasil dipulihkan ke status Draf`);
        router.refresh();
      } else {
        alert(data.error || 'Gagal memulihkan warta');
      }
    } catch {
      alert('Terjadi kesalahan jaringan');
    } finally {
      setIsProcessing(false);
    }
  };

  // Permanent Delete
  const handlePermanentDelete = async () => {
    if (!permanentDeletingItem) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/news/${permanentDeletingItem.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setNewsList((prev) => prev.filter((n) => n.id !== permanentDeletingItem.id));
        showToast(`Warta "${permanentDeletingItem.title}" berhasil dihapus permanen`);
        setPermanentDeletingItem(null);
        router.refresh();
      } else {
        alert(data.error || 'Gagal menghapus warta permanen');
      }
    } catch {
      alert('Terjadi kesalahan jaringan');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to determine if an article is scheduled for the future
  const isScheduled = (n: News) =>
    n.status === 'Published' && new Date(n.publishedAt).getTime() > Date.now();

  // Counts for tabs
  const scheduledCount = newsList.filter(isScheduled).length;
  const livePublishedCount = newsList.filter(
    (n) => n.status === 'Published' && !isScheduled(n)
  ).length;
  const draftCount = newsList.filter((n) => n.status === 'Draft').length;
  const archivedCount = newsList.filter((n) => n.status === 'Archived').length;
  const activeCount = newsList.filter((n) => n.status !== 'Archived').length;

  const filtered = newsList.filter((n) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      n.title.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q) ||
      n.slug.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (isTrashView) {
      return n.status === 'Archived';
    }

    if (activeTab === 'all') {
      return n.status !== 'Archived';
    }
    if (activeTab === 'Published') {
      return n.status === 'Published' && !isScheduled(n);
    }
    if (activeTab === 'Scheduled') {
      return isScheduled(n);
    }
    if (activeTab === 'Draft') {
      return n.status === 'Draft';
    }
    if (activeTab === 'Archived') {
      return n.status === 'Archived';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar: Filter Tabs or Trash Info */}
      {!isTrashView ? (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>Semua Aktif</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'all' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                {activeCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('Published')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'Published'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Terbit</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'Published' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                {livePublishedCount}
              </span>
            </button>

            {scheduledCount > 0 && (
              <button
                onClick={() => setActiveTab('Scheduled')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'Scheduled'
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'bg-slate-900 text-sky-400 hover:text-sky-300 border border-sky-500/30'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                <span>Terjadwal</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'Scheduled' ? 'bg-slate-950/20 text-slate-950' : 'bg-sky-950/60 text-sky-300'}`}>
                  {scheduledCount}
                </span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('Draft')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'Draft'
                  ? 'bg-amber-500/90 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Draf</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeTab === 'Draft' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                {draftCount}
              </span>
            </button>

            <Link
              href="/admin/sampah"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-slate-900 text-slate-400 hover:text-red-400 border border-slate-800"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Tempat Sampah</span>
              {archivedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-red-500/20 text-red-400">
                  {archivedCount}
                </span>
              )}
            </Link>
          </div>

          <Link
            href="/admin/berita/baru"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/15 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tulis Berita Baru</span>
          </Link>
        </div>
      ) : (
        /* Trash view top bar */
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-bold flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5" />
              Tempat Sampah Warta
            </span>
            <span>Total: <strong className="text-white">{filtered.length}</strong> artikel</span>
          </div>

          <Link
            href="/admin/berita"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Kembali ke Warta Aktif
          </Link>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Cari berita berdasarkan judul atau kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
        />
      </div>

      {/* News Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">Judul & Ringkasan</th>
                <th className="px-5 py-4">Kategori</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">{isTrashView ? 'Terakhir Diperbarui' : 'Tanggal Rilis'}</th>
                <th className="px-5 py-4 text-right">Kelola & Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    {isTrashView ? (
                      <div className="flex flex-col items-center justify-center gap-2 py-4">
                        <Inbox className="w-8 h-8 text-slate-600" />
                        <span className="font-semibold text-slate-400">Tempat Sampah Warta Kosong</span>
                        <span className="text-xs text-slate-500">Tidak ada artikel berita di tempat sampah. Semua data warta aktif.</span>
                      </div>
                    ) : (
                      'Tidak ada berita yang sesuai dengan pencarian atau filter status.'
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const isArchived = item.status === 'Archived';
                  return (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-9 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                            {item.thumbnailUrl ? (
                              <Image
                                src={item.thumbnailUrl}
                                alt={item.title}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-700">
                                <Newspaper className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <div className="font-bold text-white truncate text-sm">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">
                              {item.excerpt}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium text-[11px] border border-slate-700/50">
                          {item.category}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {isArchived ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                            <Archive className="w-3 h-3" />
                            Di Tempat Sampah
                          </span>
                        ) : isScheduled(item) ? (
                          <button
                            onClick={() => handleToggleStatus(item)}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20"
                            title="Warta dijadwalkan tayang di masa depan. Klik untuk ubah ke Draf."
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                            Terjadwal
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleStatus(item)}
                            disabled={isProcessing}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                              item.status === 'Published'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                            }`}
                            title="Klik untuk beralih status terbit / draf"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                item.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                            />
                            {item.status === 'Published' ? 'Terbit' : 'Draf'}
                          </button>
                        )}
                      </td>

                      <td className="px-5 py-4 text-slate-400 text-xs font-mono">
                        {formatDateTimeIndonesian(item.publishedAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          {isArchived ? (
                            <>
                              {/* Reader Count in Trash */}
                              <div
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs"
                                title={`${(item.views || 0).toLocaleString('id-ID')} kali dibaca sebelum dihapus`}
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-500" />
                                <span className="font-bold text-[11px]">{(item.views || 0).toLocaleString('id-ID')}</span>
                              </div>

                              {/* Restore Button */}
                              <button
                                onClick={() => handleRestore(item)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 font-semibold transition-all hover:scale-105 active:scale-95 text-xs shadow-sm"
                                title="Pulihkan kembali ke status Draf"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Pulihkan</span>
                              </button>

                              {/* Permanent Delete Button */}
                              <button
                                onClick={() => setPermanentDeletingItem(item)}
                                disabled={isProcessing}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 font-semibold transition-all hover:scale-105 active:scale-95 text-xs shadow-sm"
                                title="Hapus Permanen dari Database"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Hapus Permanen</span>
                              </button>
                            </>
                          ) : (
                            <>
                              {/* Preview Public & Reader Count Symbol */}
                              <Link
                                href={`/berita/${item.slug}`}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 border border-sky-500/25 hover:border-sky-500/40 transition-all font-mono text-xs font-semibold group shadow-sm"
                                title={`${(item.views || 0).toLocaleString('id-ID')} pembaca (diklik/dibaca) • Klik untuk pratinjau publik`}
                              >
                                <Eye className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
                                <span className="text-[11px] font-bold">{(item.views || 0).toLocaleString('id-ID')}</span>
                              </Link>

                              {/* Edit Button */}
                              <Link
                                href={`/admin/berita/${item.id}`}
                                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                                title="Edit Berita"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Link>

                              {/* Soft Delete to Recycle Bin */}
                              <button
                                onClick={() => handleSoftDelete(item)}
                                disabled={isProcessing}
                                className="p-2 rounded-lg bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                                title="Pindahkan ke Tempat Sampah"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permanent Delete Confirmation Modal */}
      {permanentDeletingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-red-500/40 p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Hapus Warta Secara Permanen
                </h3>
                <p className="text-xs text-slate-400">Tindakan ini tidak dapat dipulihkan</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
              Artikel <span className="font-bold text-white">&quot;{permanentDeletingItem.title}&quot;</span> akan dihapus selamanya dari database MySQL server.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPermanentDeletingItem(null)}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handlePermanentDelete}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-lg shadow-red-500/20"
              >
                {isProcessing ? 'Menghapus...' : 'Ya, Hapus Permanen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
