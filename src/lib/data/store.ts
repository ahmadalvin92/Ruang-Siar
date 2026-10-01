import fs from 'fs';
import path from 'path';
import { Broadcast, News, BroadcastFormData, NewsFormData, ContentStatus, RundownItem } from '@/types';
import { initialBroadcasts, initialNews } from './initialData';
import {
  isMysqlConfigured,
  mysqlGetBroadcasts,
  mysqlGetBroadcastBySlug,
  mysqlGetBroadcastById,
  mysqlInsertBroadcast,
  mysqlUpdateBroadcast,
  mysqlDeleteBroadcast,
  mysqlGetNews,
  mysqlGetNewsBySlug,
  mysqlGetNewsById,
  mysqlInsertNews,
  mysqlUpdateNews,
  mysqlDeleteNews,
} from './mysql';

interface DbSchema {
  broadcasts: Broadcast[];
  news: News[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

function ensureDb(): DbSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initial: DbSchema = {
        broadcasts: initialBroadcasts,
        news: initialNews,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }

    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content) as DbSchema;
    return parsed;
  } catch (error) {
    console.error('Error accessing local db.json, falling back to initial data:', error);
    return {
      broadcasts: initialBroadcasts,
      news: initialNews,
    };
  }
}

function saveDb(data: DbSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving local db.json:', error);
  }
}

/* ================== BROADCAST OPERATIONS ================== */

export async function getBroadcasts(options?: {
  status?: ContentStatus;
  search?: string;
  category?: string;
  limit?: number;
}): Promise<Broadcast[]> {
  if (isMysqlConfigured()) {
    try {
      return await mysqlGetBroadcasts(options);
    } catch (err) {
      console.warn('MySQL getBroadcasts failed, falling back to local store:', err);
    }
  }

  const db = ensureDb();
  let list = [...db.broadcasts];

  if (options?.status) {
    list = list.filter((b) => b.status === options.status);
  }

  if (options?.category && options.category !== 'Semua') {
    list = list.filter((b) => b.category.toLowerCase() === options.category?.toLowerCase());
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    );
  }

  // Sort by publishedAt descending
  list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  if (options?.limit) {
    list = list.slice(0, options.limit);
  }

  return list;
}

export async function getBroadcastBySlug(slug: string): Promise<Broadcast | null> {
  if (isMysqlConfigured()) {
    try {
      return await mysqlGetBroadcastBySlug(slug);
    } catch (err) {
      console.warn('MySQL getBroadcastBySlug failed, falling back to local store:', err);
    }
  }
  const db = ensureDb();
  const found = db.broadcasts.find((b) => b.slug === slug);
  return found || null;
}

export async function getBroadcastById(id: string): Promise<Broadcast | null> {
  if (isMysqlConfigured()) {
    try {
      return await mysqlGetBroadcastById(id);
    } catch (err) {
      console.warn('MySQL getBroadcastById failed, falling back to local store:', err);
    }
  }
  const db = ensureDb();
  const found = db.broadcasts.find((b) => b.id === id);
  return found || null;
}


function parseRundownText(text?: string): RundownItem[] {
  if (!text || !text.trim()) return [];
  const lines = text.split('\n');
  const items: RundownItem[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Pattern: 00:00 - Title (Artist or Speaker) or 00:00 Title
    const match = line.match(/^(\d{1,2}:\d{2})\s*[-–—]?\s*(.+)$/);
    if (match) {
      const time = match[1];
      const rest = match[2].trim();
      let title = rest;
      let artistOrSpeaker: string | undefined = undefined;

      // Extract (Speaker/Artist) if in parentheses
      const parenMatch = rest.match(/^(.*?)\s*\((.*?)\)$/);
      if (parenMatch) {
        title = parenMatch[1].trim();
        artistOrSpeaker = parenMatch[2].trim();
      }

      const isSiaran =
        title.toLowerCase().includes('siaran') ||
        title.toLowerCase().includes('pengantar') ||
        title.toLowerCase().includes('sapaan') ||
        title.toLowerCase().includes('selingan') ||
        title.toLowerCase().includes('penutup') ||
        (artistOrSpeaker && artistOrSpeaker.toLowerCase().includes('penyiar'));

      items.push({
        time,
        title,
        artistOrSpeaker,
        type: isSiaran ? 'siaran' : 'lagu',
      });
    } else {
      items.push({
        time: '--:--',
        title: line,
        type: 'lagu',
      });
    }
  }

  return items;
}

