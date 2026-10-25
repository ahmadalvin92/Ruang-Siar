'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Check, Copy, Sparkles } from 'lucide-react';
import { WhatsAppIcon, TwitterIcon } from '@/components/icons';

interface ShareButtonsProps {
  title: string;
  description?: string;
  url?: string;
  className?: string;
  variant?: 'compact' | 'full';
}

export default function ShareButtons({
  title,
  description = '',
  url,
  className = '',
  variant = 'full',
}: ShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = useState(url || '');
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (!url && typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      setCanNativeShare(true);
    }
  }, [url]);

  const handleCopy = async () => {
    if (!currentUrl) return;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({
        title,
        text: description || title,
        url: currentUrl,
      });
    } catch {
      // User cancelled share or not supported
    }
  };

  const shareTargetUrl = currentUrl || (typeof window !== 'undefined' ? window.location.href : 'https://ruangsiar.id');
  const shareText = encodeURIComponent(`${title} — Ruang Siar`);
  const encodedUrl = encodeURIComponent(shareTargetUrl);
  const whatsappUrl = `https://wa.me/?text=${shareText}%0A${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`;

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // On mobile devices, launching whatsapp:// scheme directly bypasses the slow web redirect
    if (typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      e.preventDefault();
      window.location.href = `whatsapp://send?text=${shareText}%0A${encodedUrl}`;
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <a
          href={whatsappUrl}
          onClick={handleWhatsAppClick}
          target="_blank"
          rel="noopener noreferrer"
          title="Bagikan ke WhatsApp"
          className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition-all"
        >
          <WhatsAppIcon className="w-4 h-4" />
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Bagikan ke X"
          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center transition-all"
        >
          <TwitterIcon className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={handleCopy}
          type="button"
          title="Salin Tautan"
          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center transition-all"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800/80 shadow-lg ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
          <Share2 className="w-4 h-4 text-amber-400" />
          <span>Bagikan ke Rekan & Media Sosial:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            onClick={handleWhatsAppClick}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          {/* Twitter / X Button */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <TwitterIcon className="w-3 h-3" />
            <span>X (Twitter)</span>
          </a>

          {/* Native Web Share for Mobile */}
          {canNativeShare && (
            <button
              onClick={handleNativeShare}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lainnya</span>
            </button>
          )}

          {/* Copy Link Button */}
          <button
            onClick={handleCopy}
            type="button"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span>Tips: Saat membuka WhatsApp, beri jeda 1–2 detik sampai gambar kartu berita muncul di atas chat sebelum menekan tombol Kirim.</span>
      </div>
    </div>
  );
}
