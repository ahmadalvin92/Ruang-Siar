'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { SiteSettings, ScheduleItem } from '@/types';
import {
  Settings,
  Save,
  Loader2,
  Mail,
  MapPin,
  Clock,
  Plus,
  Trash2,
  DollarSign,
  Info,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  BarChart3,
  Globe,
} from 'lucide-react';
import { YoutubeIcon, InstagramIcon, TwitterIcon } from '@/components/icons';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (err: any) {
      setErrorMessage('Gagal memuat pengaturan.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage('Pengaturan dan konfigurasi AdSense berhasil disimpan!');
        setSettings(data.data);
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        setErrorMessage(data.error || 'Gagal menyimpan pengaturan');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setSaving(false);
    }
  };

  const handleScheduleChange = (index: number, field: keyof ScheduleItem, val: string) => {
    if (!settings) return;
    const newSchedules = [...settings.schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: val };
    setSettings({ ...settings, schedules: newSchedules });
  };

  const addSchedule = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      schedules: [
        ...settings.schedules,
        { time: '00:00 – 00:00', name: 'Sesi Baru', color: 'text-amber-400' },
      ],
    });
  };

  const removeSchedule = (index: number) => {
    if (!settings) return;
    const newSchedules = settings.schedules.filter((_, i) => i !== index);
    setSettings({ ...settings, schedules: newSchedules });
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="Pengaturan CMS & Monetisasi"
        subtitle="Kelola identitas website, tautan sosial media, info kontak, jadwal siaran, dan Google AdSense"
      />
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {/* Header Title inside card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2.5">
              <Settings className="w-6 h-6 text-amber-500" /> Konfigurasi Website & AdSense
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Sesuaikan identitas siaran, tautan media sosial, jadwal harian, dan integrasi monetisasi iklan resmi.
            </p>
          </div>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: Profil & Identitas Website */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-6">
            <div className="border-b border-slate-800/80 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>1. Profil & Identitas Web</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Ditampilkan di header, footer, dan meta data pencarian Google.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Nama Website</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="Ruang Siar"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Tagline Website</label>
                <input
                  type="text"
                  value={settings.siteTagline}
                  onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="Media & Radio Siar Kontemporer Indonesia"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-2">Deskripsi Website (Footer & SEO)</label>
                <textarea
                  rows={3}
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                  placeholder="Deskripsi platform..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Teks Badge Siaran Aktif</label>
                <input
                  type="text"
                  value={settings.activeStatusText}
                  onChange={(e) => setSettings({ ...settings, activeStatusText: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="Siaran Aktif — 24 Jam"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Sosial Media & Kontak */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-6">
            <div className="border-b border-slate-800/80 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>2. Media Sosial & Info Kontak</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pengaturan ikon Instagram, YouTube, Twitter/X, dan alamat redaksi di footer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <InstagramIcon className="w-4 h-4 text-pink-400" /> Tautan Instagram
                </label>
                <input
                  type="url"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="https://instagram.com/ruangsiar.id"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <YoutubeIcon className="w-4 h-4 text-red-500" /> Tautan Channel YouTube
                </label>
                <input
                  type="url"
                  value={settings.youtubeUrl}
                  onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="https://youtube.com/@ruangsiar"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <TwitterIcon className="w-4 h-4 text-sky-400" /> Tautan Twitter / X
                </label>
                <input
                  type="url"
                  value={settings.twitterUrl}
                  onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="https://x.com/ruangsiar"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" /> Email Redaksi / Kerjasama
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="redaksi@ruangsiar.id"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold text-sm">WA</span> Nomor WhatsApp Redaksi
                </label>
                <input
                  type="text"
                  value={settings.whatsappNumber || ''}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="+62 896-3017-2935"
                />
              </div>

              {/* Webmail Hosting Active Card */}
              <div className="md:col-span-2 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-slate-900 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">Akun Email Hosting Aktif: <code className="text-amber-400">redaksi@ruangsiar.id</code></span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Email resmi domain sudah terkonfigurasi di server hosting. Anda bisa membaca &amp; mengirim email via Webmail browser atau menghubungkannya ke aplikasi Gmail/HP.
                  </p>
                </div>
                <a
                  href="https://ruangsiar.id:2096"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-all shadow-md shadow-amber-500/10"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Buka Webmail Kotak Masuk</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </a>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" /> Lokasi / Studio
                </label>
                <input
                  type="text"
                  value={settings.contactLocation}
                  onChange={(e) => setSettings({ ...settings, contactLocation: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="Jakarta Selatan, Indonesia"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Jadwal Siar Footer */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" /> 3. Jadwal Siaran (Footer)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Daftar jam siar yang tampil pada bagian kolom tengah footer.
                </p>
              </div>
              <button
                type="button"
                onClick={addSchedule}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Baris
              </button>
            </div>

            <div className="space-y-3">
              {settings.schedules.map((item, index) => (
                <div key={index} className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <input
                    type="text"
                    value={item.time}
                    onChange={(e) => handleScheduleChange(index, 'time', e.target.value)}
                    placeholder="Waktu (e.g. 06:00 – 09:00)"
                    className="w-1/3 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleScheduleChange(index, 'name', e.target.value)}
                    placeholder="Nama Program / Sesi"
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                  />
                  <select
                    value={item.color}
                    onChange={(e) => handleScheduleChange(index, 'color', e.target.value)}
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-500 focus:outline-none"
                  >
                    <option value="text-amber-400">Kuning / Amber</option>
                    <option value="text-orange-400">Orange</option>
                    <option value="text-rose-400">Merah / Rose</option>
                    <option value="text-purple-400">Ungu / Purple</option>
                    <option value="text-sky-400">Biru / Sky</option>
                    <option value="text-emerald-400">Hijau / Emerald</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Google AdSense & Monetisasi */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950 border border-amber-500/30 p-6 space-y-6 shadow-xl">
            <div className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-400" /> 4. Konfigurasi Google AdSense & Monetisasi
                </h2>
                <p className="text-xs text-slate-300 mt-0.5">
                  Pasang kode iklan Google AdSense resmi untuk mulai menghasilkan pendapatan dari pengunjung website.
                </p>
              </div>

              {/* Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={settings.adSenseEnabled || false}
                  onChange={(e) => setSettings({ ...settings, adSenseEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                <span className="ml-3 text-xs font-bold text-slate-200">
                  {settings.adSenseEnabled ? 'AdSense Aktif' : 'AdSense Nonaktif'}
                </span>
              </label>
            </div>

            {/* Panduan Penghasilan AdSense */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-300 space-y-2 leading-relaxed">
              <div className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
                <Info className="w-4 h-4 shrink-0" /> Bagaimana Cara Kerja & Alur Penghasilan Google AdSense?
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li>
                  <strong className="text-white">Pendaftaran:</strong> Anda mendaftarkan domain <code className="text-amber-400">ruangsiar.id</code> di <a href="https://adsense.google.com" target="_blank" rel="noreferrer" className="underline text-amber-400">Google AdSense</a>.
                </li>
                <li>
                  <strong className="text-white">Publisher ID:</strong> Setelah akun AdSense Anda disetujui, masukkan <em>Publisher ID</em> (contoh: <code className="text-amber-400">ca-pub-1234567890123456</code>) di kolom bawah.
                </li>
                <li>
                  <strong className="text-white">Penghasilan Masuk Ke Mana?</strong> Semua saldo klik (CPC) dan tayangan (CPM) akan langsung terkumpul di akun <strong>Google AdSense milik Anda sendiri</strong> secara transparan.
                </li>
                <li>
                  <strong className="text-white">Pencairan Dana (Payout):</strong> Google akan mentransfer uangnya setiap bulan (biasanya tanggal 21-26) langsung ke <strong>rekening bank lokal Indonesia Anda</strong> (BCA, Mandiri, BRI, dll) setelah mencapai ambang batas minimal ($100 atau Rp1.300.000).
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Publisher ID (Client ID AdSense)
                </label>
                <input
                  type="text"
                  value={settings.adSensePublisherId || ''}
                  onChange={(e) => setSettings({ ...settings, adSensePublisherId: e.target.value.trim() })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
                  placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Ditemukan di menu Akun → Informasi Akun di dashboard Google AdSense Anda.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Slot ID Leaderboard (Banner Horizontal Atas/Bawah)
                </label>
                <input
                  type="text"
                  value={settings.adSenseSlotLeaderboard || ''}
                  onChange={(e) => setSettings({ ...settings, adSenseSlotLeaderboard: e.target.value.trim() })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
                  placeholder="Contoh: 1234567890 (Opsional)"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Slot ID Rectangle (Kotak Sidebar/Widget)
                </label>
                <input
                  type="text"
                  value={settings.adSenseSlotRectangle || ''}
                  onChange={(e) => setSettings({ ...settings, adSenseSlotRectangle: e.target.value.trim() })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
                  placeholder="Contoh: 9876543210 (Opsional)"
                />
              </div>
            </div>
          </div>

          {/* Section: Google Analytics 4 (GA4) Tracking */}
          <div id="google-analytics" className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <span>Google Analytics 4 (GA4) & Pelacakan Pengunjung</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hubungkan akun Google Analytics resmi untuk memantau grafik kunjungan, lokasi kota pembaca, dan laporan realtime resmi Google.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  settings.googleAnalyticsId && settings.googleAnalyticsId.startsWith('G-')
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {settings.googleAnalyticsId && settings.googleAnalyticsId.startsWith('G-')
                    ? '✓ GA4 Terhubung'
                    : 'Belum Terhubung'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  ID Pengukuran Google Analytics (Measurement ID)
                </label>
                <input
                  type="text"
                  value={settings.googleAnalyticsId || ''}
                  onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value.trim() })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:border-amber-500 focus:outline-none"
                  placeholder="Contoh: G-XXXXXXXXXX"
                />
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>Ditemukan di dashboard <a href="https://analytics.google.com" target="_blank" rel="noreferrer" className="text-purple-400 underline">Google Analytics</a> → Admin → Aliran Data (Data Streams) → ID Pengukuran (G-XXXX).</span>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-purple-300 flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  Keuntungan Memasang Google Analytics (GA4):
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] pl-1">
                  <li>Laporan realtime berapa orang yang sedang aktif detik ini dan dari provinsi/kota mana saja mereka mengakses.</li>
                  <li>Pelacakan resmi Google yang otomatis memperkuat kelayakan peninjauan dan skor kepercayaan Google AdSense.</li>
                  <li>Grafik kunjungan bulanan, demografi pembaca, dan perbandingan pengguna HP vs Laptop.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5: Kelola Konten Halaman Tentang Kami */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-6">
            <div className="border-b border-slate-800/80 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>5. Konten Halaman &quot;Tentang Kami&quot; (/tentang)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kustomisasi narasi filosofi, visi platform, dan pesan redaksi untuk pembaca.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Teks Badge Atas
                  </label>
                  <input
                    type="text"
                    value={settings.aboutBadge || ''}
                    onChange={(e) => setSettings({ ...settings, aboutBadge: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                    placeholder="Filosofi & Visi Platform"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Judul Utama Filosofi
                  </label>
                  <input
                    type="text"
                    value={settings.aboutHeading || ''}
                    onChange={(e) => setSettings({ ...settings, aboutHeading: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                    placeholder="Mendefinisikan Ulang Pengalaman Radio Siar di Era Digital"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Paragraf Pengantar Visi
                </label>
                <textarea
                  rows={2}
                  value={settings.aboutParagraph1 || ''}
                  onChange={(e) => setSettings({ ...settings, aboutParagraph1: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                  placeholder="Tuliskan narasi awal kelahiran Ruang Siar..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Paragraf Konsep &amp; Penghormatan Hak Cipta
                </label>
                <textarea
                  rows={2}
                  value={settings.aboutParagraph2 || ''}
                  onChange={(e) => setSettings({ ...settings, aboutParagraph2: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                  placeholder="Tuliskan penjelasan mengenai pemutar resmi YouTube..."
                />
              </div>

              {/* 3 Core Principles Editor */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">
                  3 Pilar Prinsip Platform (Kotak Kartu)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[0, 1, 2].map((idx) => {
                    const defaultTitles = ['Narasi Bermakna', '100% Pemutar Resmi', 'Hormati Hak Cipta'];
                    const defaultDescs = [
                      'Penyiar memandu pendengar dengan kabar terkini, obrolan hangat, dan konteks cerita.',
                      'Tidak ada pengunduhan file. Semua lagu disajikan via pemutar sematan resmi YouTube.',
                      'Setiap kali pemutar diputar, metrik tontonan dan royalti langsung tercatat resmi bagi musisi.',
                    ];
                    const curPrinciples = settings.aboutPrinciples || [
                      { title: defaultTitles[0], desc: defaultDescs[0] },
                      { title: defaultTitles[1], desc: defaultDescs[1] },
                      { title: defaultTitles[2], desc: defaultDescs[2] },
                    ];
                    const item = curPrinciples[idx] || { title: defaultTitles[idx], desc: defaultDescs[idx] };

                    return (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <span className="text-[10px] text-amber-400 font-bold uppercase">Pilar {idx + 1}</span>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const updated = [...curPrinciples];
                            updated[idx] = { ...item, title: e.target.value };
                            setSettings({ ...settings, aboutPrinciples: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white font-bold focus:border-amber-500 focus:outline-none"
                          placeholder="Judul Pilar"
                        />
                        <textarea
                          rows={3}
                          value={item.desc}
                          onChange={(e) => {
                            const updated = [...curPrinciples];
                            updated[idx] = { ...item, desc: e.target.value };
                            setSettings({ ...settings, aboutPrinciples: updated });
                          }}
                          className="w-full px-2.5 py-1.5 text-[11px] rounded-lg bg-slate-900 border border-slate-800 text-slate-300 resize-none focus:border-amber-500 focus:outline-none leading-relaxed"
                          placeholder="Deskripsi Pilar"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Steps (Bagaimana Ruang Siar Bekerja) Editor */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">
                    Bagian &quot;Bagaimana Ruang Siar Bekerja?&quot;
                  </label>
                  <input
                    type="text"
                    value={settings.aboutStepsHeading || ''}
                    onChange={(e) => setSettings({ ...settings, aboutStepsHeading: e.target.value })}
                    className="px-3 py-1 text-xs rounded-lg bg-slate-950 border border-slate-800 text-white w-full sm:w-64 focus:border-amber-500 focus:outline-none"
                    placeholder="Bagaimana Ruang Siar Bekerja?"
                  />
                </div>

                <div className="space-y-2">
                  {[0, 1, 2].map((sidx) => {
                    const defaultStepTitles = ['1. Kurasi Playlist', '2. Input Melalui CMS', '3. Tampilan Audio-Visual Mewah'];
                    const defaultStepDescs = [
                      'Broadcaster atau kurator menyiapkan playlist lagu tematik di YouTube yang cocok dengan tema siaran.',
                      'Melalui portal admin Ruang Siar, pengelola cukup memasukkan tautan playlist YouTube, judul siaran, serta catatan penyiaran.',
                      'Website otomatis mengekstrak identifier pemutar, menampilkan pemutar 16:9 responsif berkelas kepada pendengar.',
                    ];
                    const curSteps = settings.aboutSteps || [
                      { title: defaultStepTitles[0], desc: defaultStepDescs[0] },
                      { title: defaultStepTitles[1], desc: defaultStepDescs[1] },
                      { title: defaultStepTitles[2], desc: defaultStepDescs[2] },
                    ];
                    const stepItem = curSteps[sidx] || { title: defaultStepTitles[sidx], desc: defaultStepDescs[sidx] };

                    return (
                      <div key={sidx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                        <div>
                          <input
                            type="text"
                            value={stepItem.title}
                            onChange={(e) => {
                              const updated = [...curSteps];
                              updated[sidx] = { ...stepItem, title: e.target.value };
                              setSettings({ ...settings, aboutSteps: updated });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-amber-400 font-bold focus:border-amber-500 focus:outline-none"
                            placeholder="Langkah"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            value={stepItem.desc}
                            onChange={(e) => {
                              const updated = [...curSteps];
                              updated[sidx] = { ...stepItem, desc: e.target.value };
                              setSettings({ ...settings, aboutSteps: updated });
                            }}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-300 focus:border-amber-500 focus:outline-none"
                            placeholder="Penjelasan langkah"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Heading */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Teks Ajakan Bawah (Call-to-Action)
                </label>
                <input
                  type="text"
                  value={settings.aboutCtaHeading || ''}
                  onChange={(e) => setSettings({ ...settings, aboutCtaHeading: e.target.value })}
                  className="w-full px-4 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-amber-500 focus:outline-none"
                  placeholder="Siap mendengarkan program siaran hari ini?"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Konten Beranda & Sorotan */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-6">
            <div className="border-b border-slate-800/80 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>6. Konten Beranda (Halaman Utama)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pengaturan teks statistik pendengar, lagu kurasi, dan narasi konsep penyiaran di halaman depan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Angka Statistik &quot;Pendengar Aktif&quot;
                </label>
                <input
                  type="text"
                  value={settings.statsListeners || ''}
                  onChange={(e) => setSettings({ ...settings, statsListeners: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="10K+"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Angka Statistik &quot;Lagu Dikurasi&quot;
                </label>
                <input
                  type="text"
                  value={settings.statsCuratedSongs || ''}
                  onChange={(e) => setSettings({ ...settings, statsCuratedSongs: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="500+"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Judul Sorotan Konsep Beranda
                </label>
                <input
                  type="text"
                  value={settings.conceptHeading || ''}
                  onChange={(e) => setSettings({ ...settings, conceptHeading: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="Harmonisasi Narasi Suara & Playlist YouTube Resmi"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Paragraf Sorotan Konsep Beranda
                </label>
                <textarea
                  rows={2}
                  value={settings.conceptDescription || ''}
                  onChange={(e) => setSettings({ ...settings, conceptDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none resize-none leading-relaxed"
                  placeholder="Penjelasan pengalaman siar berbeda..."
                />
              </div>
            </div>
          </div>

          {/* Section 7: Kelola Susunan Dewan Redaksi */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>7. Susunan Dewan Redaksi (/redaksi)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kelola struktur organisasi, nama pemimpin redaksi, reporter lapangan, dan kru siaran.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const current = settings.redaksiMembers || [];
                  setSettings({
                    ...settings,
                    redaksiMembers: [
                      ...current,
                      { role: 'Jabatan / Peran', name: 'Nama Anggota', bio: 'Keterangan tugas' },
                    ],
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Anggota Redaksi
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Judul Halaman Redaksi
                </label>
                <input
                  type="text"
                  value={settings.redaksiTitle || ''}
                  onChange={(e) => setSettings({ ...settings, redaksiTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="Susunan Redaksi Ruang Siar"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Deskripsi / Maklumat Redaksi
                </label>
                <input
                  type="text"
                  value={settings.redaksiDescription || ''}
                  onChange={(e) => setSettings({ ...settings, redaksiDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="Ruang Siar dikelola secara profesional..."
                />
              </div>
            </div>

            {/* List Anggota Redaksi */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-semibold text-slate-300">
                Daftar Susunan Tim &amp; Kru
              </label>

              {(settings.redaksiMembers || []).map((member, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] text-slate-500 font-medium mb-1">
                      Jabatan / Peran Redaksi
                    </label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => {
                        const updated = [...(settings.redaksiMembers || [])];
                        updated[idx] = { ...updated[idx], role: e.target.value };
                        setSettings({ ...settings, redaksiMembers: updated });
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-amber-400 font-bold focus:border-amber-500 focus:outline-none"
                      placeholder="e.g. Pemimpin Redaksi"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-[10px] text-slate-500 font-medium mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => {
                        const updated = [...(settings.redaksiMembers || [])];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        setSettings({ ...settings, redaksiMembers: updated });
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-white font-semibold focus:border-amber-500 focus:outline-none"
                      placeholder="e.g. Sigit / Alvin"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] text-slate-500 font-medium mb-1">
                      Keterangan / Bio Singkat
                    </label>
                    <input
                      type="text"
                      value={member.bio || ''}
                      onChange={(e) => {
                        const updated = [...(settings.redaksiMembers || [])];
                        updated[idx] = { ...updated[idx], bio: e.target.value };
                        setSettings({ ...settings, redaksiMembers: updated });
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-800 text-slate-400 focus:border-amber-500 focus:outline-none"
                      placeholder="e.g. Traffic crew & kurator"
                    />
                  </div>

                  <div className="sm:col-span-1 flex sm:justify-end pt-2 sm:pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (settings.redaksiMembers || []).filter((_, i) => i !== idx);
                        setSettings({ ...settings, redaksiMembers: updated });
                      }}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Hapus Anggota"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {(!settings.redaksiMembers || settings.redaksiMembers.length === 0) && (
                <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
                  Belum ada susunan redaksi khusus. Klik tombol &quot;+ Tambah Anggota Redaksi&quot; di atas untuk menambahkan.
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all duration-200 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Simpan Semua Pengaturan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