export async function createBroadcast(data: BroadcastFormData): Promise<Broadcast> {
  const db = ensureDb();
  const now = new Date().toISOString();
  const id = `broadcast-${Date.now()}`;
  
  let baseSlug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title);
  if (!baseSlug) baseSlug = `siaran-${Date.now()}`;

  // Ensure unique slug
  let uniqueSlug = baseSlug;
  let counter = 1;
  while (db.broadcasts.some((b) => b.slug === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  const finalRundown =
    data.rundown && data.rundown.length > 0
      ? data.rundown
      : data.rundownText
      ? parseRundownText(data.rundownText)
      : [];

  const newBroadcast: Broadcast = {
    id,
    title: data.title.trim(),
    slug: uniqueSlug,
    description: data.description.trim(),
    youtubePlaylistUrl: data.youtubePlaylistUrl.trim(),
    thumbnailUrl: data.thumbnailUrl?.trim() || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop',
    category: data.category?.trim() || 'Siaran Umum',
    duration: data.duration?.trim() || '15 Menit',
    status: data.status,
    rundown: finalRundown,
    publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : now,
    createdAt: now,
    updatedAt: now,
  };

  if (isMysqlConfigured()) {
    try {
      await mysqlInsertBroadcast(newBroadcast);
    } catch (err) {
      console.warn('MySQL insertBroadcast failed, writing to local fallback:', err);
    }
  }

  db.broadcasts.unshift(newBroadcast);
  saveDb(db);
  return newBroadcast;
}

export async function updateBroadcast(
  id: string,
  data: Partial<BroadcastFormData>
): Promise<Broadcast | null> {
  const db = ensureDb();
  const index = db.broadcasts.findIndex((b) => b.id === id);
  if (index === -1) return null;

  const existing = db.broadcasts[index];
  const now = new Date().toISOString();

  let updatedSlug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    let baseSlug = slugify(data.slug);
    let candidate = baseSlug;
    let counter = 1;
    while (db.broadcasts.some((b) => b.slug === candidate && b.id !== id)) {
      candidate = `${baseSlug}-${counter++}`;
    }
    updatedSlug = candidate;
  }

  const updatedRundown =
    data.rundown !== undefined
      ? data.rundown
      : data.rundownText !== undefined
      ? parseRundownText(data.rundownText)
      : existing.rundown;

  const updated: Broadcast = {
    ...existing,
    title: data.title !== undefined ? data.title.trim() : existing.title,
    slug: updatedSlug,
    description: data.description !== undefined ? data.description.trim() : existing.description,
    youtubePlaylistUrl: data.youtubePlaylistUrl !== undefined ? data.youtubePlaylistUrl.trim() : existing.youtubePlaylistUrl,
    thumbnailUrl: data.thumbnailUrl !== undefined && data.thumbnailUrl.trim() ? data.thumbnailUrl.trim() : existing.thumbnailUrl,
    category: data.category !== undefined ? data.category.trim() : existing.category,
    duration: data.duration !== undefined ? data.duration.trim() : existing.duration,
    status: data.status !== undefined ? data.status : existing.status,
    rundown: updatedRundown,
    publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : existing.publishedAt,
    updatedAt: now,
  };

  if (isMysqlConfigured()) {
    try {
      await mysqlUpdateBroadcast(updated);
    } catch (err) {
      console.warn('MySQL updateBroadcast failed, writing to local fallback:', err);
    }
  }

  db.broadcasts[index] = updated;
  saveDb(db);
  return updated;
}

