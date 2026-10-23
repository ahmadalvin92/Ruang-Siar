'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  RefreshCw,
  Music2,
  Wand2,
  Plus,
  Upload,
  Calendar,
  Image as ImageIcon,
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

  // Auto-fetch state
  const [isFetchingPlaylist, setIsFetchingPlaylist] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [trackCount, setTrackCount] = useState<number | null>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(!isEdit);
  const [lastFetchedRundown, setLastFetchedRundown] = useState<string>('');
  const [lastFetchedPlaylistTitle, setLastFetchedPlaylistTitle] = useState<string>('');

  // AI Broadcast Generator state
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [aiHistoryStack, setAiHistoryStack] = useState<BroadcastFormData[]>([]);
  const [customAiNotes, setCustomAiNotes] = useState('');

  // Thumbnail upload state
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse YouTube URL in real-time
  const parsedYouTube = parseYouTubeUrl(formData.youtubePlaylistUrl);
  const prevPlaylistIdRef = useRef<string | null>(isEdit ? parsedYouTube.playlistId : null);
  const userHasEditedTitleRef = useRef<boolean>(isEdit ? true : false);

  // Datetime-local formatter helper
  const toDatetimeLocal = (isoString?: string): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // Quick preset helper for publishedAt (e.g. ojol report backdating)
  const setPublishTimePreset = (type: 'now' | 'minus1h' | 'minus2h' | 'morning7') => {
    const d = new Date();
    if (type === 'minus1h') {
      d.setHours(d.getHours() - 1);
    } else if (type === 'minus2h') {
      d.setHours(d.getHours() - 2);
    } else if (type === 'morning7') {
      d.setHours(7, 0, 0, 0);
    }
    setFormData((prev) => ({ ...prev, publishedAt: d.toISOString() }));
  };

  // Direct file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingThumb(true);
    setUploadError(null);

    try {
      const body = new FormData();
      body.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Gagal mengunggah foto');
      }

      setFormData((prev) => ({ ...prev, thumbnailUrl: result.url }));
    } catch (err: any) {
      setUploadError(err.message || 'Gagal mengunggah foto');
    } finally {
      setIsUploadingThumb(false);
    }
  };

  // Auto-fetch when a valid NEW playlist URL is entered (only if autoSync is enabled and not initial edit)
  useEffect(() => {
    if (!autoSyncEnabled) return;
    const currentId = parsedYouTube.playlistId;
    if (!currentId || currentId === prevPlaylistIdRef.current) return;
    if (parsedYouTube.type !== 'playlist') return;

    prevPlaylistIdRef.current = currentId;
    handleFetchPlaylist(currentId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedYouTube.playlistId, autoSyncEnabled]);

  const handleFetchPlaylist = async (overrideId?: string) => {
    const playlistId = overrideId || parsedYouTube.playlistId;
    if (!playlistId) return;

    setIsFetchingPlaylist(true);
    setFetchError(null);
    setFetchSuccess(null);

    try {
      const res = await fetch(`/api/youtube/playlist?playlistId=${playlistId}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setFetchError(data.error || 'Gagal mengambil data playlist');
        return;
      }

      // Store for AI generator use
      setLastFetchedRundown(data.rundownText || '');
      setLastFetchedPlaylistTitle(data.playlistTitle || '');

      // Auto-fill rundown text
      setFormData((prev) => ({
        ...prev,
        rundownText: data.rundownText,
        // Auto-fill thumbnail if empty
        thumbnailUrl: prev.thumbnailUrl || data.thumbnail || prev.thumbnailUrl,
        // Auto-fill title ONLY if user hasn't typed their own title
        title: userHasEditedTitleRef.current || (prev.title && prev.title.trim() !== '') ? prev.title : (data.playlistTitle || prev.title),
      }));

      setTrackCount(data.totalTracks);
      setFetchSuccess(`${data.totalTracks} lagu berhasil diimpor dari playlist!`);
    } catch (err: any) {
      setFetchError(err.message || 'Gagal terhubung ke YouTube');
    } finally {
      setIsFetchingPlaylist(false);
    }
  };

  const handleGenerateAIBroadcast = async () => {
    setIsGeneratingAI(true);
    setAiMessage(null);

    try {
      const playlistTitle = lastFetchedPlaylistTitle || formData.title || '';
      const trackList = lastFetchedRundown || formData.rundownText || '';

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-broadcast',
          playlistTitle,
          trackList,
          customNotes: customAiNotes || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Gagal generate siaran dengan AI');
      }

      const generated = data.data;

      // Save to history for rollback
      setAiHistoryStack((prev) => [...prev, { ...formData }]);

      // Apply generated data: preserve user's custom title & category!
      setFormData((prev) => ({
        ...prev,
        description: generated.description || prev.description,
        // NEVER overwrite title if user has already typed one
        title: prev.title && prev.title.trim() !== '' ? prev.title : (generated.title || prev.title),
        // NEVER overwrite category if user has already selected one
        category: prev.category && prev.category.trim() !== '' ? prev.category : (generated.category || prev.category),
        duration: prev.duration && prev.duration.trim() !== '' ? prev.duration : (generated.duration || prev.duration),
      }));

      setAiMessage('✨ Deskripsi siaran berhasil digenerate! Silakan edit sesuai kebutuhan, atau generate ulang / rollback jika kurang sesuai.');
    } catch (err: any) {
      setAiMessage(`⚠️ ${err.message || 'Gagal memproses AI. Coba lagi.'}`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAIRollback = () => {
    if (aiHistoryStack.length === 0) return;
    const prev = aiHistoryStack[aiHistoryStack.length - 1];
    setFormData(prev);
    setAiHistoryStack((s) => s.slice(0, -1));
    setAiMessage('⏪ Teks berhasil dikembalikan ke versi sebelum AI.');
  };

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
      setErrorMessage('URL Siaran YouTube wajib diisi.');
      setIsSubmitting(false);
      return;
    }

    if (!parsedYouTube.isValid) {
      setErrorMessage(
        parsedYouTube.errorMessage || 'Masukkan tautan resmi YouTube yang valid (Playlist atau Live Stream).'
      );
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
              Pilihan Format Penyiaran Ruang Siar
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300 pt-1">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-amber-500/20 space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                  <span>📻 Format 1: Kurasi Radio Playlist</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Upload MP4 rekaman suara penyiar ke YouTube, masukkan ke dalam playlist bersama lagu-lagu kurasi, lalu tempel tautan playlist di formulir ini.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-red-500/30 space-y-1.5">
                <div className="font-bold text-red-400 flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>🔴 Format 2: Siaran Langsung (YouTube Live)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Mulai live streaming studio di YouTube (via OBS / kamera), lalu tempel tautan live (contoh: <code>youtube.com/live/...</code>) di bawah.
                </p>
              </div>
            </div>
            <p className="text-[11px] text-amber-200/75">Website hanya memutar sematan resmi YouTube—tidak ada pengunduhan file ilegal atau konversi data ke server.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              Informasi Pokok Siaran
            </h3>

            {/* Title */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                <label className="block text-xs font-semibold text-slate-300">
                  Judul Siaran <span className="text-red-400">*</span>
                </label>
                {lastFetchedPlaylistTitle && (
                  <button
                    type="button"
                    onClick={() => {
                      userHasEditedTitleRef.current = true;
                      setFormData((prev) => ({ ...prev, title: lastFetchedPlaylistTitle }));
                    }}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 hover:underline"
                  >
                    Gunakan Judul Playlist: &quot;{lastFetchedPlaylistTitle}&quot;
                  </button>
                )}
              </div>
              <input
                type="text"
                required
                placeholder="Contoh: Ruang Siar Pagi: Irama Pagi Nusantara"
                value={formData.title}
                onChange={(e) => {
                  userHasEditedTitleRef.current = true;
                  setFormData((prev) => ({ ...prev, title: e.target.value }));
                }}
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
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
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full px-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Description */}
            <div>
              {/* AI Generator Panel */}
              <div className="mb-2 p-3.5 rounded-xl bg-gradient-to-br from-amber-500/8 to-amber-900/10 border border-amber-500/25 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">Generate Deskripsi dengan AI</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">Opsional</span>
                  </div>
                  {aiHistoryStack.length > 0 && (
                    <button
                      type="button"
                      onClick={handleAIRollback}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-[11px] font-semibold transition-all"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Rollback ({aiHistoryStack.length})
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Catatan khusus penyiar (opsional): misal 'Siaran spesial malam minggu, suasana hangat dan santai'"
                  value={customAiNotes}
                  onChange={(e) => setCustomAiNotes(e.target.value)}
                  disabled={isGeneratingAI}
                  className="w-full px-3 py-2 text-[11px] rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateAIBroadcast}
                    disabled={isGeneratingAI}
                    className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95"
                  >
                    {isGeneratingAI ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>AI Merangkai Narasi...</span></>
                    ) : (
                      <><Wand2 className="w-3.5 h-3.5" /><span>{aiHistoryStack.length > 0 ? 'Generate Ulang' : 'Buat Deskripsi Otomatis'}</span></>
                    )}
                  </button>
                  {!lastFetchedRundown && !formData.rundownText && (
                    <span className="text-[10px] text-slate-500 leading-tight">
                      Tip: Sinkron playlist dulu agar<br/>hasilnya lebih akurat
                    </span>
                  )}
                </div>

                {aiMessage && (
                  <div className={`p-2.5 rounded-lg text-[11px] flex items-start gap-2 ${
                    aiMessage.startsWith('⚠️')
                      ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                      : aiMessage.startsWith('⏪')
                      ? 'bg-slate-700/50 border border-slate-600 text-slate-300'
                      : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                  }`}>
                    <span>{aiMessage}</span>
                  </div>
                )}
              </div>

              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Deskripsi & Narasi Broadcaster <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={5}
                required
                placeholder="Tuliskan ulasan tema siaran, informasi penyiar, dan kurasi suasana siaran... atau klik 'Buat Deskripsi Otomatis' di atas."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {/* YouTube Broadcast URL (Playlist or Live Stream) */}
            <div>
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                <label className="block text-xs font-semibold text-slate-300">
                  URL YouTube Siaran <span className="text-red-400">*</span>
                </label>
                {parsedYouTube.isValid ? (
                  <span className="text-[11px] font-semibold flex items-center gap-1.5">
                    {parsedYouTube.type === 'playlist' ? (
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        ✓ Playlist Musik Terdeteksi
                      </span>
                    ) : parsedYouTube.isLive || parsedYouTube.type === 'live' ? (
                      <span className="text-red-400 bg-red-500/15 px-2 py-0.5 rounded border border-red-500/30 animate-pulse font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                        🔴 Siaran Langsung (Live Stream) Terdeteksi!
                      </span>
                    ) : (
                      <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        ✓ Video Siaran YouTube Terdeteksi
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Playlist atau YouTube Live
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="https://www.youtube.com/playlist?list=... atau https://www.youtube.com/live/..."
                  value={formData.youtubePlaylistUrl}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({ ...prev, youtubePlaylistUrl: val }));
                    const parsed = parseYouTubeUrl(val);
                    if (parsed.isValid && (parsed.type === 'live' || parsed.isLive)) {
                      setFormData((prev) => ({
                        ...prev,
                        youtubePlaylistUrl: val,
                        duration: prev.duration === '45 Menit' ? 'Siaran Langsung' : prev.duration,
                        thumbnailUrl: prev.thumbnailUrl || parsed.defaultThumbnail || prev.thumbnailUrl,
                      }));
                    }
                  }}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Mendukung <strong>Playlist YouTube</strong> (format radio kurasi lagu) dan link <strong>YouTube Live</strong> (<code>youtube.com/live/...</code>).
              </p>
            </div>

            {/* Thumbnail URL & Direct Upload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  Foto Sampul (Thumbnail)
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

              {/* Upload Dropzone / Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingThumb}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isUploadingThumb ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Mengunggah Foto...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Upload Foto dari HP / Laptop (JPG, PNG)</span>
                    </>
                  )}
                </button>

                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Atau tempel link URL foto: https://..."
                    value={formData.thumbnailUrl || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnailUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-300 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {uploadError && (
                <p className="text-xs text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {uploadError}
                </p>
              )}

              {/* Thumbnail Preview */}
              {formData.thumbnailUrl && (
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-700 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.thumbnailUrl}
                      alt="Pratinjau Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold text-emerald-400 block truncate">
                      ✓ Foto Sampul Terpilih
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate font-mono">
                      {formData.thumbnailUrl}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, thumbnailUrl: '' })}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Rundown / Tracklist */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-1">
                  <List className="w-4 h-4 text-amber-400" />
                  Rundown &amp; Tracklist
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Bisa otomatis diimpor dari playlist YouTube atau diketik/diedit manual sepenuhnya.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const template = "00:00 - Pembukaan Siaran (Penyiar: Bang Rey)\n02:30 - Judul Lagu Pertama (Nama Artis)\n06:15 - Obrolan Sapaan Penyiar (Penyiar: Bang Rey)\n08:00 - Judul Lagu Kedua (Nama Artis)\n12:45 - Penutup & Salam (Penyiar: Bang Rey)";
                    setFormData((prev) => ({
                      ...prev,
                      rundownText: prev.rundownText ? `${prev.rundownText}\n${template}` : template,
                    }));
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                  title="Sisipkan contoh format rundown"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" /> Contoh Format
                </button>

                {parsedYouTube.playlistId && (
                  <button
                    type="button"
                    onClick={() => handleFetchPlaylist()}
                    disabled={isFetchingPlaylist}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 text-[11px] font-bold transition-all"
                  >
                    {isFetchingPlaylist ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengambil...</>
                    ) : (
                      <><RefreshCw className="w-3.5 h-3.5" /> Sinkron Playlist</>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Auto-Sync Toggle Control */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-xs font-semibold text-white block">Auto-Sync dari Link Playlist</span>
                  <span className="text-[10px] text-slate-400 block">
                    {autoSyncEnabled 
                      ? 'Aktif: Lagu otomatis diambil setiap ganti link playlist' 
                      : 'Nonaktif: Aman untuk diedit manual tanpa tertimpa otomatis'}
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSyncEnabled}
                  onChange={(e) => setAutoSyncEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {/* Fetch status banners */}
            {isFetchingPlaylist && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>Sedang mengambil daftar lagu dari YouTube...</span>
              </div>
            )}
            {fetchSuccess && !isFetchingPlaylist && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fetchSuccess} Kamu bebas mengedit teks di bawah kapan saja.</span>
              </div>
            )}
            {fetchError && !isFetchingPlaylist && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fetchError}</span>
              </div>
            )}

            <textarea
              rows={10}
              placeholder={"Ketik atau edit manual rundown siaran di sini:\n00:00 - Pembuka Siaran (Penyiar: Sigit)\n03:15 - Breathless (The Corrs)\n07:40 - Obrolan Suasana (Penyiar: Sigit)\n12:20 - Mungkin Nanti (Peterpan)\n\nAtau klik 'Sinkron Playlist' untuk mengambil otomatis dari YouTube."}
              value={formData.rundownText || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, rundownText: e.target.value }))
              }
              className="w-full px-4 py-3 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 leading-relaxed font-mono resize-y min-h-[180px]"
            />

            <div className="flex items-start gap-2 p-3 rounded-lg bg-slate-800/40 border border-slate-700/40">
              <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                <span className="text-white font-semibold">Format Manual:</span> Gunakan format <code className="text-amber-300">Menit:Detik - Judul Lagu (Nama Artis)</code> atau <code className="text-amber-300">00:00 - Sapaan (Penyiar: Nama)</code>. Baris yang mengandung kata siaran/sapaan/penyiar akan otomatis dikenali sebagai sesi penyiar.
              </p>
            </div>
          </div>


          {/* Categorization, Scheduling & Status */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-slate-800 pb-3">
              Pengaturan Siaran &amp; Jadwal Waktu
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kategori Program / Suasana
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
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
                <p className="text-[10px] text-slate-500 mt-1">
                  Bisa diubah manual kapan saja sesuai kebutuhan.
                </p>
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
                    setFormData((prev) => ({ ...prev, duration: e.target.value }))
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
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as any,
                    }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none font-semibold text-amber-400"
                >
                  <option value="Published">Tayang (Published)</option>
                  <option value="Draft">Draf</option>
                  <option value="Archived">Diarsipkan (Tempat Sampah)</option>
                </select>
              </div>
            </div>

            {/* Tanggal & Jam Publikasi (Custom Scheduling / Backdating) */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tanggal &amp; Jam Siaran (Bisa Dimundurkan / Dijadwalkan Maju)</span>
                </label>
                
                {/* Quick Preset Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-500 mr-1">Set Cepat:</span>
                  <button
                    type="button"
                    onClick={() => setPublishTimePreset('now')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-[10px] font-semibold transition-colors"
                  >
                    🕒 Sekarang
                  </button>
                  <button
                    type="button"
                    onClick={() => setPublishTimePreset('minus1h')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold transition-colors"
                  >
                    ⏪ -1 Jam
                  </button>
                  <button
                    type="button"
                    onClick={() => setPublishTimePreset('minus2h')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold transition-colors"
                  >
                    ⏪ -2 Jam
                  </button>
                  <button
                    type="button"
                    onClick={() => setPublishTimePreset('morning7')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold transition-colors"
                  >
                    🌅 07:00 Pagi
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <input
                  type="datetime-local"
                  value={toDatetimeLocal(formData.publishedAt)}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) {
                      setFormData((prev) => ({
                        ...prev,
                        publishedAt: new Date(val).toISOString(),
                      }));
                    }
                  }}
                  className="w-full px-4 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500"
                />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Bisa dimundurkan (misal info dari ojol/crew jam 07:00 tapi baru sempat input jam 09:00), atau diatur ke jam masa depan untuk jadwal tayang.
                </p>
              </div>
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
