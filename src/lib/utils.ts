import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateIndonesian(dateStr: string | Date | undefined): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return String(dateStr);
  }
}

export function formatDateTimeIndonesian(dateStr: string | Date | undefined): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    const dateFormatted = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);

    // Format time in Asia/Jakarta (WIB)
    const timeFormatted = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d).replace('.', ':');

    return `${dateFormatted} • ${timeFormatted} WIB`;
  } catch {
    return String(dateStr);
  }
}

/**
 * Returns a fully qualified absolute URL for images (OpenGraph, Twitter cards, social media).
 * Always returns https://ruangsiar.id/... so social crawlers (WhatsApp, Facebook, Twitter, Telegram)
 * can crawl and render thumbnail previews properly.
 */
export function getAbsoluteImageUrl(url?: string | null): string {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ruangsiar.id').replace(/\/+$/, '');
  if (!url || typeof url !== 'string' || !url.trim()) {
    return `${siteUrl}/og-image.jpeg`;
  }
  const cleanUrl = url.trim();
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    return cleanUrl;
  }
  return `${siteUrl}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
}

