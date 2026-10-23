import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, Eye, Cookie, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description: 'Kebijakan Privasi resmi portal media dan radio siar kontemporer Ruang Siar (ruangsiar.id).',
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4 mb-10 pb-8 border-b border-slate-800/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Kepatuhan Hukum & Privasi Pengguna</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Kebijakan Privasi (Privacy Policy)
        </h1>
        <p className="text-sm text-slate-400">
          Terakhir diperbarui: 10 Oktober 2026 • Berlaku efektif untuk seluruh pengunjung situs ruangsiar.id
        </p>
      </div>

      {/* Body Content */}
      <div className="space-y-8 text-sm leading-relaxed text-slate-300">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            1. Pendahuluan
          </h2>
          <p>
            Selamat datang di <strong>Ruang Siar</strong> (dapat diakses melalui <code className="text-amber-400">https://ruangsiar.id</code>). Kami sangat menghargai privasi Anda dan berkomitmen untuk melindungi informasi pribadi pengunjung. Kebijakan Privasi ini menjelaskan jenis data yang kami kumpulkan, bagaimana data tersebut digunakan, dan langkah-langkah yang kami ambil untuk menjaga keamanannya.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            2. Informasi yang Kami Kumpulkan
          </h2>
          <p>
            Saat Anda mengunjungi Ruang Siar, kami dapat mengumpulkan informasi non-pribadi seperti alamat Protokol Internet (IP), jenis peramban (browser), penyedia layanan internet (ISP), tanggal dan waktu akses, serta halaman rujukan untuk keperluan analisis lalu lintas dan peningkatan kualitas layanan penyiaran.
          </p>
        </section>

        <section className="space-y-3 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
          <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2">
            <Cookie className="w-4 h-4 text-amber-400" />
            3. Cookie &amp; Google AdSense (Klausul Wajib Periklanan)
          </h2>
          <p>
            Ruang Siar bekerja sama dengan vendor pihak ketiga, termasuk <strong>Google</strong>, untuk menayangkan iklan saat Anda mengunjungi situs kami:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li>
              <strong>Cookie Google AdSense:</strong> Google menggunakan cookie untuk menayangkan iklan di situs ini berdasarkan kunjungan sebelumnya oleh pengguna ke situs web ini atau situs web lainnya di internet.
            </li>
            <li>
              <strong>Cookie DART:</strong> Penggunaan cookie iklan oleh Google memungkinkan Google dan mitranya menayangkan iklan kepada pengguna kami berdasarkan kunjungan mereka ke Ruang Siar dan/atau situs lainnya di internet.
            </li>
            <li>
              <strong>Pilihan Pengguna:</strong> Anda dapat memilih untuk menonaktifkan iklan hasil personalisasi dengan mengunjungi{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 underline hover:text-amber-300"
              >
                Setelan Iklan Google
              </a>
              {' '}atau mengakses{' '}
              <a
                href="https://www.aboutads.info"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 underline hover:text-amber-300"
              >
                aboutads.info
              </a>.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            4. Pemutar Sematan Pihak Ketiga (YouTube API)
          </h2>
          <p>
            Ruang Siar menggunakan pemutar resmi tersemat (embed) dari <strong>YouTube</strong>. Kami tidak menyimpan, mengunduh, atau mendistribusikan ulang file musik secara ilegal. Semua interaksi audio-visual tunduk pada{' '}
            <a
              href="https://www.youtube.com/t/terms"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 underline"
            >
              Persyaratan Layanan YouTube
            </a>{' '}
            dan{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 underline"
            >
              Kebijakan Privasi Google
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">5. Keamanan Data</h2>
          <p>
            Kami menerapkan standar teknis yang wajar untuk melindungi integritas dan kerahasiaan transmisi data melalui enkripsi SSL/TLS (HTTPS). Namun, perlu dipahami bahwa tidak ada metode transmisi internet yang 100% aman.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">6. Kontak Redaksi</h2>
          <p>
            Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi tim kami melalui email resmi:{' '}
            <a href="mailto:redaksi@ruangsiar.id" className="text-amber-400 font-semibold underline">
              redaksi@ruangsiar.id
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
