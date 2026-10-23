import fs from 'fs';
import path from 'path';
import { Broadcast, News, BroadcastFormData, NewsFormData, ContentStatus, RundownItem, SiteSettings } from '@/types';
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

export const defaultSettings: SiteSettings = {
  siteName: 'Ruang Siar',
  siteTagline: 'Media & Radio Siar Kontemporer Indonesia',
  siteDescription: 'Platform radio siar kontemporer Indonesia. Suara hangat penyiar berpadu kurasi playlist resmi YouTube — pengalaman audio-visual yang menginspirasi setiap hari.',
  instagramUrl: 'https://instagram.com/ruangsiar.id',
  youtubeUrl: 'https://youtube.com/@ruangsiar',
  twitterUrl: 'https://x.com/ruangsiar',
  contactEmail: 'redaksi@ruangsiar.id',
  contactLocation: 'Jakarta Selatan, Indonesia',
  activeStatusText: 'Siaran Aktif — 24 Jam',
  schedules: [
    { time: '06:00 – 09:00', name: 'Pagi', color: 'text-amber-400' },
    { time: '12:00 – 14:00', name: 'Siang', color: 'text-orange-400' },
    { time: '16:30 – 19:00', name: 'Sore', color: 'text-rose-400' },
    { time: '21:00 – 23:00', name: 'Malam', color: 'text-purple-400' },
    { time: 'Khusus', name: 'Wawancara & Eksklusif', color: 'text-sky-400' },
  ],
  adSensePublisherId: 'ca-pub-5854985607866680',
  adSenseSlotLeaderboard: '',
  adSenseSlotRectangle: '',
  adSenseEnabled: true,
  googleAnalyticsId: '',
  whatsappNumber: '+62 896-3017-2935',
  statsListeners: '10K+',
  statsCuratedSongs: '500+',
  conceptHeading: 'Harmonisasi Narasi Suara & Playlist YouTube Resmi',
  conceptDescription: 'Ruang Siar menyajikan format penyiaran modern — broadcaster meramu narasi dan kabar terkini, sementara alunan musik dinikmati via pemutar sematan resmi YouTube. Bersih dari unduhan ilegal, menghormati hak cipta musisi.',
  aboutBadge: 'Filosofi & Visi Platform',
  aboutHeading: 'Mendefinisikan Ulang Pengalaman Radio Siar di Era Digital',
  aboutParagraph1: 'Ruang Siar lahir dari kerinduan akan kehangatan suara penyiar radio yang dipadukan secara elegan dengan katalog musik tak terbatas dari YouTube resmi.',
  aboutParagraph2: 'Kami menyajikan format penyiaran modern — broadcaster meramu narasi dan kabar terkini, sementara alunan musik dinikmati via pemutar sematan resmi YouTube. Bersih dari unduhan ilegal, menghormati hak cipta musisi.',
  aboutPrinciples: [
    { title: 'Narasi Bermakna', desc: 'Penyiar memandu pendengar dengan kabar terkini, obrolan hangat, dan konteks cerita di balik setiap pemilihan lagu.' },
    { title: '100% Pemutar Resmi', desc: 'Tidak ada pengunduhan file, konversi suara, atau re-hosting data. Semua lagu disajikan via pemutar sematan resmi YouTube.' },
    { title: 'Hormati Hak Cipta', desc: 'Setiap kali pemutar diputar, metrik tontonan dan royalti langsung tercatat resmi bagi sang musisi di kanal aslinya.' },
  ],
  aboutStepsHeading: 'Bagaimana Ruang Siar Bekerja?',
  aboutSteps: [
    { title: '1. Kurasi Playlist', desc: 'Broadcaster atau kurator menyiapkan playlist lagu tematik di YouTube yang cocok dengan tema siaran.' },
    { title: '2. Input Melalui CMS', desc: 'Melalui portal admin Ruang Siar, pengelola cukup memasukkan tautan playlist YouTube, judul siaran, serta catatan penyiaran.' },
    { title: '3. Tampilan Audio-Visual Mewah', desc: 'Website otomatis mengekstrak identifier pemutar, menampilkan pemutar 16:9 responsif berkelas, dan menyajikannya secara mulus kepada seluruh pendengar.' },
  ],
  aboutCtaHeading: 'Siap mendengarkan program siaran hari ini?',
  redaksiTitle: 'Susunan Dewan Redaksi & Tim Ruang Siar',
  redaksiDescription: 'Ruang Siar dikelola oleh tim kurator, penyiar, dan jurnalis audio-visual yang berdedikasi menghadirkan jurnalisme musik dan penyiaran berintegritas.',
  redaksiMembers: [
    { role: 'Pemimpin Umum / Penanggung Jawab', name: 'Sigit' },
    { role: 'Pemimpin Redaksi', name: 'Alvin' },
    { role: 'Redaktur Pelaksana', name: 'Tim Editorial Ruang Siar' },
    { role: 'Kurator Musik & Broadcaster', name: 'Sigit & Rekan' },
    { role: 'Reporter & Kontributor Lapangan', name: 'Traffic Crew & Komunitas' },
  ],
};

