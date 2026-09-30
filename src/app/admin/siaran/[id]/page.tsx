import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBroadcastById } from '@/lib/data/store';
import AdminHeader from '@/components/admin/AdminHeader';
import BroadcastForm from '@/components/admin/BroadcastForm';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 0;

interface EditBroadcastPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBroadcastPage({ params }: EditBroadcastPageProps) {
  const { id } = await params;
  const broadcast = await getBroadcastById(id);

  if (!broadcast) {
    notFound();
  }

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title={`Edit Siaran: ${broadcast.title}`}
        subtitle="Perbarui metadata, playlist YouTube, atau status publikasi"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
        <Link
          href="/admin/siaran"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Siaran</span>
        </Link>

        <BroadcastForm initialData={broadcast} isEdit={true} />
      </div>
    </div>
  );
}