export async function deleteBroadcast(id: string): Promise<boolean> {
  if (isMysqlConfigured()) {
    try {
      await mysqlDeleteBroadcast(id);
    } catch (err) {
      console.warn('MySQL deleteBroadcast failed:', err);
    }
  }

  const db = ensureDb();
  const initialLength = db.broadcasts.length;
  db.broadcasts = db.broadcasts.filter((b) => b.id !== id);
  if (db.broadcasts.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

/* ================== NEWS OPERATIONS ================== */

export async function getNewsList(options?: {
  status?: ContentStatus;
  search?: string;
  category?: string;
  limit?: number;
}): Promise<News[]> {
  if (isMysqlConfigured()) {
    try {
      return await mysqlGetNews(options);
    } catch (err) {
      console.warn('MySQL getNews failed, falling back to local store:', err);
    }
  }

  const db = ensureDb();
  let list = [...db.news];

  if (options?.status) {
    list = list.filter((n) => n.status === options.status);
  }

  if (options?.category && options.category !== 'Semua') {
    list = list.filter((n) => n.category.toLowerCase() === options.category?.toLowerCase());
  }

  if (options?.search) {
    const q = options.search.toLowerCase();
    list = list.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.excerpt.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
    );
  }

  // Sort by publishedAt descending
  list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  if (options?.limit) {
    list = list.slice(0, options.limit);
  }

  return list;
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  if (isMysqlConfigured()) {
    try {
      return await mysqlGetNewsBySlug(slug);
    } catch (err) {
      console.warn('MySQL getNewsBySlug failed, falling back to local store:', err);
    }
  }

  const db = ensureDb();
  const found = db.news.find((n) => n.slug === slug);
  return found || null;
}

export async function getNewsById(id: string): Promise<News | null> {
  if (isMysqlConfigured()) {
    try {
      return await mysqlGetNewsById(id);
    } catch (err) {
      console.warn('MySQL getNewsById failed, falling back to local store:', err);
    }
  }

  const db = ensureDb();
  const found = db.news.find((n) => n.id === id);
  return found || null;
}

export async function createNews(data: NewsFormData): Promise<News> {
  const db = ensureDb();
  const now = new Date().toISOString();
  const id = `news-${Date.now()}`;

  let baseSlug = data.slug?.trim() ? slugify(data.slug) : slugify(data.title);
  if (!baseSlug) baseSlug = `berita-${Date.now()}`;

  let uniqueSlug = baseSlug;
  let counter = 1;
  while (db.news.some((n) => n.slug === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter++}`;
  }

  const newItem: News = {
    id,
    title: data.title.trim(),
    slug: uniqueSlug,
    excerpt: data.excerpt.trim(),
    content: data.content.trim(),
    thumbnailUrl: data.thumbnailUrl?.trim() || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
    category: data.category?.trim() || 'Kabar Berita',
    status: data.status,
    publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : now,
    createdAt: now,
    updatedAt: now,
  };

  if (isMysqlConfigured()) {
    try {
      await mysqlInsertNews(newItem);
    } catch (err) {
      console.warn('MySQL insertNews failed, writing to local fallback:', err);
    }
  }

  db.news.unshift(newItem);
  saveDb(db);
  return newItem;
}

export async function updateNews(
  id: string,
  data: Partial<NewsFormData>
): Promise<News | null> {
  const db = ensureDb();
  const index = db.news.findIndex((n) => n.id === id);
  if (index === -1) return null;

  const existing = db.news[index];
  const now = new Date().toISOString();

  let updatedSlug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    let baseSlug = slugify(data.slug);
    let candidate = baseSlug;
    let counter = 1;
    while (db.news.some((n) => n.slug === candidate && n.id !== id)) {
      candidate = `${baseSlug}-${counter++}`;
    }
    updatedSlug = candidate;
  }

  const updated: News = {
    ...existing,
    title: data.title !== undefined ? data.title.trim() : existing.title,
    slug: updatedSlug,
    excerpt: data.excerpt !== undefined ? data.excerpt.trim() : existing.excerpt,
    content: data.content !== undefined ? data.content.trim() : existing.content,
    thumbnailUrl: data.thumbnailUrl !== undefined && data.thumbnailUrl.trim() ? data.thumbnailUrl.trim() : existing.thumbnailUrl,
    category: data.category !== undefined ? data.category.trim() : existing.category,
    status: data.status !== undefined ? data.status : existing.status,
    publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString() : existing.publishedAt,
    updatedAt: now,
  };

  if (isMysqlConfigured()) {
    try {
      await mysqlUpdateNews(updated);
    } catch (err) {
      console.warn('MySQL updateNews failed, writing to local fallback:', err);
    }
  }

  db.news[index] = updated;
  saveDb(db);
  return updated;
}

export async function deleteNews(id: string): Promise<boolean> {
  if (isMysqlConfigured()) {
    try {
      await mysqlDeleteNews(id);
    } catch (err) {
      console.warn('MySQL deleteNews failed:', err);
    }
  }

  const db = ensureDb();
  const initialLength = db.news.length;
  db.news = db.news.filter((n) => n.id !== id);
  if (db.news.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}


/* ================== DASHBOARD METRICS ================== */

export async function getDashboardStats() {
  const db = ensureDb();
  const totalBroadcasts = db.broadcasts.length;
  const publishedBroadcasts = db.broadcasts.filter((b) => b.status === 'Published').length;
  const draftBroadcasts = db.broadcasts.filter((b) => b.status === 'Draft').length;

  const totalNews = db.news.length;
  const publishedNews = db.news.filter((n) => n.status === 'Published').length;
  const draftNews = db.news.filter((n) => n.status === 'Draft').length;

  return {
    totalBroadcasts,
    publishedBroadcasts,
    draftBroadcasts,
    totalNews,
    publishedNews,
    draftNews,
    recentBroadcasts: db.broadcasts.slice(0, 5),
    recentNews: db.news.slice(0, 5),
  };
}