interface DbSchema {
  broadcasts: Broadcast[];
  news: News[];
  settings?: SiteSettings;
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
        settings: defaultSettings,
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }

    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content) as DbSchema;
    if (!parsed.settings) {
      parsed.settings = defaultSettings;
      saveDb(parsed);
    }
    return parsed;
  } catch (error) {
    console.error('Error accessing local db.json, falling back to initial data:', error);
    return {
      broadcasts: initialBroadcasts,
      news: initialNews,
      settings: defaultSettings,
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
  includeFuture?: boolean;
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
    if (options.status === 'Published' && !options?.includeFuture) {
      const now = Date.now();
      list = list.filter((b) => b.status === 'Published' && new Date(b.publishedAt).getTime() <= now);
    } else {
      list = list.filter((b) => b.status === options.status);
    }
  } else if (!options?.includeFuture) {
    const now = Date.now();
    list = list.filter((b) => b.status === 'Published' && new Date(b.publishedAt).getTime() <= now);
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

export async function getBroadcastBySlug(slug: string, options?: { allowFuture?: boolean }): Promise<Broadcast | null> {
  let item: Broadcast | null = null;
  if (isMysqlConfigured()) {
    try {
      item = await mysqlGetBroadcastBySlug(slug);
      if (!item) item = await mysqlGetBroadcastById(slug);
    } catch (err) {
      console.warn('MySQL getBroadcastBySlug failed, falling back to local store:', err);
    }
  }
  if (!item) {
    const db = ensureDb();
    item = db.broadcasts.find((b) => b.slug === slug || b.id === slug) || null;
  }

  if (item && !options?.allowFuture && item.status === 'Published') {
    if (new Date(item.publishedAt).getTime() > Date.now()) {
      return null;
    }
  }

  return item;
}

export async function getBroadcastById(id: string): Promise<Broadcast | null> {
  if (isMysqlConfigured()) {
    try {
      const item = await mysqlGetBroadcastById(id);
      if (item) return item;
      // Also try matching by slug in case slug was passed as id in the URL!
      const bySlug = await mysqlGetBroadcastBySlug(id);
      if (bySlug) return bySlug;
    } catch (err) {
      console.warn('MySQL getBroadcastById failed, falling back to local store:', err);
    }
  }
  const db = ensureDb();
  const found = db.broadcasts.find((b) => b.id === id || b.slug === id);
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
  const existing = await getBroadcastById(id);
  if (!existing) return null;

  const db = ensureDb();
  const now = new Date().toISOString();

  let updatedSlug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    let baseSlug = slugify(data.slug);
    let candidate = baseSlug;
    let counter = 1;
    while (db.broadcasts.some((b) => b.slug === candidate && b.id !== existing.id)) {
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

  const index = db.broadcasts.findIndex((b) => b.id === existing.id || b.slug === existing.slug);
  if (index !== -1) {
    db.broadcasts[index] = updated;
  } else {
    db.broadcasts.unshift(updated);
  }
  saveDb(db);
  return updated;
}

export async function deleteBroadcast(id: string): Promise<boolean> {
  let deletedFromMysql = false;
  if (isMysqlConfigured()) {
    try {
      deletedFromMysql = await mysqlDeleteBroadcast(id);
      if (!deletedFromMysql) {
        const item = await mysqlGetBroadcastBySlug(id);
        if (item) {
          deletedFromMysql = await mysqlDeleteBroadcast(item.id);
        }
      }
    } catch (err) {
      console.warn('MySQL deleteBroadcast failed:', err);
    }
  }

  const db = ensureDb();
  const initialLength = db.broadcasts.length;
  db.broadcasts = db.broadcasts.filter((b) => b.id !== id && b.slug !== id);
  const deletedFromLocal = db.broadcasts.length !== initialLength;
  if (deletedFromLocal) {
    saveDb(db);
  }

  return deletedFromMysql || deletedFromLocal;
}

/* ================== NEWS OPERATIONS ================== */

export async function getNewsList(options?: {
  status?: ContentStatus;
  search?: string;
  category?: string;
  limit?: number;
  includeFuture?: boolean;
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
    if (options.status === 'Published' && !options?.includeFuture) {
      const now = Date.now();
      list = list.filter((n) => n.status === 'Published' && new Date(n.publishedAt).getTime() <= now);
    } else {
      list = list.filter((n) => n.status === options.status);
    }
  } else if (!options?.includeFuture) {
    const now = Date.now();
    list = list.filter((n) => n.status === 'Published' && new Date(n.publishedAt).getTime() <= now);
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

export async function getNewsBySlug(slug: string, options?: { allowFuture?: boolean }): Promise<News | null> {
  let item: News | null = null;
  if (isMysqlConfigured()) {
    try {
      item = await mysqlGetNewsBySlug(slug);
      if (!item) item = await mysqlGetNewsById(slug);
    } catch (err) {
      console.warn('MySQL getNewsBySlug failed, falling back to local store:', err);
    }
  }
  if (!item) {
    const db = ensureDb();
    item = db.news.find((n) => n.slug === slug || n.id === slug) || null;
  }

  if (item && !options?.allowFuture && item.status === 'Published') {
    if (new Date(item.publishedAt).getTime() > Date.now()) {
      return null;
    }
  }

  return item;
}

export async function getNewsById(id: string): Promise<News | null> {
  if (isMysqlConfigured()) {
    try {
      const item = await mysqlGetNewsById(id);
      if (item) return item;
      const bySlug = await mysqlGetNewsBySlug(id);
      if (bySlug) return bySlug;
    } catch (err) {
      console.warn('MySQL getNewsById failed, falling back to local store:', err);
    }
  }

  const db = ensureDb();
  const found = db.news.find((n) => n.id === id || n.slug === id);
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
  const existing = await getNewsById(id);
  if (!existing) return null;

  const db = ensureDb();
  const now = new Date().toISOString();

  let updatedSlug = existing.slug;
  if (data.slug && data.slug !== existing.slug) {
    let baseSlug = slugify(data.slug);
    let candidate = baseSlug;
    let counter = 1;
    while (db.news.some((n) => n.slug === candidate && n.id !== existing.id)) {
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

  const index = db.news.findIndex((n) => n.id === existing.id || n.slug === existing.slug);
  if (index !== -1) {
    db.news[index] = updated;
  } else {
    db.news.unshift(updated);
  }
  saveDb(db);
  return updated;
}

export async function deleteNews(id: string): Promise<boolean> {
  let deletedFromMysql = false;
  if (isMysqlConfigured()) {
    try {
      deletedFromMysql = await mysqlDeleteNews(id);
      if (!deletedFromMysql) {
        const item = await mysqlGetNewsBySlug(id);
        if (item) {
          deletedFromMysql = await mysqlDeleteNews(item.id);
        }
      }
    } catch (err) {
      console.warn('MySQL deleteNews failed:', err);
    }
  }

  const db = ensureDb();
  const initialLength = db.news.length;
  db.news = db.news.filter((n) => n.id !== id && n.slug !== id);
  const deletedFromLocal = db.news.length !== initialLength;
  if (deletedFromLocal) {
    saveDb(db);
  }

  return deletedFromMysql || deletedFromLocal;
}

/* ================== DASHBOARD METRICS ================== */

export async function getDashboardStats() {
  const allBroadcasts = await getBroadcasts();
  const allNews = await getNewsList();

  const activeBroadcasts = allBroadcasts.filter((b) => b.status !== 'Archived');
  const totalBroadcasts = activeBroadcasts.length;
  const publishedBroadcasts = allBroadcasts.filter((b) => b.status === 'Published').length;
  const draftBroadcasts = allBroadcasts.filter((b) => b.status === 'Draft').length;
  const archivedBroadcasts = allBroadcasts.filter((b) => b.status === 'Archived').length;

  const activeNews = allNews.filter((n) => n.status !== 'Archived');
  const totalNews = activeNews.length;
  const publishedNews = allNews.filter((n) => n.status === 'Published').length;
  const draftNews = allNews.filter((n) => n.status === 'Draft').length;
  const archivedNews = allNews.filter((n) => n.status === 'Archived').length;

  return {
    totalBroadcasts,
    publishedBroadcasts,
    draftBroadcasts,
    archivedBroadcasts,
    totalNews,
    publishedNews,
    draftNews,
    archivedNews,
    recentBroadcasts: activeBroadcasts.slice(0, 5),
    recentNews: activeNews.slice(0, 5),
  };
}

/* ================== SETTINGS OPERATIONS ================== */

export async function getSiteSettings(): Promise<SiteSettings> {
  const db = ensureDb();
  return {
    ...defaultSettings,
    ...(db.settings || {}),
  };
}

export async function updateSiteSettings(partial: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = ensureDb();
  const current = db.settings || defaultSettings;
  const updated: SiteSettings = {
    ...current,
    ...partial,
  };
  db.settings = updated;
  saveDb(db);
  return updated;
}
