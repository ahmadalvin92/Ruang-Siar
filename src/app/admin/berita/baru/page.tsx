import React from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import NewsForm from '@/components/admin/NewsForm';
import { ArrowLeft } from 'lucide-react';

export default function NewNewsPage() {
  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="Tulis Berita / Warta Baru"
        subtitle="Buat artikel baru untuk rubrik kabar musik, media, budaya, atau teknologi"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
        <Link
          href="/admin/berita"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Berita</span>
        </Link>

        <NewsForm isEdit={false} />
      </div>
    </div>
  );
}
