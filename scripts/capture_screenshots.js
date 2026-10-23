const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');

const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Generate Admin Token
const secret = 'ganti-rahasia-ini-sebelum-produksi';
const sign = (val) => crypto.createHmac('sha256', secret).update(val).digest('hex');
const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
const payload = 'sigit_kurniawan.' + expiresAt;
const adminToken = payload + '.' + sign(payload);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function main() {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const userDataDir = '/tmp/rs_chrome_shot_' + Date.now();
  const port = 9222;

  console.log('Launching Headless Chrome...');
  const chromeProc = spawn(chromePath, [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    'about:blank',
  ]);

  // Wait for Chrome to listen
  let wsUrl = '';
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      const version = await fetchJson(`http://127.0.0.1:${port}/json/version`);
      wsUrl = version.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch (_) {}
  }

  if (!wsUrl) {
    console.error('Failed to get WebSocket Debugger URL');
    chromeProc.kill();
    process.exit(1);
  }

  console.log('Connected to Chrome CDP:', wsUrl);
  const client = new CDPClient(wsUrl);
  await client.connect();

  // Create a new target page
  const { targetId } = await client.send('Target.createTarget', { url: 'about:blank' });
  const targets = await fetchJson(`http://127.0.0.1:${port}/json`);
  const pageTarget = targets.find((t) => t.id === targetId) || targets[0];
  client.close();

  const pageClient = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await pageClient.connect();

  await pageClient.send('Page.enable');
  await pageClient.send('Network.enable');
  await pageClient.send('Runtime.enable');

  // Set viewport: 1440 x 900, 2x scale (retina)
  await pageClient.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });

  // Set admin session cookie
  await pageClient.send('Network.setCookie', {
    name: 'ruang_siar_admin_session',
    value: adminToken,
    domain: 'ruangsiar.id',
    path: '/',
    secure: true,
  });

  const screenshots = [
    {
      name: '01_homepage_hero.png',
      url: 'https://ruangsiar.id',
      waitMs: 3000,
      description: 'Halaman Beranda dengan Pemutar Siaran Utama',
    },
    {
      name: '02_homepage_rundown_collapsed.png',
      url: 'https://ruangsiar.id',
      waitMs: 3000,
      action: async (c) => {
        // Scroll slightly down to showcase the rundown widget
        await c.send('Runtime.evaluate', {
          expression: 'window.scrollTo({ top: 700, behavior: "instant" })',
        });
        await sleep(500);
      },
      description: 'Widget Rundown Siaran dalam kondisi default (collapsed/tertutup rapi)',
    },
    {
      name: '03_homepage_rundown_expanded.png',
      url: 'https://ruangsiar.id',
      waitMs: 3000,
      action: async (c) => {
        await c.send('Runtime.evaluate', {
          expression: `
            window.scrollTo({ top: 700, behavior: "instant" });
            const btn = document.querySelector('button[title*="rundown"], button:has(svg), .cursor-pointer');
            const btns = Array.from(document.querySelectorAll('button'));
            const rundownBtn = btns.find(b => b.textContent && b.textContent.includes('Lihat Rundown'));
            if (rundownBtn) rundownBtn.click();
          `,
        });
        await sleep(1000);
      },
      description: 'Widget Rundown terbuka dengan daftar lagu & bagian yang dapat diklik',
    },
    {
      name: '04_siaran_archive.png',
      url: 'https://ruangsiar.id/siaran',
      waitMs: 3000,
      description: 'Katalog Episode Siaran Ruang Siar',
    },
    {
      name: '05_warta_ruang_siar.png',
      url: 'https://ruangsiar.id/berita',
      waitMs: 3000,
      description: 'Rubrik Warta Ruang Siar & Artikel Terkini',
    },
    {
      name: '06_detail_berita.png',
      url: 'https://ruangsiar.id/berita/mulai-25-oktober-umk-yang-jual-produk-lokal-dapat-potongan-biaya-marketplace-50-persen',
      waitMs: 3000,
      description: 'Halaman Baca Warta dengan tipografi editorial',
    },
    {
      name: '07_admin_dashboard.png',
      url: 'https://ruangsiar.id/admin',
      waitMs: 3000,
      description: 'Dashboard Admin CMS & Analitik Pengunjung Realtime',
    },
    {
      name: '08_admin_warta.png',
      url: 'https://ruangsiar.id/admin/berita',
      waitMs: 3000,
      description: 'Kelola Warta di Admin CMS lengkap dengan badge Terjadwal dan filter status',
    },
    {
      name: '09_admin_siaran.png',
      url: 'https://ruangsiar.id/admin/siaran',
      waitMs: 3000,
      description: 'Kelola Episode Siaran & YouTube Playlist di Admin CMS',
    },
    {
      name: '10_admin_pengaturan.png',
      url: 'https://ruangsiar.id/admin/pengaturan',
      waitMs: 3000,
      description: 'Pengaturan CMS (Live Streaming Mode, AI Assistant, SEO & Monetisasi AdSense)',
    },
  ];

  for (const item of screenshots) {
    console.log(`Navigating to ${item.url} -> ${item.name}...`);
    try {
      await pageClient.send('Page.navigate', { url: item.url });
      await sleep(item.waitMs || 2500);

      if (item.action) {
        await item.action(pageClient);
      }

      const { data } = await pageClient.send('Page.captureScreenshot', {
        format: 'png',
      });

      const outPath = path.join(SCREENSHOT_DIR, item.name);
      fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
      console.log(`Saved: ${outPath} (${(Buffer.from(data, 'base64').length / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`Error capturing ${item.name}:`, e.message);
    }
  }

  pageClient.close();
  chromeProc.kill();
  console.log('All screenshots captured successfully!');
}

main().catch(console.error);
