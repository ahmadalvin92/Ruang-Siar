import React from 'react';
import { getBroadcasts } from '@/lib/data/store';
import AdminHeader from '@/components/admin/AdminHeader';
import BroadcastTableClient from '@/components/admin/BroadcastTableClient';

export const revalidate = 0;

export default async function AdminBroadcastsPage() {
  const broadcasts = await getBroadcasts();

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="Manajemen Episode Siaran"
        subtitle="Kelola dan terbitkan siaran audio-visual Ruang Siar bertenaga YouTube"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
        <BroadcastTableClient initialBroadcasts={broadcasts} />
      </div>
    </div>
  );
}
