/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Eye, ShieldAlert, BadgeInfo, CheckCircle, BarChart3, Activity, HeartHandshake } from 'lucide-react';
import { DashboardStats } from '../types';

interface DashboardStatsOverviewProps {
  stats: DashboardStats | null;
  onNavigateToTab: (tab: string) => void;
}

export default function DashboardStatsOverview({ stats, onNavigateToTab }: DashboardStatsOverviewProps) {
  if (!stats) {
    return (
      <div className="flex justify-center items-center py-12">
        <span className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin"></span>
      </div>
    );
  }

  // Pre-calculate heights for dynamic SVG line chart
  const scansHistory = stats.activityTimeline || [];
  const maxScansValue = Math.max(...scansHistory.map(h => h.scans), 8);
  const chartHeight = 140;
  const chartWidth = 500;
  
  // Custom SVG points compiler
  const linePoints = scansHistory.map((pt, index) => {
    const x = (index / (scansHistory.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - ((pt.scans / maxScansValue) * (chartHeight - 40) + 20);
    return { x, y, raw: pt };
  });

  const manipulatedPoints = scansHistory.map((pt, index) => {
    const x = (index / (scansHistory.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - ((pt.manipulated / maxScansValue) * (chartHeight - 40) + 20);
    return { x, y, raw: pt };
  });

  const linePath = linePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const manipulatedPath = manipulatedPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // SVG Area Paths for nice gradients
  const areaPath = linePoints.length > 0 
    ? `${linePath} L ${linePoints[linePoints.length - 1].x} ${chartHeight - 5} L ${linePoints[0].x} ${chartHeight - 5} Z` 
    : '';

  const manipulatedAreaPath = manipulatedPoints.length > 0
    ? `${manipulatedPath} L ${manipulatedPoints[manipulatedPoints.length - 1].x} ${chartHeight - 5} L ${manipulatedPoints[0].x} ${chartHeight - 5} Z`
    : '';

  return (
    <div className="space-y-6">
      {/* Dynamic Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-950/40 p-5 rounded-xl border border-zinc-800 backdrop-blur-sm self-stretch hover:border-zinc-700 transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 [clip-path:circle(40%_at_100%_0%)] pointer-events-none"></div>
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono uppercase text-zinc-400">Total Scans Audited</span>
              <span className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/10">
                <Eye className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-bold text-white tracking-tight font-sans">
              {stats.totalScans}
            </div>
          </div>
          <p className="text-[10px] font-mono text-zinc-500 mt-2 uppercase">
            Active threat sensors connected
          </p>
        </div>

        <div className="bg-zinc-950/40 p-5 rounded-xl border border-zinc-800 backdrop-blur-sm self-stretch hover:border-zinc-700 transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 [clip-path:circle(40%_at_100%_0%)] pointer-events-none"></div>
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono uppercase text-zinc-400">Manipulations Detected</span>
              <span className="p-1.5 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/10">
                <ShieldAlert className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-bold text-rose-400 tracking-tight font-sans">
              {stats.fakeMediaDetected}
            </div>
          </div>
          <p className="text-[10px] font-mono text-rose-400/70 mt-2 uppercase">
            {Math.round((stats.fakeMediaDetected / stats.totalScans) * 100 || 32)}% Detection ratio block
          </p>
        </div>

        <div className="bg-zinc-950/40 p-5 rounded-xl border border-zinc-800 backdrop-blur-sm self-stretch hover:border-zinc-700 transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 [clip-path:circle(40%_at_100%_0%)] pointer-events-none"></div>
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono uppercase text-zinc-400">Average AI Accuracy</span>
              <span className="p-1.5 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/10">
                <CheckCircle className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-bold text-teal-400 tracking-tight font-sans">
              {stats.averageAccuracy}%
            </div>
          </div>
          <p className="text-[10px] font-mono text-zinc-500 mt-2 uppercase">
            Confidence interval thresholds
          </p>
        </div>

        <div className="bg-zinc-950/40 p-5 rounded-xl border border-zinc-800 backdrop-blur-sm self-stretch hover:border-zinc-700 transition-all flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-zinc-500/5 [clip-path:circle(40%_at_100%_0%)] pointer-events-none"></div>
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-mono uppercase text-zinc-400">Active Threat Level</span>
              <span className="p-1.5 bg-orange-500/10 text-orange-400 rounded-lg border border-orange-500/10">
                <Activity className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl font-bold text-orange-400 tracking-tight font-sans">
              ELEVATED
            </div>
          </div>
          <p className="text-[10px] font-mono text-zinc-500 mt-2 uppercase">
            Deepfake campaigns warning active
          </p>
        </div>
      </div>

      {/* Main Stats Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Graph Area */}
        <div className="bg-zinc-950/60 p-5 rounded-2xl border border-zinc-800 backdrop-blur-md lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4- h-4 text-indigo-400" />
                Forensic Sweep History
              </h3>
              <p className="text-xs text-zinc-400">Activity and deep manipulation vectors (7 days)</p>
            </div>
            <div className="flex gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-500"></span> Total Audits</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-rose-500"></span> Manipulated</span>
            </div>
          </div>

          {/* SVG Line Chart Widget */}
          <div className="w-full relative overflow-x-auto min-h-[160px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full min-w-[400px]">
              <defs>
                <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="20" y1="20" x2={chartWidth - 20} y2="20" stroke="#27272a" strokeDasharray="3 3" />
              <line x1="20" y1="60" x2={chartWidth - 20} y2="60" stroke="#27272a" strokeDasharray="3 3" />
              <line x1="20" y1="100" x2={chartWidth - 20} y2="100" stroke="#27272a" strokeDasharray="3 3" />
              <line x1="20" y1="135" x2={chartWidth - 20} y2="135" stroke="#3f3f46" />

              {/* Area fills */}
              {areaPath && <path d={areaPath} fill="url(#indigoGrad)" />}
              {manipulatedAreaPath && <path d={manipulatedAreaPath} fill="url(#roseGrad)" />}

              {/* Stroke Lines */}
              <path d={linePath} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />
              <path d={manipulatedPath} fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />

              {/* Data Points */}
              {linePoints.map((pt, i) => (
                <g key={`total-${i}`}>
                  <circle cx={pt.x} cy={pt.y} r="3.5" fill="#18181b" stroke="#06b6d4" strokeWidth="1.5" className="hover:scale-150 transition-transform cursor-pointer" />
                  <text x={pt.x} y={chartHeight - 3} textAnchor="middle" fill="#71717a" className="text-[9px] font-mono">{pt.raw.date}</text>
                </g>
              ))}

              {manipulatedPoints.map((pt, i) => (
                <circle key={`manip-${i}`} cx={pt.x} cy={pt.y} r="3" fill="#18181b" stroke="#f43f5e" strokeWidth="1.5" />
              ))}
            </svg>
          </div>
        </div>

        {/* Media Proportion Radial Ring */}
        <div className="bg-zinc-950/60 p-5 rounded-2xl border border-zinc-800 backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-400" />
            Media Attack Vectors
          </h3>
          <p className="text-xs text-zinc-400">Scanned content category proportion</p>

          <div className="flex flex-col items-center justify-center pt-2">
            {/* Custom SVG Ring Representation */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#18181b" strokeWidth="3" />
                {/* Image Count Stroke (45%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#06b6d4" strokeWidth="3.2" strokeDasharray="45 55" strokeDashoffset="0" />
                {/* Video Count Stroke (35%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f43f5e" strokeWidth="3.2" strokeDasharray="35 65" strokeDashoffset="-45" />
                {/* Audio Count Stroke (20%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#14b8a6" strokeWidth="3.2" strokeDasharray="20 80" strokeDashoffset="-80" />
              </svg>
              <div className="absolute text-center">
                <div className="text-xs font-mono uppercase tracking-widest text-zinc-400">Total</div>
                <div className="text-xl font-bold font-sans text-white">{stats.totalScans}</div>
              </div>
            </div>

            {/* Legends */}
            <div className="grid grid-cols-3 gap-2 w-full text-center mt-5 text-[11px] font-mono">
              <div className="p-1 px-2 rounded bg-zinc-900 border border-zinc-800">
                <div className="text-indigo-400 font-bold">45%</div>
                <div className="text-[9px] text-zinc-500 uppercase">Images</div>
              </div>
              <div className="p-1 px-2 rounded bg-zinc-900 border border-zinc-800">
                <div className="text-rose-400 font-bold">35%</div>
                <div className="text-[9px] text-zinc-500 uppercase">Videos</div>
              </div>
              <div className="p-1 px-2 rounded bg-zinc-900 border border-zinc-800">
                <div className="text-teal-400 font-bold">20%</div>
                <div className="text-[9px] text-zinc-500 uppercase">Audio</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Misinformation Tips / Educational Banner */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/25 to-zinc-950/40 border border-indigo-900/40 p-5 rounded-2xl flex flex-col md:flex-row gap-5 items-center justify-between shadow-lg">
        <div className="flex gap-4 items-start text-center md:text-left">
          <span className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 hidden md:block">
            <HeartHandshake className="w-6 h-6 animate-pulse" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Need Deepfake Protection Coaching?</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Generative AI campaigns use advanced facial wrapping and high-speed vocal wave cloners to trick security personnel. Integrate our cyber security chatbot advisor for safety, watermarking, and prevention training.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigateToTab('assistant')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs uppercase rounded-lg border border-indigo-400/25 transition-all w-full md:w-auto tracking-wide cursor-pointer"
        >
          Consult Assistant
        </button>
      </div>
    </div>
  );
}
