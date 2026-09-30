'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { News } from '@/types';
import { formatDateIndonesian } from '@/lib/utils';
import {
  Edit,
  Trash2,
  Eye,
  PlusCircle,
  Search,
  CheckCircle,
  AlertTriangle,
  Newspaper,
} from 'lucide-react';

interface NewsTableClientProps {
  initialNews: News[];
}

export default function NewsTableClient({ initialNews }: NewsTableClientProps) {
  const [newsList, setNewsList] = useState<News[]>(initialNews);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleToggleStatus = async (item: News) => {
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
          `Status warta "${item.title}" diubah menjadi ${newStatus === 'Published' ? 'Terbit (Published)' : 'Draf'}`
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

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/news/${deletingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setNewsList((prev) => prev.filter((n) => n.id !== deletingId));
        showToast('Berita berhasil dihapus');
        setDeletingId(null);
        router.refresh();
      } else {
        alert(data.error || 'Gagal menghapus berita');
      }
    } catch {
      alert('Terjadi kesalahan jaringan');
    } finally {
      setIsProcessing(false);
    }
  };

  const filtered = newsList.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'Semua' || n.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Action Header & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cari artikel warta atau rubrik..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 text-slate-300 focus:outline-none"
          >
            <option value="Semua">Semua Status</option>
            <option value="Published">Terbit (Published)</option>
            <option value="Draft">Draf</option>
            <option value="Archived">Diarsipkan</option>
          </select>
        </div>

        <Link
          href="/admin/berita/baru"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/15 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tulis Berita Baru</span>
        </Link>
      </div>

      {/* News Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">Judul Artikel</th>
                <th className="px-5 py-4">Rubrik / Kategori</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Tanggal Terbit</th>
                <th className="px-5 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    Tidak ada berita yang ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                          {item.thumbnailUrl ? (
                            <Image
                              src={item.thumbnailUrl}
                              alt={item.title}
                              fill
                              sizes="48px"
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
                      <span className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 font-medium text-[11px] border border-slate-800">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        disabled={isProcessing}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          item.status === 'Published'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                        }`}
                        title="Klik untuk ubah status publikasi"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        {item.status === 'Published' ? 'Terbit' : 'Draf'}
                      </button>
                    </td>

                    <td className="px-5 py-4 text-slate-400">
                      {formatDateIndonesian(item.publishedAt)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/berita/${item.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                          title="Pratinjau Artikel"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/admin/berita/${item.id}`}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                          title="Edit Artikel"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => setDeletingId(item.id)}
                          className="p-2 rounded-lg bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                          title="Hapus Artikel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                Konfirmasi Hapus Berita
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus artikel berita ini? Berita akan dihapus secara permanen dari sistem.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isProcessing}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-lg shadow-red-500/20"
              >
                {isProcessing ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
