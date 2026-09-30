# 📻 Ruang Siar — Radio Visual & Platform Siaran Playlist YouTube

> **Panduan Sederhana & Ramah Pemula:** Dokumen ini ditulis khusus dengan bahasa sehari-hari agar siapa pun yang awam teknologi bisa memahami, menjalankan, dan mengunggah website ini ke GitHub dengan mudah.

---

## 🌟 1. Apa Itu Ruang Siar? (Penjelasan untuk Orang Awam)

Bayangkan Anda ingin punya **stasiun radio sendiri di internet**, tapi:
- Tidak punya server mahal untuk streaming audio 24 jam.
- Takut kena masalah hak cipta musik jika mengunggah lagu MP3 langsung.
- Ingin pendengar tidak cuma dengar suara penyiar, tapi juga bisa melihat video studio atau video klip musiknya.

**Ruang Siar adalah solusinya!**
Website ini menyatukan siaran suara/video penyiar dengan lagu-lagu resmi yang ada di **YouTube**. 

### 💡 Konsep Kerjanya Sederhana:
1. Penyiar merekam suara sapaan / opening siaran (misalnya: *"Halo selamat malam pendengar setia..."*).
2. Video opening tersebut diunggah ke YouTube.
3. Di YouTube, dibuatlah sebuah **Playlist**: video pertama adalah video sapaan penyiar tadi, disusul video klip lagu-lagu pilihan.
4. Anda cukup memasukkan link playlist YouTube tersebut ke halaman Admin (**CMS**) website ini.
5. Pengunjung website Anda tinggal klik tombol **Play**, dan siaran radio visual otomatis berputar lancar layaknya menonton TV / mendengarkan radio modern!

---

## 📚 2. Kamus Istilah Komputer (Biar Nggak Pusing)

| Istilah | Artinya dalam Bahasa Sehari-hari |
| :--- | :--- |
| **GitHub** | "Google Drive"-nya para pembuat website. Tempat menyimpan dan memamerkan file kodingan secara online dan aman. |
| **Repository (Repo)** | Folder proyek Anda di GitHub. |
| **Terminal** | Jendela hitam di laptop tempat kita mengetik perintah teks ke komputer. |
| **Localhost** | Website yang sedang berjalan di laptop Anda sendiri, belum bisa dibuka oleh orang lain di internet. |
| **CMS (Content Management System)** | Halaman admin / dapur redaksi website tempat Anda bisa menambah siaran atau menulis berita tanpa perlu mengubah kodingan sama sekali. |
| **Push** | Proses mengunggah (upload) perubahan dari laptop Anda ke GitHub. |
| **Commit** | "Save point" atau catatan rekaman perubahan yang Anda buat di proyek. |

---

## 🏷️ 3. Rekomendasi Nama & Judul di GitHub

Saat membuat repository di GitHub, gunakan informasi ini agar terlihat rapi dan profesional:

- **Repository Name (Nama Folder GitHub):** `ruang-siar`
- **Description (Deskripsi Singkat):**
  > `Platform Radio Visual & Siaran Streaming Berbasis Playlist YouTube Lengkap dengan Halaman CMS Admin.`
- **Website Topics / Tags:** `nextjs`, `radio-visual`, `youtube-playlist`, `cms-admin`, `streaming-radio`, `indonesia`

---

## 🚀 4. Cara Upload (Push) Proyek Ini ke GitHub untuk Pertama Kali

Ikuti 3 tahap mudah berikut:

