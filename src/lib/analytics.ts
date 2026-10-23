import fs from 'fs';
import path from 'path';
import { getDbPool, isMysqlConfigured } from '@/lib/data/mysql';

export interface AnalyticsSummary {
  activeUsersOnline: number;
  todayPageviews: number;
  totalPageviews: number;
  todayUniqueVisitors: number;
  totalUniqueVisitors: number;
  history7Days: { date: string; label: string; views: number; visitors: number }[];
  topPages: { path: string; title: string; views: number }[];
}

interface LocalAnalyticsStore {
  sessions: { [visitorId: string]: { lastActive: string; path: string; title: string } };
  views: { id: string; visitorId: string; path: string; title: string; date: string; timestamp: number }[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const LOCAL_ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

function getLocalStore(): LocalAnalyticsStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(LOCAL_ANALYTICS_FILE)) {
      const content = fs.readFileSync(LOCAL_ANALYTICS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch {}
  return { sessions: {}, views: [] };
}

function saveLocalStore(store: LocalAnalyticsStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Keep only last 10,000 views to prevent file growth
    if (store.views.length > 10000) {
      store.views = store.views.slice(-10000);
    }
    fs.writeFileSync(LOCAL_ANALYTICS_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch {}
}

/**
 * Record a pageview or heartbeat event
 */
export async function recordVisit(data: {
  visitorId: string;
  path: string;
  pageTitle?: string;
}): Promise<boolean> {
  const visitorId = (data.visitorId || 'anon').substring(0, 64);
  const reqPath = (data.path || '/').substring(0, 255);
  const pageTitle = (data.pageTitle || '').substring(0, 255);

  // Ignore admin and API paths from public analytics
  if (reqPath.startsWith('/admin') || reqPath.startsWith('/api')) {
    return true;
  }

  // 1. Try MySQL if configured
  if (isMysqlConfigured()) {
    try {
      const pool = getDbPool();
      if (pool) {
        // Upsert active session
        await pool.query(
          `INSERT INTO visitor_sessions (visitor_id, current_path, page_title, last_active, created_at)
           VALUES (?, ?, ?, NOW(), NOW())
           ON DUPLICATE KEY UPDATE current_path = VALUES(current_path), page_title = VALUES(page_title), last_active = NOW()`,
          [visitorId, reqPath, pageTitle]
        );

        // Record pageview
        await pool.query(
          `INSERT INTO page_views (visitor_id, path, page_title, created_at, view_date)
           VALUES (?, ?, ?, NOW(), CURDATE())`,
          [visitorId, reqPath, pageTitle]
        );

        // Periodic cleanup of sessions older than 2 days (1 out of 50 calls)
        if (Math.random() < 0.02) {
          pool.query(`DELETE FROM visitor_sessions WHERE last_active < NOW() - INTERVAL 2 DAY`).catch(() => {});
        }

        return true;
      }
    } catch (err) {
      console.error('MySQL recordVisit error, falling back to local store:', err);
    }
  }

  // 2. Fallback to Local JSON store
  try {
    const store = getLocalStore();
    store.sessions[visitorId] = {
      lastActive: new Date().toISOString(),
      path: reqPath,
      title: pageTitle,
    };

    const todayStr = new Date().toISOString().split('T')[0];
    store.views.push({
      id: Math.random().toString(36).substring(2, 10),
      visitorId,
      path: reqPath,
      title: pageTitle,
      date: todayStr,
      timestamp: Date.now(),
    });

    saveLocalStore(store);
    return true;
  } catch (err) {
    console.error('Local recordVisit error:', err);
    return false;
  }
}

/**
 * Get comprehensive analytics summary
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  // 1. Try MySQL
  if (isMysqlConfigured()) {
    try {
      const pool = getDbPool();
      if (pool) {
        // Active users online in the last 5 minutes (300 seconds)
        const [activeRows]: any = await pool.query(
          `SELECT COUNT(*) as count FROM visitor_sessions WHERE last_active >= NOW() - INTERVAL 5 MINUTE`
        );
        const activeUsersOnline = Math.max(1, Number(activeRows?.[0]?.count || 0));

        // Today's pageviews
        const [todayPvRows]: any = await pool.query(
          `SELECT COUNT(*) as count FROM page_views WHERE view_date = CURDATE()`
        );
        const todayPageviews = Number(todayPvRows?.[0]?.count || 0);

        // Total pageviews
        const [totalPvRows]: any = await pool.query(
          `SELECT COUNT(*) as count FROM page_views`
        );
        const totalPageviews = Number(totalPvRows?.[0]?.count || 0);

        // Today's unique visitors
        const [todayUvRows]: any = await pool.query(
          `SELECT COUNT(DISTINCT visitor_id) as count FROM page_views WHERE view_date = CURDATE()`
        );
        const todayUniqueVisitors = Number(todayUvRows?.[0]?.count || 0);

        // Total unique visitors
        const [totalUvRows]: any = await pool.query(
          `SELECT COUNT(DISTINCT visitor_id) as count FROM page_views`
        );
        const totalUniqueVisitors = Number(totalUvRows?.[0]?.count || 0);

        // History 7 days
        const [historyRows]: any = await pool.query(
          `SELECT view_date, COUNT(*) as views, COUNT(DISTINCT visitor_id) as visitors
           FROM page_views
           WHERE view_date >= CURDATE() - INTERVAL 6 DAY
           GROUP BY view_date
           ORDER BY view_date ASC`
        );

        const historyMap = new Map<string, { views: number; visitors: number }>();
        for (const row of historyRows) {
          const dStr = row.view_date instanceof Date ? row.view_date.toISOString().split('T')[0] : String(row.view_date).substring(0, 10);
          historyMap.set(dStr, { views: Number(row.views || 0), visitors: Number(row.visitors || 0) });
        }

        // Build 7-day array
        const history7Days: AnalyticsSummary['history7Days'] = [];
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const item = historyMap.get(dateStr) || { views: 0, visitors: 0 };
          history7Days.push({
            date: dateStr,
            label: `${dayNames[d.getDay()]} (${d.getDate()}/${d.getMonth() + 1})`,
            views: item.views,
            visitors: item.visitors,
          });
        }

        // Top pages
        const [topRows]: any = await pool.query(
          `SELECT path, MAX(page_title) as title, COUNT(*) as views
           FROM page_views
           WHERE path NOT LIKE '/admin%' AND path NOT LIKE '/api%'
           GROUP BY path
           ORDER BY views DESC
           LIMIT 5`
        );

        const topPages = topRows.map((r: any) => ({
          path: String(r.path || '/'),
          title: String(r.title || r.path || 'Beranda'),
          views: Number(r.views || 0),
        }));

        return {
          activeUsersOnline,
          todayPageviews,
          totalPageviews,
          todayUniqueVisitors,
          totalUniqueVisitors,
          history7Days,
          topPages,
        };
      }
    } catch (err) {
      console.error('MySQL getAnalyticsSummary error, falling back to local store:', err);
    }
  }

  // 2. Fallback to Local JSON store
  const store = getLocalStore();
  const now = Date.now();
  const fiveMinAgo = now - 5 * 60 * 1000;
  const todayStr = new Date().toISOString().split('T')[0];

  // Active users
  let activeUsersOnline = 0;
  for (const session of Object.values(store.sessions)) {
    const lastTime = new Date(session.lastActive).getTime();
    if (lastTime >= fiveMinAgo) {
      activeUsersOnline++;
    }
  }
  activeUsersOnline = Math.max(1, activeUsersOnline);

  // Today views
  const todayViews = store.views.filter((v) => v.date === todayStr);
  const todayPageviews = todayViews.length;
  const totalPageviews = store.views.length;

  // Unique visitors
  const todayUniqueVisitors = new Set(todayViews.map((v) => v.visitorId)).size;
  const totalUniqueVisitors = new Set(store.views.map((v) => v.visitorId)).size;

  // 7-day history
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const history7Days: AnalyticsSummary['history7Days'] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayViews = store.views.filter((v) => v.date === dateStr);
    const dayVisitors = new Set(dayViews.map((v) => v.visitorId)).size;

    history7Days.push({
      date: dateStr,
      label: `${dayNames[d.getDay()]} (${d.getDate()}/${d.getMonth() + 1})`,
      views: dayViews.length,
      visitors: dayVisitors,
    });
  }

  // Top pages
  const pageMap: { [path: string]: { path: string; title: string; views: number } } = {};
  for (const v of store.views) {
    if (!pageMap[v.path]) {
      pageMap[v.path] = { path: v.path, title: v.title || v.path, views: 0 };
    }
    pageMap[v.path].views++;
  }
  const topPages = Object.values(pageMap)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return {
    activeUsersOnline,
    todayPageviews,
    totalPageviews,
    todayUniqueVisitors,
    totalUniqueVisitors,
    history7Days,
    topPages,
  };
}
