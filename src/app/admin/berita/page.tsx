import React from 'react';
import { getNewsList } from '@/lib/data/store';
import AdminHeader from '@/components/admin/AdminHeader';
import NewsTableClient from '@/components/admin/NewsTableClient';

export const revalidate = 0;

export default async function AdminNewsPage() {
  const newsList = await getNewsList();

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="Manajemen Warta & Redaksi"
        subtitle="Tulis, perbarui, dan publikasikan artikel berita seputar ekosistem penyiaran"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
        <NewsTableClient initialNews={newsList} />
      </div>
    </div>
  );
}
