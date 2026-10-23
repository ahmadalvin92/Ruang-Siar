'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnalyticsSummary } from '@/lib/analytics';
import {
  Users,
  Activity,
  Eye,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  Flame,
  Globe2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface AnalyticsWidgetProps {
  initialData?: AnalyticsSummary;
}

export default function AnalyticsDashboardWidget({ initialData }: AnalyticsWidgetProps) {
  const [data, setData] = useState<AnalyticsSummary | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchStats = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const res = await fetch('/api/analytics/stats', { cache: 'no-store' });
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        const now = new Date();
        setLastUpdated(
          now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        );
      }
    } catch (err) {
      console.error('Failed to fetch analytics stats:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh every 30 seconds for live visitor counts
    const interval = setInterval(() => fetchStats(), 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = data || {
    activeUsersOnline: 1,
    todayPageviews: 0,
    totalPageviews: 0,
    todayUniqueVisitors: 0,
    totalUniqueVisitors: 0,
    history7Days: [],
    topPages: [],
  };

  // Find max views for 7-day relative bar height
  const max7DayViews = Math.max(1, ...stats.history7Days.map((d) => d.views));

  return (
    <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                Statistik & Pengunjung Ruang Siar
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Tracker
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pantau siapa yang sedang mendengarkan siaran dan membaca warta secara realtime
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {lastUpdated && (
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
              Update: {lastUpdated}
            </span>
          )}
          <button
            type="button"
            onClick={() => fetchStats(true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
            title="Segarkan data statistik"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
            <span>Segarkan</span>
          </button>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pengunjung Sedang Online (Realtime) */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Sedang Online
            </span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {stats.activeUsersOnline}
            <span className="text-xs font-normal text-emerald-300/80 ml-1.5">orang</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Aktif dalam 5 menit terakhir
          </p>
        </div>

        {/* Card 2: Kunjungan Hari Ini */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">
              Kunjungan Hari Ini
            </span>
            <Eye className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {stats.todayPageviews.toLocaleString('id-ID')}
            <span className="text-xs font-normal text-slate-400 ml-1.5">views</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            <span className="text-amber-400 font-bold">{stats.todayUniqueVisitors}</span> pengunjung unik hari ini
          </p>
        </div>

        {/* Card 3: Total Kunjungan Kumulatif */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">
              Total Seluruh Kunjungan
            </span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            {stats.totalPageviews.toLocaleString('id-ID')}
            <span className="text-xs font-normal text-slate-400 ml-1.5">total views</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            <span className="text-sky-400 font-bold">{stats.totalUniqueVisitors}</span> total pengunjung unik
          </p>
        </div>

        {/* Card 4: Status Google Analytics 4 */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">
              Google Analytics (GA4)
            </span>
            <Globe2 className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Siap Terhubung
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Atur ID GA4 di menu Pengaturan
            </p>
          </div>
          <Link
            href="/admin/pengaturan#google-analytics"
            className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1 mt-2 transition-colors"
          >
            <span>Kelola GA4</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 2 Columns: 7-Day Trend Chart & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        {/* Left Column: 7 Days Trend */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Tren Kunjungan 7 Hari Terakhir
            </span>
            <span className="text-[11px] text-slate-400">
              Tinggi batang = perbandingan jumlah views
            </span>
          </div>

          <div className="pt-4 pb-2">
            <div className="grid grid-cols-7 gap-2 items-end h-32">
              {stats.history7Days.map((item, idx) => {
                const heightPercent =
                  max7DayViews > 0 ? Math.max(12, Math.round((item.views / max7DayViews) * 100)) : 12;
                const isToday = idx === stats.history7Days.length - 1;

                return (
                  <div key={item.date} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.views}
                    </span>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 group-hover:brightness-125 ${
                        isToday
                          ? 'bg-gradient-to-t from-amber-600 to-amber-400 shadow-lg shadow-amber-500/20'
                          : 'bg-gradient-to-t from-slate-800 to-slate-700'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                      title={`${item.label}: ${item.views} views, ${item.visitors} pengunjung`}
                    />
                    <span
                      className={`text-[10px] font-mono tracking-tight truncate max-w-full ${
                        isToday ? 'text-amber-400 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {item.label.split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Top Pages */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Konten Terpopuler
            </span>
            <span className="text-[10px] text-slate-400">Berdasarkan total view</span>
          </div>

          <div className="space-y-2">
            {stats.topPages.length > 0 ? (
              stats.topPages.map((page, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 hover:border-slate-700 text-xs transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[10px] bg-slate-800 text-amber-400 shrink-0">
                      {idx + 1}
                    </span>
                    <a
                      href={page.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-slate-200 hover:text-amber-400 font-medium"
                      title={page.title || page.path}
                    >
                      {page.title || page.path}
                    </a>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-amber-400 shrink-0">
                    {page.views} <span className="text-[9px] font-normal text-slate-500">views</span>
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic py-6 text-center">
                Merekam kunjungan pertama... Kunjungi halaman website untuk melihat data.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