### Tahap A: Buat Wadah (Repository) di GitHub
1. Buka browser dan kunjungi [https://github.com](https://github.com). Pastikan Anda sudah login ke akun GitHub Anda.
2. Di pojok kanan atas, klik tanda tambah (`+`) lalu pilih **New repository** (atau buka [github.com/new](https://github.com/new)).
3. Pada kolom **Repository name**, ketik: `ruang-siar`.
4. Pilih **Public** (agar bisa dilihat orang lain) atau **Private** (hanya Anda yang bisa lihat).
5. ⚠️ **PENTING:** Pada bagian *"Initialize this repository with"*, **JANGAN CENTANG** *Add a README file*, *.gitignore*, ataupun *license*. Biarkan semuanya kosong tanpa centang!
6. Klik tombol hijau **Create repository**.
7. Anda akan melihat halaman baru berisi alamat URL repository Anda, contohnya:
   `https://github.com/ahmadalvin92/ruang-siar.git`

---

### Tahap B: Jalankan Perintah di Terminal Laptop Anda
1. Buka aplikasi **Terminal** di laptop Mac Anda.
2. Pastikan Anda berada di dalam folder proyek ini dengan mengetik:
   ```bash
   cd /Users/alvin/Desktop/Ruang_Siar
   ```
3. Copy dan paste baris perintah di bawah ini **satu per satu** ke Terminal, lalu tekan `Enter`:

   ```bash
   # 1. Menyiapkan sistem Git di dalam folder ini
   git init -b main

   # 2. Menandai semua file proyek untuk siap diupload
   git add .

   # 3. Memberi nama catatan penyimpanan pertama
   git commit -m "Rilis awal proyek Ruang Siar"

   # 4. Menyambungkan laptop Anda ke alamat GitHub yang baru dibuat
   # (Pastikan URL di bawah sesuai dengan akun GitHub Anda)
   git remote add origin https://github.com/ahmadalvin92/ruang-siar.git

   # 5. Mengunggah semua file ke GitHub
   git push -u origin main
   ```

4. *Catatan saat pertama kali push:* Jika Terminal meminta login atau Password GitHub, GitHub sekarang mewajibkan **Personal Access Token (PAT)** sebagai pengganti password biasa, atau Anda bisa login via pop-up browser bila muncul.

---

## 💻 5. Cara Menjalankan Website Ini di Laptop Sendiri

Kapan pun Anda ingin membuka dan melihat website ini di laptop, ikuti langkah ini:

### Langkah 1: Pastikan Node.js Terpasang
Buka Terminal dan ketik:
```bash
node -v
```
Jika keluar angka (misalnya `v20.x.x` atau `v22.x.x`), berarti aman! Jika belum ada, download dan pasang dari website resmi: [nodejs.org](https://nodejs.org).

### Langkah 2: Buka Folder Proyek di Terminal
```bash
cd /Users/alvin/Desktop/Ruang_Siar
```

### Langkah 3: Install Kebutuhan Website (Hanya perlu sekali di awal)
```bash
npm install
```

### Langkah 4: Jalankan Mesin Website
```bash
npm run dev
```

### Langkah 5: Buka di Browser Anda
Setelah keluar tulisan `Ready in ...ms`, buka aplikasi Chrome/Safari/Brave dan kunjungi:
- 🌐 **Halaman Utama (Publik):** [http://localhost:3000](http://localhost:3000)
- 🔐 **Halaman Login Admin:** [http://localhost:3000/login](http://localhost:3000/login)
- 🎛️ **Halaman Dashboard CMS:** [http://localhost:3000/admin](http://localhost:3000/admin)

> **Akun Login Bawaan (Default):**
> - **Username:** `admin`
> - **Password:** `admin`

*(Untuk mematikan website, kembali ke jendela Terminal lalu tekan tombol keyboard `Ctrl` + `C`).*

---

## 🎙️ 6. Panduan Membuat Siaran Radio Baru

Bagi penyiar / pengelola konten, berikut alur kerja yang direkomendasikan:

1. **Rekam Suara:** Rekam suara pembuka siaran menggunakan HP atau mikrofon (format MP3).
2. **Buat Video Sederhana:** Gabungkan suara rekaman tadi dengan gambar cover siaran di aplikasi video (seperti CapCut, Canva, atau Filmora). Simpan sebagai video MP4 berdurasi 1-3 menit.
3. **Upload ke YouTube:** Unggah video MP4 tersebut ke channel YouTube Anda.
4. **Buat Playlist di YouTube:**
   - Jadikan video MP4 sapaan tadi sebagai **video nomor 1 (paling atas)** di playlist.
   - Tambahkan lagu-lagu YouTube pilihan di urutan berikutnya (nomor 2, 3, 4, dst).
   - Salin link playlist tersebut (contoh link playlist YouTube berakhiran: `list=PLxxxxxxxxx`).
5. **Input ke Website:**
   - Masuk ke `http://localhost:3000/login`.
   - Masuk ke menu **Tambah Siaran**.
   - Masukkan judul, nama penyiar, waktu siaran, dan tempel link playlist YouTube.
   - Klik **Simpan**. Siaran langsung tayang di beranda website!

---

## 🔄 7. Cara Mengirim Update ke GitHub di Masa Depan

Jika suatu saat Anda mengubah tampilan, mengedit teks, atau menambah fitur baru, cara mengupdate file di GitHub sangat singkat. Cukup ketik 3 baris ini di Terminal:

```bash
git add .
git commit -m "Update tampilan dan perbaikan tulisan"
git push
```
Semua perubahan otomatis tersimpan rapi di GitHub Anda!

---

## 📂 8. Mengenal Isi Folder Proyek Ini

Biar tidak bingung melihat banyak file, berikut panduan ringkasnya:

```text
Ruang_Siar/
├── public/              📁 Tempat foto/logo website (misal: logo Ruang Siar)
├── src/                 📁 Jantung dari website (kodingan tampilan & sistem)
│   ├── app/             📄 Halaman-halaman web (halaman depan, admin, login, berita)
│   ├── components/      🧩 Potongan tampilan (player musik, kartu siaran, tombol)
│   └── lib/             ⚙️ Mesin pembantu (pengatur playlist YouTube & data)
├── .env                 🔒 Kunci rahasia & password admin (tidak boleh di-upload ke publik)
├── .env.example         📋 Contoh format file .env untuk orang lain
├── .gitignore           🛡️ Daftar file yang otomatis dilarang masuk ke GitHub demi keamanan
├── package.json         📦 Daftar aplikasi dan alat pembantu yang dipakai website ini
└── README.md            📖 Buku panduan yang sedang Anda baca ini
```

---

## ❓ 9. Pertanyaan yang Sering Muncul (FAQ)

### Q: Apakah pengunjung website akan melihat iklan YouTube?
**Jawab:** Karena pemutar ini memakai player resmi dari YouTube (embed), kebijakan iklan mengikuti aturan YouTube dan pemilik lagu masing-masing.

### Q: Kenapa link video biasa ditolak saat input siaran?
**Jawab:** Sistem Ruang Siar dirancang khusus untuk memutar rangkaian acara (siaran + lagu-lagu). Karena itu, wajib menggunakan **Link Playlist YouTube**, bukan link video satuan biasa.

### Q: Kalau laptop saya mati, apakah website bisa dibuka orang lain?
**Jawab:** Website yang berjalan lewat `localhost:3000` hanya hidup di laptop Anda. Agar bisa dibuka oleh siapa saja di internet selama 24 jam (misalnya dengan alamat `www.ruangsiar.com`), website ini nantinya tinggal dihubungkan ke penyedia hosting gratis/mudah seperti **Vercel**.

---

<p align="center">
  Dibuat dengan ❤️ untuk kemajuan siaran radio & musik independen Indonesia.
</p>
