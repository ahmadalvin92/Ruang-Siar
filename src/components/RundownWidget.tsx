 'use client';

import React, { useState } from 'react';
import { RundownItem } from '@/types';
import { Mic, Music, Clock, ListOrdered, ChevronDown } from 'lucide-react';

interface RundownWidgetProps {
  rundown?: RundownItem[];
  title?: string;
  className?: string;
}

export default function RundownWidget({
  rundown,
  title = 'Rundown & Susunan Putar Siaran',
  className = '',
}: RundownWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  if (!rundown || rundown.length === 0) {
    return null;
  }

  return (
    <div className={`p-5 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-xl space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              {title}
            </h3>
            <p className="text-[11px] text-slate-400">
              Urutan siaran suara penyiar dan video klip lagu dalam playlist
            </p>
          </div>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 self-start sm:self-auto border border-slate-700/60">
          {rundown.length} Bagian <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && <div className="space-y-2.5">
        {rundown.map((item, index) => {
          const isSiaran = item.type === 'siaran';
          return (
            <div
              key={index}
              className={`flex items-start sm:items-center justify-between gap-3 p-3 rounded-xl transition-all duration-200 ${
                isSiaran
                  ? 'bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20'
                  : 'bg-slate-950/50 hover:bg-slate-950 border border-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Time Badge */}
                <span className="flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-1 rounded-lg bg-slate-900 border border-slate-700/70 text-amber-400 shrink-0 shadow-inner">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {item.time}
                </span>

                {/* Type Icon */}
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isSiaran
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  }`}
                  title={isSiaran ? 'Sesi Siaran Suara' : 'Video Klip Lagu'}
                >
                  {isSiaran ? <Mic className="w-3.5 h-3.5" /> : <Music className="w-3.5 h-3.5" />}
                </div>

                {/* Title & Artist/Speaker */}
                <div className="min-w-0">
                  <div className={`text-xs font-semibold truncate ${isSiaran ? 'text-amber-200' : 'text-slate-200'}`}>
                    {item.title}
                  </div>
                  {item.artistOrSpeaker && (
                    <div className="text-[11px] text-slate-400 truncate">
                      {item.artistOrSpeaker}
                    </div>
                  )}
                </div>
              </div>

              {/* Tag Pill */}
              <div className="shrink-0 text-right">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    isSiaran
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isSiaran ? 'Siaran' : 'Lagu'}
                </span>
              </div>
            </div>
          );
        })}
      </div>}
    </div>
  );
}
