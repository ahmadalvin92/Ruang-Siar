import React from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import BroadcastForm from '@/components/admin/BroadcastForm';
import { ArrowLeft } from 'lucide-react';

export default function NewBroadcastPage() {
  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="Tambah Siaran Baru"
        subtitle="Buat MP4 siaran di YouTube terlebih dahulu, lalu masukkan URL playlist resminya"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
        <Link
          href="/admin/siaran"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Siaran</span>
        </Link>

        <BroadcastForm isEdit={false} />
      </div>
    </div>
  );
}
