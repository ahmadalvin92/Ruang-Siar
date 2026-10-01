import mysql, { Pool, RowDataPacket } from 'mysql2/promise';
import { Broadcast, News, BroadcastFormData, NewsFormData, ContentStatus, RundownItem } from '@/types';

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url || !url.startsWith('mysql://')) {
    return null;
  }
  if (!pool) {
    try {
      pool = mysql.createPool({
        uri: url,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10,
        idleTimeout: 60000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
      });
    } catch (err) {
      console.error('Failed to initialize MySQL pool:', err);
      return null;
    }
  }
  return pool;
}

export function isMysqlConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('mysql://'));
}

function parseRundown(raw: unknown): RundownItem[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as RundownItem[];
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return [];
    }
  }
  return [];
}

function rowToBroadcast(row: any): Broadcast {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    description: String(row.description || ''),
    youtubePlaylistUrl: String(row.youtubePlaylistUrl || ''),
    thumbnailUrl: row.thumbnailUrl || undefined,
    category: String(row.category || 'Umum'),
    duration: row.duration || undefined,
    rundown: parseRundown(row.rundown),
    status: (row.status as ContentStatus) || 'PUBLISHED',
    publishedAt: row.publishedAt instanceof Date ? row.publishedAt.toISOString() : String(row.publishedAt || new Date().toISOString()),
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt || new Date().toISOString()),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt || new Date().toISOString()),
  };
}

function rowToNews(row: any): News {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    excerpt: String(row.excerpt || ''),
    content: String(row.content || ''),
    thumbnailUrl: row.thumbnailUrl || undefined,
    category: String(row.category || 'Berita'),
    status: (row.status as ContentStatus) || 'PUBLISHED',
    publishedAt: row.publishedAt instanceof Date ? row.publishedAt.toISOString() : String(row.publishedAt || new Date().toISOString()),
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : String(row.createdAt || new Date().toISOString()),
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : String(row.updatedAt || new Date().toISOString()),
  };
}

/* ================== MYSQL BROADCAST QUERIES ================== */

export async function mysqlGetBroadcasts(options?: {
  status?: ContentStatus;
  search?: string;
  category?: string;
  limit?: number;
}): Promise<Broadcast[]> {
  const p = getDbPool();
  if (!p) throw new Error('MySQL pool not initialized');

  const conditions: string[] = [];
  const params: any[] = [];

  if (options?.status) {
    conditions.push('status = ?');
    params.push(options.status);
  }

  if (options?.category && options.category !== 'Semua') {
    conditions.push('LOWER(category) = LOWER(?)');
    params.push(options.category);
  }

  if (options?.search) {
    const q = `%${options.search}%`;
    conditions.push('(title LIKE ? OR description LIKE ? OR category LIKE ?)');
    params.push(q, q, q);
  }

  let sql = 'SELECT * FROM broadcasts';
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY publishedAt DESC';

  if (options?.limit) {
    sql += ` LIMIT ${Number(options.limit)}`;
  }

  const [rows] = await p.query<RowDataPacket[]>(sql, params);
  return rows.map(rowToBroadcast);
}

export async function mysqlGetBroadcastBySlug(slug: string): Promise<Broadcast | null> {
  const p = getDbPool();
  if (!p) throw new Error('MySQL pool not initialized');
  const [rows] = await p.query<RowDataPacket[]>('SELECT * FROM broadcasts WHERE slug = ? LIMIT 1', [slug]);
  if (!rows || rows.length === 0) return null;
  return rowToBroadcast(rows[0]);
}

export async function mysqlGetBroadcastById(id: string): Promise<Broadcast | null> {
  const p = getDbPool();
  if (!p) throw new Error('MySQL pool not initialized');
  const [rows] = await p.query<RowDataPacket[]>('SELECT * FROM broadcasts WHERE id = ? LIMIT 1', [id]);
  if (!rows || rows.length === 0) return null;
  return rowToBroadcast(rows[0]);
}

