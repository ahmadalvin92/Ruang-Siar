import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FileCheck, ArrowLeft, Shield, AlertTriangle, Copyright } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan',
  description: 'Syarat dan Ketentuan penggunaan portal media & radio siar kontemporer Ruang Siar (ruangsiar.id).',
};

export default function SyaratKetentuanPage() {
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
          <FileCheck className="w-3.5 h-3.5" />
          <span>Ketentuan Penggunaan Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Syarat &amp; Ketentuan Layanan (Terms of Service)
        </h1>
        <p className="text-sm text-slate-400">
          Terakhir diperbarui: 10 Oktober 2026 • Mengatur hak dan kewajiban pengguna di ruangsiar.id
        </p>
      </div>

      {/* Body Content */}
      <div className="space-y-8 text-sm leading-relaxed text-slate-300">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            1. Penerimaan Ketentuan
          </h2>
          <p>
            Dengan mengakses dan menggunakan portal <strong>Ruang Siar</strong> (<code className="text-amber-400">https://ruangsiar.id</code>), Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat &amp; Ketentuan ini. Jika Anda tidak menyetujui salah satu bagian dari ketentuan ini, Anda dipersilakan untuk tidak melanjutkan penggunaan situs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Copyright className="w-4 h-4 text-amber-400" />
            2. Hak Kekayaan Intelektual &amp; Kebijakan Hak Cipta
          </h2>
          <p>
            Ruang Siar menjunjung tinggi etika penyiaran dan kepatuhan hak cipta:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li>
              <strong>Konten Redaksi:</strong> Seluruh naskah siaran, artikel warta, logo, dan tata letak grafis adalah hak milik intelektual Ruang Siar dan dilindungi oleh Undang-Undang Hak Cipta Republik Indonesia.
            </li>
            <li>
              <strong>Katalog Musik &amp; Pemutar Resmi:</strong> Musik dan video yang ditampilkan berasal dari pemutar sematan resmi YouTube. Seluruh hak cipta lagu, royalti tayangan, dan monetisasi tetap menjadi hak penuh dari artis, pencipta lagu, serta label rekaman pemilik saluran YouTube resmi terkait.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            3. Batasan Tanggung Jawab
          </h2>
          <p>
            Ruang Siar berupaya menyajikan kurasi siaran dan informasi warta secara akurat dan objektif. Namun, materi disediakan &quot;sebagaimana adanya&quot; tanpa jaminan mutlak atas ketiadaan gangguan teknis server pihak ketiga atau perubahan ketersediaan video dari penyedia platform eksternal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Perubahan Ketentuan</h2>
          <p>
            Pengelola Ruang Siar berhak untuk memperbarui atau memodifikasi Syarat &amp; Ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya. Penggunaan berkelanjutan atas situs ini setelah perubahan dipublikasikan dianggap sebagai persetujuan Anda terhadap ketentuan yang diperbarui.
          </p>
        </section>
      </div>
    </div>
  );
}
