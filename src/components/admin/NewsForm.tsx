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
  RotateCcw,
  RefreshCw,
  Wand2,
  Upload,
  Bold,
  Italic,
  Underline,
  Eye,
  Edit3,
} from 'lucide-react';
import FormattedArticle from '@/components/FormattedArticle';

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

  // History stack for Rollback feature
  const [historyStack, setHistoryStack] = useState<NewsFormData[]>([]);
  
  // AI Generator state
  const [aiTopic, setAiTopic] = useState('');
  const [aiAngle, setAiAngle] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // File upload state
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Content formatting state & ref
  const [contentViewTab, setContentViewTab] = useState<'edit' | 'preview'>('edit');
  const contentTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Formatting helper for Bold, Italic, Underline
  const applyFormatting = (type: 'bold' | 'italic' | 'underline') => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let prefix = '';
    let suffix = '';
    let placeholder = '';

    if (type === 'bold') {
      prefix = '**';
      suffix = '**';
      placeholder = 'teks tebal';
    } else if (type === 'italic') {
      prefix = '*';
      suffix = '*';
      placeholder = 'teks miring';
    } else if (type === 'underline') {
      prefix = '<u>';
      suffix = '</u>';
      placeholder = 'teks garis bawah';
    }

    let newText = '';
    let newStart = 0;
    let newEnd = 0;

    if (selectedText.length > 0) {
      newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
      newStart = start + prefix.length;
      newEnd = end + prefix.length;
    } else {
      newText = text.substring(0, start) + prefix + placeholder + suffix + text.substring(end);
      newStart = start + prefix.length;
      newEnd = newStart + placeholder.length;
    }

    setFormData((prev) => ({ ...prev, content: newText }));

    // Focus & restore selection range
    setTimeout(() => {
      if (contentTextareaRef.current) {
        contentTextareaRef.current.focus();
        contentTextareaRef.current.setSelectionRange(newStart, newEnd);
      }
    }, 10);
  };

  // Keyboard shortcut listener for Ctrl+B, Ctrl+I, Ctrl+U
  const handleContentKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      if (key === 'b') {
        e.preventDefault();
        applyFormatting('bold');
      } else if (key === 'i') {
        e.preventDefault();
        applyFormatting('italic');
      } else if (key === 'u') {
        e.preventDefault();
        applyFormatting('underline');
      }
    }
  };

  // Helper for datetime-local
  const toDatetimeLocal = (isoString?: string): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // Quick preset helper for publishedAt (e.g. scheduling forward or backdating)
  const setPublishTimePreset = (type: 'now' | 'minus1h' | 'minus2h' | 'plus1h' | 'plus2h' | 'morning7' | 'noon12' | 'evening16') => {
    const d = new Date();
    if (type === 'minus1h') {
      d.setHours(d.getHours() - 1);
    } else if (type === 'minus2h') {
      d.setHours(d.getHours() - 2);
    } else if (type === 'plus1h') {
      d.setHours(d.getHours() + 1);
    } else if (type === 'plus2h') {
      d.setHours(d.getHours() + 2);
    } else if (type === 'morning7') {
      d.setHours(7, 0, 0, 0);
    } else if (type === 'noon12') {
      d.setHours(12, 0, 0, 0);
    } else if (type === 'evening16') {
      d.setHours(16, 30, 0, 0);
    }
    setFormData((prev) => ({ ...prev, publishedAt: d.toISOString() }));
  };

  // Direct file upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
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
      setIsUploadingPhoto(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!aiTopic.trim()) {
      alert('Tuliskan topik berita terlebih dahulu untuk AI');
      return;
    }

    setIsGeneratingAI(true);
    setAiMessage(null);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-news',
          topic: aiTopic,
          angle: aiAngle,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Gagal generate artikel dengan AI');
      }

      const generated = data.data;

      // Save current state to history for Rollback
      setHistoryStack((prev) => [...prev, { ...formData }]);

      // Update form with AI generated data: preserve user's typed title & category if already filled!
      setFormData((prev) => ({
        ...prev,
        title: prev.title && prev.title.trim() !== '' ? prev.title : (generated.title || prev.title),
        excerpt: generated.excerpt || prev.excerpt,
        content: generated.content || prev.content,
        category: prev.category && prev.category.trim() !== '' ? prev.category : (generated.category || prev.category),
      }));

      setAiMessage('✨ Berita berhasil digenerate oleh Gemini! Anda bisa mengedit teks, generate ulang, atau rollback jika belum sesuai.');
    } catch (err: any) {
      alert(`Terjadi kesalahan AI: ${err.message || 'Gagal memproses'}`);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleRollback = () => {
    if (historyStack.length === 0) return;
    const previous = historyStack[historyStack.length - 1];
    setFormData(previous);
    setHistoryStack((prev) => prev.slice(0, -1));
    setAiMessage('⏪ Teks berhasil dikembalikan (Rollback) ke versi sebelumnya.');
  };

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

      {/* AI News Writer Assistant Banner (Opsional) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Bantu Tulis dengan AI (Gemini) — Opsional
                </h4>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">
                  Beta
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Ketik topik singkat lalu tekan tombol untuk membuat draf artikel otomatis. Default tetap manual.
              </p>
            </div>
          </div>

          {historyStack.length > 0 && (
            <button
              type="button"
              onClick={handleRollback}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Kembalikan teks ke versi sebelum AI"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Rollback ({historyStack.length})</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6 space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">
              Topik / Isu Berita:
            </label>
            <input
              type="text"
              placeholder="Misal: Konser Sheila on 7 di Jakarta tiket ludes 3 menit..."
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              disabled={isGeneratingAI}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">
              Sudut Pandang (Opsional):
            </label>
            <input
              type="text"
              placeholder="Misal: Sorot antusiasme fans muda..."
              value={aiAngle}
              onChange={(e) => setAiAngle(e.target.value)}
              disabled={isGeneratingAI}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isGeneratingAI || !aiTopic.trim()}
              className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95"
            >
              {isGeneratingAI ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Merangkai...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Generate AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {aiMessage && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>{aiMessage}</span>
          </div>
        )}
      </div>

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
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
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
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
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
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                className="w-full px-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {/* Content Field with Formatting Toolbar */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Isi Lengkap Berita <span className="text-red-400">*</span>
                </label>

                {/* View Switcher: Tulis vs Pratinjau */}
                <div className="inline-flex p-0.5 rounded-lg bg-slate-950 border border-slate-800 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setContentViewTab('edit')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      contentViewTab === 'edit'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Tulis Naskah</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentViewTab('preview')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                      contentViewTab === 'preview'
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Pratinjau Hasil</span>
                  </button>
                </div>
              </div>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => applyFormatting('bold')}
                    title="Tebal / Bold (Ctrl+B)"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-amber-400 border border-slate-800 hover:border-amber-500/40 text-xs font-bold transition-all active:scale-95"
                  >
                    <Bold className="w-3.5 h-3.5" />
                    <span className="font-extrabold">Bold</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormatting('italic')}
                    title="Miring / Italic (Ctrl+I)"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-amber-400 border border-slate-800 hover:border-amber-500/40 text-xs font-semibold italic transition-all active:scale-95"
                  >
                    <Italic className="w-3.5 h-3.5" />
                    <span>Italic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFormatting('underline')}
                    title="Garis Bawah / Underline (Ctrl+U)"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-amber-400 border border-slate-800 hover:border-amber-500/40 text-xs font-semibold underline decoration-amber-400/60 underline-offset-2 transition-all active:scale-95"
                  >
                    <Underline className="w-3.5 h-3.5" />
                    <span>Underline</span>
                  </button>
                </div>

                <div className="text-[10px] text-slate-400 font-mono hidden md:flex items-center gap-2">
                  <span>
                    Blok kata lalu klik tombol, atau tekan{' '}
                    <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">Ctrl+B</kbd>{' '}
                    <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">Ctrl+I</kbd>{' '}
                    <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300">Ctrl+U</kbd>
                  </span>
                </div>
              </div>

              {/* Textarea or Preview */}
              {contentViewTab === 'edit' ? (
                <div className="relative">
                  <textarea
                    ref={contentTextareaRef}
                    rows={12}
                    required
                    placeholder="Tuliskan naskah warta lengkap di sini...&#10;Gunakan tombol Bold (**teks**), Italic (*teks*), atau Underline (<u>teks</u>).&#10;Pisahkan paragraf dengan enter / baris ganda."
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, content: e.target.value }))
                    }
                    onKeyDown={handleContentKeyDown}
                    className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
                    <span>
                      {formData.content.length} karakter •{' '}
                      {formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0} kata
                    </span>
                    <span className="text-amber-500/70">Mendukung format Markdown & tag HTML</span>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 min-h-[260px]">
                  <div className="text-[11px] uppercase tracking-wider text-amber-400 font-bold mb-3 pb-2 border-b border-slate-800/80 flex items-center justify-between">
                    <span>Pratinjau Naskah Warta (Sesuai Tampilan Publik)</span>
                    <span className="text-[10px] font-normal text-slate-400">
                      Klik tab &quot;Tulis Naskah&quot; untuk mengedit kembali
                    </span>
                  </div>
                  {formData.content.trim() ? (
                    <FormattedArticle
                      content={formData.content}
                      className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base"
                    />
                  ) : (
                    <p className="text-xs text-slate-500 italic py-8 text-center">
                      Belum ada teks naskah berita yang ditulis. Silakan ketik di tab &quot;Tulis Naskah&quot;.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail URL & Direct Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Foto Sampul Berita
              </label>

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
                  disabled={isUploadingPhoto}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {isUploadingPhoto ? (
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
                      setFormData((prev) => ({ ...prev, thumbnailUrl: e.target.value }))
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
                      alt="Pratinjau Foto"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold text-emerald-400 block truncate">
                      ✓ Foto Berita Terpilih
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
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
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
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none font-semibold text-amber-400"
              >
                <option value="Published">Terbit (Published)</option>
                <option value="Draft">Draf</option>
                <option value="Archived">Tempat Sampah (Archived)</option>
              </select>
            </div>

            <div>
              <div className="flex flex-col gap-1.5 mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tanggal &amp; Jam Publikasi</span>
                </label>

                {/* Quick Presets */}
                <div className="flex items-center gap-1 flex-wrap">
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
                    onClick={() => setPublishTimePreset('plus1h')}
                    className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-semibold transition-colors"
                  >
                    ⏩ +1 Jam
                  </button>
                  <button
                    type="button"
                    onClick={() => setPublishTimePreset('plus2h')}
                    className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-semibold transition-colors"
                  >
                    ⏩ +2 Jam
                  </button>
                  <button
                    type="button"
                    onClick={() => setPublishTimePreset('morning7')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold transition-colors"
                  >
                    🌅 07:00
                  </button>
                  <button
                    type="button"
                    onClick={() => setPublishTimePreset('noon12')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold transition-colors"
                  >
                    ☀️ 12:00
                  </button>
                  <button
                    type="button"
                    onClick={() => setPublishTimePreset('evening16')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold transition-colors"
                  >
                    🌇 16:30
                  </button>
                </div>
              </div>

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
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-500"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Bisa dimundurkan (misal laporan ojol jam 07:00) atau dijadwalkan maju.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isEdit ? 'Simpan Perubahan' : 'Terbitkan Warta'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Pratinjau Kartu Warta
            </h4>
            <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-3 space-y-2">
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                {formData.category}
              </div>
              <div className="font-bold text-white text-xs line-clamp-2">
                {formData.title || 'Judul artikel Anda akan tampil di sini'}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {formData.excerpt || 'Ringkasan artikel akan tampil di sini...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