export async function mysqlInsertBroadcast(b: Broadcast): Promise<void> {
  const p = getDbPool();
  if (!p) throw new Error('MySQL pool not initialized');
  const rundownStr = b.rundown ? JSON.stringify(b.rundown) : null;
  await p.query(
    `INSERT INTO broadcasts (id, title, slug, description, youtubePlaylistUrl, thumbnailUrl, category, duration, rundown, status, publishedAt, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      b.id,
      b.title,
      b.slug,
      b.description,
      b.youtubePlaylistUrl,
      b.thumbnailUrl || null,
      b.category || 'Umum',
      b.duration || null,
      rundownStr,
      b.status,
      new Date(b.publishedAt),
      new Date(b.createdAt),
      new Date(b.updatedAt),
    ]
  );
}

export async function mysqlUpdateBroadcast(b: Broadcast): Promise<void> {
  const p = getDbPool();
  if (!p) throw new Error('MySQL pool not initialized');
  const rundownStr = b.rundown ? JSON.stringify(b.rundown) : null;
  await p.query(
    `UPDATE broadcasts SET title = ?, slug = ?, description = ?, youtubePlaylistUrl = ?, thumbnailUrl = ?, category = ?, duration = ?, rundown = ?, status = ?, publishedAt = ?, updatedAt = ?
     WHERE id = ?`,
    [
      b.title,
      b.slug,
      b.description,
      b.youtubePlaylistUrl,
      b.thumbnailUrl || null,
      b.category,
      b.duration || null,
      rundownStr,
      b.status,
      new Date(b.publishedAt),
      new Date(b.updatedAt),
      b.id,
    ]
  );
}

export async function mysqlDeleteBroadcast(id: string): Promise<boolean> {
  const p = getDbPool();
  if (!p) throw new Error('MySQL pool not initialized');
  const [res]: any = await p.query('DELETE FROM broadcasts WHERE id = ?', [id]);
  return res.affectedRows > 0;
}

/* ================== MYSQL NEWS QUERIES ================== */

export async function mysqlGetNews(options?: {
  status?: ContentStatus;
  search?: string;
  category?: string;
  limit?: number;
}): Promise<News[]> {
  const p = getDbPool();
  if (!p) throw new Error('MySQL pool not initialized');

  const conditions: string[] = [];
  const params: any[] = [];

  if (options?.status) {
    conditions.push('status = ?');
    params.push(options.status);
  }

  if (options?.category && options.category !== 'Semua') {
    conditions.push('LOWER(category) = LOWER(?)');
    params.push(options.category);
  }

  if (options?.search) {
    const q = `%${options.search}%`;
    conditions.push('(title LIKE ? OR excerpt LIKE ? OR content LIKE ?)');
    params.push(q, q, q);
  }

  let sql = 'SELECT * FROM news';
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY publishedAt DESC';

  if (options?.limit) {
    sql += ` LIMIT ${Number(options.limit)}`;
  }

  const [rows] = await p.query<RowDataPacket[]>(sql, params);
  return rows.map(rowToNews);
}

export async function mysqlGetNewsBySlug(slug: string): Promise<News | null> {
  const p = getDbPool();
  if (!p) throw new Error('MySQL pool not initialized');
  const [rows] = await p.query<RowDataPacket[]>('SELECT * FROM news WHERE slug = ? LIMIT 1', [slug]);
  if (!rows || rows.length === 0) return null;
  return rowToNews(rows[0]);
}

export async function mysqlGetNewsById(id: string): Promise<News | null> {
  const p = getDbPool();
  if (!p) throw new Error('MySQL pool not initialized');
  const [rows] = await p.query<RowDataPacket[]>('SELECT * FROM news WHERE id = ? LIMIT 1', [id]);
  if (!rows || rows.length === 0) return null;
  return rowToNews(rows[0]);
}

export async function mysqlInsertNews(n: News): Promise<void> {
  const p = getDbPool();
  if (!p) throw new Error('MySQL pool not initialized');
  await p.query(
    `INSERT INTO news (id, title, slug, excerpt, content, thumbnailUrl, category, status, publishedAt, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      n.id,
      n.title,
      n.slug,
      n.excerpt,
      n.content,
      n.thumbnailUrl || null,
      n.category || 'Berita',
      n.status,
      new Date(n.publishedAt),
      new Date(n.createdAt),
      new Date(n.updatedAt),
    ]
  );
}

export async function mysqlUpdateNews(n: News): Promise<void> {
  const p = getDbPool();
  if (!p) throw new Error('MySQL pool not initialized');
  await p.query(
    `UPDATE news SET title = ?, slug = ?, excerpt = ?, content = ?, thumbnailUrl = ?, category = ?, status = ?, publishedAt = ?, updatedAt = ?
     WHERE id = ?`,
    [
      n.title,
      n.slug,
      n.excerpt,
      n.content,
      n.thumbnailUrl || null,
      n.category,
      n.status,
      new Date(n.publishedAt),
      new Date(n.updatedAt),
      n.id,
    ]
  );
}

export async function mysqlDeleteNews(id: string): Promise<boolean> {
  const p = getDbPool();
  if (!p) throw new Error('MySQL pool not initialized');
  const [res]: any = await p.query('DELETE FROM news WHERE id = ?', [id]);
  return res.affectedRows > 0;
}
