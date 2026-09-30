import React from 'react';
import { News } from '@/types';
import NewsCard from './NewsCard';

interface NewsGridProps {
  newsList: News[];
  emptyMessage?: string;
}

export default function NewsGrid({
  newsList,
  emptyMessage = 'Belum ada berita yang diterbitkan saat ini.',
}: NewsGridProps) {
  if (newsList.length === 0) {
    return (
      <div className="w-full py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 p-8">
        <p className="text-slate-400 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {newsList.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </div>
  );
}
