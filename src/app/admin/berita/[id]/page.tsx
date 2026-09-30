import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNewsById } from '@/lib/data/store';
import AdminHeader from '@/components/admin/AdminHeader';
import NewsForm from '@/components/admin/NewsForm';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 0;

interface EditNewsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditNewsPage({ params }: EditNewsPageProps) {
  const { id } = await params;
  const news = await getNewsById(id);

  if (!news) {
    notFound();
  }

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title={`Edit Berita: ${news.title}`}
        subtitle="Perbarui naskah warta, rubrik, atau status publikasi"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-6">
        <Link
          href="/admin/berita"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Berita</span>
        </Link>

        <NewsForm initialData={news} isEdit={true} />
      </div>
    </div>
  );
}
