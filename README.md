# 📻 Ruang Siar — Platform Radio Visual & Media Penyiaran Digital Indonesia

[![Next.js 15](https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%204-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![YouTube API](https://img.shields.io/badge/YouTube-Data%20API%20v3-red?style=for-the-badge&logo=youtube)](https://developers.google.com/youtube/v3)
[![Google Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-orange?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Website Live](https://img.shields.io/badge/Production-ruangsiar.id-emerald?style=for-the-badge&logo=googlechrome)](https://ruangsiar.id)

> **Ruang Siar** adalah platform penyiaran digital dan radio audio-visual modern Indonesia. Menggabungkan kehangatan narasi penyiar dengan kurasi playlist resmi YouTube, didukung portal warta berita terintegrasi, analitik pengunjung realtime, asisten redaksi berbasis Google Gemini AI, serta sistem CMS mandiri berstandar industri.

🌐 **Website Resmi:** [https://ruangsiar.id](https://ruangsiar.id)  
🎛️ **Panel Kurator CMS:** [https://ruangsiar.id/admin](https://ruangsiar.id/admin)

---

## 📸 Tangkapan Layar Aplikasi (Screenshots Gallery)

### 1. Halaman Beranda & Pemutar Siaran Utama
Tampilan antarmuka beranda dengan pemutar siaran utama, kontrol audio/video, dan mode *Hanya Audio (MP3)*.

![01_homepage_hero](docs/screenshots/01_homepage_hero.png)

---

### 2. Widget Rundown Siaran (Interaktif & Default Collapsed)
Susunan rundown siaran yang tertutup rapi saat pertama kali halaman dibuka, menjaga tampilan tetap ringkas dan elegan.

![02_homepage_rundown_collapsed](docs/screenshots/02_homepage_rundown_collapsed.png)

---

### 3. Rundown Siaran Terbuka (Daftar Lagu & Track Jumper)
Daftar seluruh segmen siaran dan lagu dengan tombol putar langsung ke detik lagu tertentu di pemutar video.

![03_homepage_rundown_expanded](docs/screenshots/03_homepage_rundown_expanded.png)

---

### 4. Katalog Siaran & Arsip Episode
Koleksi episode siaran tematik Ruang Siar dengan filter kategori (Pagi, Siang, Sore, Malam).

![04_siaran_archive](docs/screenshots/04_siaran_archive.png)

---

### 5. Rubrik Warta Ruang Siar
Portal berita dan jurnalisme ekosistem penyiaran, musik, teknologi, dan tren terkini.

![05_warta_ruang_siar](docs/screenshots/05_warta_ruang_siar.png)

---

### 6. Detail Artikel Warta (Tipografi Editorial)
Halaman baca artikel warta dengan tata letak editorial yang nyaman, foto resolusi tinggi, dan format kaya teks.

![06_detail_berita](docs/screenshots/06_detail_berita.png)

---

### 7. Dashboard Admin CMS & Pelacak Pengunjung Realtime
Pantau jumlah pendengar aktif secara live, total kunjungan harian, serta grafik tren 7 hari terakhir.

![07_admin_dashboard](docs/screenshots/07_admin_dashboard.png)

---

### 8. Manajemen Warta & Sistem Penjadwalan (Scheduled Publishing)
Kelola artikel warta lengkap dengan indikator badge **Terjadwal**, tab filter status, dan aksi terbit/draf instan.

![08_admin_warta](docs/screenshots/08_admin_warta.png)

---

### 9. Manajemen Episode Siaran
Kelola episode siaran, sinkronisasi playlist YouTube, generator rundown otomatis, dan durasi siaran.

![09_admin_siaran](docs/screenshots/09_admin_siaran.png)

---

### 10. Pengaturan Website, Live Streaming & Monetisasi AdSense
Pusat kendali identitas website, switch mode YouTube Live Stream, konfigurasi Google AdSense, dan integrasi Google Analytics (GA4).

![10_admin_pengaturan](docs/screenshots/10_admin_pengaturan.png)

---

## 🌟 Fitur-Fitur Utama

### 🎙️ Penyiaran Radio & Audio-Visual Berbasis YouTube
- **Legal & Patuh Hak Cipta:** Menggunakan sematan resmi YouTube IFrame Player API sehingga royalti dan kepemilikan musik tetap aman bagi pemegang hak cipta.
- **Dual Mode Player:** Pilihan fleksibel antara tampilan video penuh atau mode **Hanya Audio (MP3 Mode)** untuk menghemat kuota pengunjung.
- **Playlist Chaining Otomatis:** Memutar rekaman sapaan penyiar diikuti lagu-lagu pilihan secara berkesinambungan tanpa henti.
- **Rundown Interaktif:** Setiap lagu dalam rundown memiliki timestamp yang dapat diklik untuk melompat langsung ke lagu bersangkutan di pemutar.
- **Dukungan YouTube Live Streaming:** Dukungan siaran langsung studio (live breaking news / live talkshow) dengan switch aktif/nonaktif dari admin.

### 📰 Rubrik Warta & Redaksi Jurnalisme
- **Rich Text Formatting:** Editor penulisan warta mendukung format teks cetak tebal (**Bold**), cetak miring (*Italic*), dan garis bawah (<u>Underline</u>).
- **Penjadwalan Terbit Otomatis (Scheduled News):** Warta dapat dijadwalkan untuk jam atau tanggal tertentu. Sistem menjamin artikel tidak bocor ke publik sebelum waktu yang ditentukan.
- **Indikator Badge Terjadwal di CMS:** Di halaman admin, artikel masa depan ditandai secara visual dengan status `🕒 Terjadwal` dan tab filter khusus.
- **SEO & OpenGraph Otomatis:** Setiap artikel dilengkapi tag meta deskripsi, thumbnail media sosial, slug ramah mesin pencari, dan sitemap XML dinamis.

### 📊 Analitik Pengunjung Realtime (Built-in Visitor Tracker)
- **Pelacak Pengunjung Aktif:** Menampilkan jumlah orang yang sedang membuka website dalam 5 menit terakhir.
- **Statistik Harian & Total:** Menghitung total page views dan pengunjung unik secara otomatis ke database MySQL tanpa dependensi pihak ketiga.
- **Grafik Tren 7 Hari:** Visualisasi tren kunjungan harian untuk mengevaluasi performa siaran dan artikel terpopuler.
- **Integrasi Google Analytics (GA4):** Kolom pengaturan Measurement ID GA4 yang dapat diatur langsung dari CMS.

### 🤖 Asisten Redaksi Cerdas (Google Gemini AI)
- Terintegrasi langsung di pojok panel kurator CMS.
- Membantu penyiar dan redaktur menyusun naskah siaran, merangkum berita, menyusun susunan rundown, dan mengecek ejaan.

### 🛡️ Keamanan & Manajemen Data
- **Tempat Sampah (Recycle Bin / Soft Delete):** Konten yang dihapus tersimpan di tempat sampah terlebih dahulu sebelum dapat dipulihkan (*Restore*) atau dihapus permanen.
- **Autentikasi Aman:** Session berbasis cookie HTTP-only dengan enkripsi HMAC SHA-256.

---

## 🛠️ Tumpukan Teknologi (Tech Stack)

| Lapisan | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) | Rendering hybrid (SSR, ISR, CSR) berkinerja tinggi |
| **UI Library** | [React 19](https://react.dev/) | Komponen antarmuka reaktif dan dinamis |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Desain gelap modern (Dark Slate & Amber Glow) |
| **Animasi** | [Framer Motion 12](https://www.framer.com/motion/) | Transisi mulus, dropdown, dan animasi rundown |
| **Ikonografi** | [Lucide React](https://lucide.dev/) | Paket ikon modern berformat SVG ringan |
| **Database** | [MySQL](https://www.mysql.com/) + `mysql2` | Penyimpanan data siaran, warta, pengaturan, dan analitik |
| **Penyimpanan Lokal** | Fallback JSON (`.data/db.json`) | Mode fail-safe otomatis bila koneksi database terputus |
| **Integrasi Eksternal** | YouTube Data API v3 & Google Gemini AI | Pemutar playlist, auto-fetch thumbnail & asisten AI |
| **Deployment** | cPanel CloudLinux Passenger / Node.js Standalone | Server hosting produksi dengan sertifikat SSL otomatis |

---

## 🚀 Panduan Memulai di Lokal (Local Development)

### 1. Kloning Repository
```bash
git clone git@github.com:ahmadalvin92/Ruang-Siar.git
cd Ruang-Siar
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Buat File Konfigurasi `.env`
Salin template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi database dan API key:
```env
NODE_ENV="development"
YOUTUBE_API_KEY="your_youtube_api_key"
NEXT_PUBLIC_APP_NAME="Ruang Siar"
NEXT_PUBLIC_APP_TAGLINE="Media & Radio Siar Kontemporer Indonesia"
ADMIN_USERNAME="sigit_kurniawan"
ADMIN_PASSWORD="YourSecurePassword"
DATABASE_URL="mysql://username:password@host:3306/database_name"
GEMINI_API_KEY="your_gemini_api_key"
```

### 4. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### 5. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 📂 Struktur Direktori Proyek

```text
Ruang_Siar/
├── docs/
│   └── screenshots/          📸 Tangkapan layar dokumentasi GitHub
├── public/                   📁 Aset statis publik (logo, ikon, robots.txt, ads.txt)
├── scripts/
│   └── capture_screenshots.js 🤖 Skrip otomatisasi tangkapan layar via Chrome CDP
├── src/
│   ├── app/                  📄 Halaman App Router Next.js
│   │   ├── (public)/         🌐 Halaman publik (Beranda, Siaran, Warta, Tentang, Redaksi)
│   │   ├── admin/            🎛️ Panel CMS Kurator (Dashboard, Siaran, Berita, Pengaturan, Sampah)
│   │   ├── api/              ⚡ Endpoint REST API (Broadcasts, News, Analytics, AI, Upload)
│   │   └── login/            🔐 Halaman autentikasi kurator
│   ├── components/           🧩 Komponen React UI (Player, Cards, Rundown, Grids, Modals)
│   ├── lib/                  ⚙️ Modul logika bisnis (MySQL pool, store, YouTube, auth, Gemini)
│   └── types/                📝 Definisi TypeScript (Broadcast, News, Settings, Stats)
├── .env.example              📋 Contoh variabel lingkungan
├── next.config.mjs           ⚡ Konfigurasi Next.js
├── package.json              📦 Manajemen dependensi proyek
└── README.md                 📖 Dokumentasi utama proyek
```

---

## 📄 Lisensi & Hak Cipta

Dikelola dan dikembangkan dengan bangga untuk ekosistem penyiaran independen Indonesia.  
Hak Cipta © 2026 **Ruang Siar** — *Ada Untuk Anda*. Seluruh hak cipta dilindungi undang-undang.
