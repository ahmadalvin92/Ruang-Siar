import React from 'react';
import { Broadcast } from '@/types';
import BroadcastCard from './BroadcastCard';

interface BroadcastGridProps {
  broadcasts: Broadcast[];
  emptyMessage?: string;
}

export default function BroadcastGrid({
  broadcasts,
  emptyMessage = 'Belum ada siaran yang tersedia saat ini.',
}: BroadcastGridProps) {
  if (broadcasts.length === 0) {
    return (
      <div className="w-full py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8">
        <p className="text-slate-400 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {broadcasts.map((broadcast) => (
        <BroadcastCard key={broadcast.id} broadcast={broadcast} />
      ))}
    </div>
  );
}
