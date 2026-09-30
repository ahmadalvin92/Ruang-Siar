'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { News, NewsFormData } from '@/types';
import {
  Save,
  ArrowLeft,
  Newspaper,
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface NewsFormProps {
  initialData?: News;
  isEdit?: boolean;
}

export default function NewsForm({ initialData, isEdit = false }: NewsFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<NewsFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    thumbnailUrl: initialData?.thumbnailUrl || '',
    category: initialData?.category || 'Kabar Musik',
    status: initialData?.status || 'Published',
    publishedAt: initialData?.publishedAt || new Date().toISOString(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.title.trim()) {
      setErrorMessage('Judul berita wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.excerpt.trim()) {
      setErrorMessage('Ringkasan warta wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.content.trim()) {
      setErrorMessage('Konten artikel berita wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    try {
      const endpoint = isEdit
        ? `/api/news/${initialData?.id}`
        : '/api/news';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Gagal menyimpan berita');
      }

      setSuccessMessage(
        isEdit ? 'Artikel berhasil diperbarui!' : 'Berita baru berhasil diterbitkan!'
      );

      setTimeout(() => {
        router.push('/admin/berita');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan berita.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Alert Banners */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-amber-400" />
              Konten Warta & Artikel
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Judul Artikel <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Peta Baru Musik Digital Indonesia..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Slug URL (Opsional, otomatis dari judul)
              </label>
              <input
                type="text"
                placeholder="peta-baru-musik-digital-indonesia"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full px-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Ringkasan / Excerpt <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="Ringkasan singkat yang akan ditampilkan pada kartu berita..."
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Isi Lengkap Berita <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={9}
                required
                placeholder="Tuliskan naskah warta lengkap di sini. Pisahkan paragraf dengan baris baru ganda..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
              />
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                URL Gambar Sampul
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.thumbnailUrl}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnailUrl: e.target.value })
                }
                className="w-full px-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Live Card Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Pengaturan Penerbitan
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kategori Rubrik
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
              >
                <option value="Kabar Musik">Kabar Musik</option>
                <option value="Media & Tren">Media & Tren</option>
                <option value="Budaya & Seni">Budaya & Seni</option>
                <option value="Teknologi">Teknologi</option>
                <option value="Editorial">Editorial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Status Warta
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none font-semibold text-amber-400"
              >
                <option value="Published">Terbit (Published)</option>
                <option value="Draft">Draf</option>
                <option value="Archived">Diarsipkan</option>
              </select>
            </div>
          </div>

          {/* Live Thumbnail Preview */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pratinjau Sampul
            </h4>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              {formData.thumbnailUrl ? (
                <Image
                  src={formData.thumbnailUrl}
                  alt="Pratinjau"
                  fill
                  sizes="300px"
                  className="object-cover"
                />
              ) : (
                <span className="text-xs text-slate-600">Belum ada gambar</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/berita"
              className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold text-center transition-colors"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? 'Simpan Berita' : 'Terbitkan Warta'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
