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
