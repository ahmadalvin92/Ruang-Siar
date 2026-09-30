'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Broadcast, BroadcastFormData } from '@/types';
import YoutubePlayer from '@/components/YoutubePlayer';
import { parseYouTubeUrl } from '@/lib/youtube';
import { YoutubeIcon } from '@/components/icons';
import {
  Save,
  ArrowLeft,
  Radio,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Eye,
  Loader2,
  List,
  Info,
} from 'lucide-react';

interface BroadcastFormProps {
  initialData?: Broadcast;
  isEdit?: boolean;
}

export default function BroadcastForm({
  initialData,
  isEdit = false,
}: BroadcastFormProps) {
  const router = useRouter();

  // Serialize existing rundown back to text for editing
  const serializeRundown = (rundown: Broadcast['rundown']): string => {
    if (!rundown || rundown.length === 0) return '';
    return rundown
      .map((r) => {
        const artist = r.artistOrSpeaker ? ` (${r.artistOrSpeaker})` : '';
        return `${r.time} - ${r.title}${artist}`;
      })
      .join('\n');
  };

  const [formData, setFormData] = useState<BroadcastFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    youtubePlaylistUrl: initialData?.youtubePlaylistUrl || '',
    thumbnailUrl: initialData?.thumbnailUrl || '',
    category: initialData?.category || 'Siaran Pagi',
    duration: initialData?.duration || '45 Menit',
    status: initialData?.status || 'Published',
    publishedAt: initialData?.publishedAt || new Date().toISOString(),
    rundownText: serializeRundown(initialData?.rundown),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Parse YouTube URL in real-time
  const parsedYouTube = parseYouTubeUrl(formData.youtubePlaylistUrl);

  // Auto-fill thumbnail from YouTube if empty and available
  const handleAutoThumbnail = () => {
    if (parsedYouTube.defaultThumbnail) {
      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: parsedYouTube.defaultThumbnail!,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.title.trim()) {
      setErrorMessage('Judul siaran wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    if (!formData.youtubePlaylistUrl.trim()) {
      setErrorMessage('URL Playlist YouTube wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    if (!parsedYouTube.isValid || parsedYouTube.type !== 'playlist') {
      setErrorMessage('Masukkan link playlist YouTube yang valid, bukan link satu video.');
      setIsSubmitting(false);
      return;
    }

    try {
      const endpoint = isEdit
        ? `/api/broadcasts/${initialData?.id}`
        : '/api/broadcasts';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Terjadi kesalahan saat menyimpan data');
      }

      setSuccessMessage(
        isEdit ? 'Siaran berhasil diperbarui!' : 'Siaran baru berhasil dibuat!'
      );

      setTimeout(() => {
        router.push('/admin/siaran');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan siaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Alert Notifications */}
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
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
              <Info className="w-4 h-4" />
              Urutan produksi siaran
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 leading-relaxed">
              <li>Rekam suara penyiar (misalnya sapaan Bang Rey) dalam MP3.</li>
              <li>Gabungkan suara dengan foto studio di Filmora, lalu render menjadi MP4.</li>
              <li>Upload MP4 siaran ke YouTube, kemudian letakkan sebagai video pertama dalam playlist.</li>
              <li>Tambahkan lagu-lagu YouTube setelahnya, lalu tempel <strong className="text-white">link playlist</strong> di formulir ini.</li>
            </ol>
            <p className="text-[11px] text-amber-200/75">Website hanya memutar playlist resmi YouTube—tidak mengunggah MP3/MP4 atau lagu ke server Ruang Siar.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              Informasi Pokok Siaran
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Judul Siaran <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Ruang Siar Pagi: Irama Pagi Nusantara"
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
                Slug URL (Opsional, otomatis dibuat dari judul)
              </label>
              <input
                type="text"
                placeholder="ruang-siar-pagi"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full px-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Deskripsi & Narasi Broadcaster <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Tuliskan ulasan tema siaran, informasi penyiar, dan kurasi suasana siaran..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {/* YouTube Playlist URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  URL Playlist YouTube <span className="text-red-400">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  Video tunggal tidak dapat digunakan
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/playlist?list=PL..."
                  value={formData.youtubePlaylistUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, youtubePlaylistUrl: e.target.value })
                  }
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Salin link playlist setelah MP4 siaran ditempatkan di urutan pertama. Sistem tidak menerima link satu video.
              </p>
            </div>

            {/* Thumbnail URL */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  URL Gambar Sampul (Thumbnail)
                </label>
                {parsedYouTube.defaultThumbnail && (
                  <button
                    type="button"
                    onClick={handleAutoThumbnail}
                    className="text-[11px] font-semibold text-amber-400 hover:underline"
                  >
                    Gunakan Thumbnail YouTube Otomatis
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={formData.thumbnailUrl}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnailUrl: e.target.value })
                }
                className="w-full px-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Rundown / Tracklist */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-1">
                  <List className="w-4 h-4 text-amber-400" />
                  Rundown & Tracklist (Opsional)
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Format per baris: <code className="text-amber-400 bg-slate-950 px-1 py-0.5 rounded">00:00 - Judul Konten (Nama Penyiar/Artis)</code>
                </p>
              </div>
            </div>

            <textarea
              rows={7}
              placeholder={`Contoh:
00:00 - Pembukaan Siaran Pagi (Bang Rey)
03:15 - Rindu Ini (Sheila on 7)
07:40 - Kabar Pagi Nusantara (Bang Rey)
12:20 - Senja (Isyana Sarasvati)
16:00 - Penutup & Salam (Bang Rey)`}
              value={formData.rundownText || ''}
              onChange={(e) =>
                setFormData({ ...formData, rundownText: e.target.value })
              }
              className="w-full px-4 py-3 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 leading-relaxed font-mono resize-y min-h-[140px]"
            />

            <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Rundown akan tampil sebagai tracklist interaktif di halaman siaran publik. Setiap baris diparse otomatis oleh sistem.
              </p>
            </div>
          </div>

          {/* Categorization & Status */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kategori Program
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
              >
                <option value="Siaran Pagi">Siaran Pagi</option>
                <option value="Siaran Siang">Siaran Siang</option>
                <option value="Siaran Sore">Siaran Sore</option>
                <option value="Siaran Malam">Siaran Malam</option>
                <option value="Wawancara">Wawancara</option>
                <option value="Spesial Musik">Spesial Musik</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Estimasi Durasi
              </label>
              <input
                type="text"
                placeholder="Contoh: 45 Menit"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Status Publikasi
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
                <option value="Published">Tayang (Published)</option>
                <option value="Draft">Draf</option>
                <option value="Archived">Diarsipkan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Realtime YouTube Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-28 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <YoutubeIcon className="w-4 h-4 text-red-500 fill-current" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Pratinjau Pemutar Langsung
                  </h3>
                </div>
                {parsedYouTube.isValid && parsedYouTube.type === 'playlist' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    URL Valid
                  </span>
                )}
              </div>

              {/* Instant Player Preview */}
              <div className="overflow-hidden rounded-xl">
                <YoutubePlayer
                  playlistUrl={formData.youtubePlaylistUrl}
                  title={formData.title || 'Pratinjau'}
                />
              </div>

              {/* Real-time Metadata Preview */}
              <div className="space-y-2 pt-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Tipe Input:</span>
                  <span className="text-slate-200 font-semibold uppercase">
                    {parsedYouTube.type}
                  </span>
                </div>
                {parsedYouTube.playlistId && (
                  <div className="flex justify-between">
                    <span>ID Playlist:</span>
                    <span className="text-amber-400 font-mono text-[11px]">
                      {parsedYouTube.playlistId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/admin/siaran"
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
                    <span>{isEdit ? 'Simpan Perubahan' : 'Terbitkan Siaran'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
