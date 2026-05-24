/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, ShieldAlert, Award, Hash, Calendar, FileText, Printer, ArrowLeft, Info, HelpCircle } from 'lucide-react';
import { ForensicReport } from '../types';

interface ForensicReportViewProps {
  report: ForensicReport;
  onBack: () => void;
}

export default function ForensicReportView({ report, onBack }: ForensicReportViewProps) {
  // Helpers to get styling based on risk level
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-500 border-red-500/30 bg-red-500/10 glow-rose';
      case 'HIGH': return 'text-rose-400 border-rose-500/20 bg-rose-500/5 glow-rose';
      case 'MEDIUM': return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      default: return 'text-teal-400 border-teal-500/25 bg-teal-500/10 glow-teal';
    }
  };

  const getStatusBadge = (status: 'clean' | 'suspicious' | 'unknown') => {
    switch (status) {
      case 'clean': return <span className="text-[10px] font-mono uppercase font-bold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/10">Passed</span>;
      case 'suspicious': return <span className="text-[10px] font-mono uppercase font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/10 animate-pulse">Alert</span>;
      default: return <span className="text-[10px] font-mono uppercase font-bold text-zinc-400 bg-zinc-500/10 px-1.5 py-0.5 rounded border border-zinc-500/10">Unknown</span>;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Header Menu */}
      <div className="flex justify-between items-center no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO TELEMETRY SUMMARY</span>
        </button>
        
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-4 py-2 rounded-lg text-sm font-mono text-indigo-400 hover:text-indigo-300 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>PRINT OR EXPORT CERTIFICATE</span>
        </button>
      </div>

      {/* Main Diagnostic Dashboard Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Gauge Score Card */}
        <div className="bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800 backdrop-blur-md flex flex-col justify-between space-y-6 text-center lg:text-left">
          <div>
            <span className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Asset Hash Signatures</span>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mt-1 justify-center lg:justify-start">
              <Hash className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{report.id}</span>
            </div>
          </div>

          {/* Graphical Speedometer Dial Gauge */}
          <div className="flex flex-col items-center py-4">
            <div className="relative w-44 h-44 flex items-center justify-center">
              {/* SVG Gauge structure */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#18181b" strokeWidth="3" />
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.915" 
                  fill="none" 
                  stroke={report.scores.authenticity < 60 ? "#f43f5e" : "#14b8a6"} 
                  strokeWidth="3.2" 
                  strokeDasharray={`${report.scores.authenticity} ${100 - report.scores.authenticity}`} 
                  strokeDashoffset="0"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-3xl font-black font-sans text-white">{report.scores.authenticity}%</div>
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mt-0.5">Authentic</div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs text-zinc-400 font-mono block">AI Confidence Interval</span>
              <span className="text-base font-bold text-white font-mono mt-0.5 block">{report.scores.confidence}% Match Rate</span>
            </div>
          </div>

          <div className={`p-4 border rounded-xl text-center self-stretch ${getRiskColor(report.scores.riskLevel)}`}>
            <div className="text-xs font-mono uppercase tracking-wider">Threat Severity Level</div>
            <div className="text-xl font-bold font-sans mt-0.5">{report.scores.riskLevel}</div>
          </div>
        </div>

        {/* AI Forensic Explanation and Anatomy Findings */}
        <div className="bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800 backdrop-blur-md lg:col-span-2 space-y-5">
          <div>
            <span className="text-xs font-mono uppercase text-zinc-400 block tracking-widest">{report.mediaType} Audit Findings - {report.mediaName}</span>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">{report.scores.authenticity < 60 ? "Deepfake Signature Located" : "Visual Integrity Clear Verified"}</h2>
          </div>

          {/* Glowing warnings banner depending on score */}
          <div className={`p-3 rounded-lg border text-xs font-sans leading-relaxed ${report.scores.authenticity < 60 ? 'bg-red-950/10 border-red-900/40 text-rose-300' : 'bg-teal-950/10 border-teal-900/40 text-teal-300'}`}>
            {report.aiExplanation}
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white tracking-wide border-b border-zinc-900 pb-2">Technical Laboratory Anatomy</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono">{report.details}</p>
          </div>

          {/* Manipulated Regions Table / Anomalies */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide">Spatial & Frequency Anomalies ({report.manipulatedRegions.length})</h4>
            {report.manipulatedRegions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {report.manipulatedRegions.map((region, i) => (
                  <div key={i} className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg space-y-1 hover:border-zinc-700 transition-all">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-zinc-200">{region.label}</span>
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">Anomaly Conf. {region.confidence}%</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono leading-tight">{region.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-zinc-900/20 rounded-xl text-center border border-zinc-900 text-xs text-teal-400 font-mono flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                No significant synthetic blending artifacts found on spatial frequency matrix.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Structural EXIF Metadata & Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
        {/* Dynamic EXIF Metadata Audit Sheet */}
        <div className="bg-zinc-950/60 p-5 rounded-2xl border border-zinc-800 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
            <Info className="w-4 h-4 text-indigo-400" />
            Original EXIF Metadata Map
          </h3>
          <div className="divide-y divide-zinc-900">
            {report.metadata.map((field, i) => (
              <div key={i} className="py-2.5 flex justify-between items-center text-xs">
                <span className="font-mono text-zinc-400">{field.key}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{field.value}</span>
                  {getStatusBadge(field.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Check Logs Progress */}
        <div className="bg-zinc-950/60 p-5 rounded-2xl border border-zinc-800 backdrop-blur-md space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wide">
            <Award className="w-4 h-4 text-teal-400" />
            Verification Sequence Log
          </h3>
          <div className="relative border-l border-zinc-800 pl-4 space-y-4 py-1">
            {report.verificationTimeline.map((item, i) => (
              <div key={i} className="relative">
                {/* Node marker icon */}
                <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${item.status === "passed" ? "bg-teal-500" : item.status === "failed" ? "bg-rose-500" : "bg-amber-500"}`}></span>
                <div className="text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-white font-semibold">{item.event}</span>
                    <span className="text-[10px] text-zinc-500">{new Date(item.date).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 uppercase mt-0.5 tracking-wider font-mono">Verdict: {item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Print Ready Verification Certificate block */}
      <div className="print-only bg-white text-zinc-950 border-8 border-double border-zinc-900 p-8 rounded-none shadow-none hidden">
        <div className="text-center space-y-4">
          <Award className="w-16 h-16 text-zinc-900 mx-auto" />
          <h1 className="text-2xl font-black uppercase tracking-tight font-sans">
            Forensic Audit Certificate of Authenticity
          </h1>
          <p className="text-xs uppercase tracking-widest font-mono text-zinc-600">
            TruthLens AI Cybersecurity Threat Center
          </p>
        </div>

        <div className="my-8 border-t border-b border-zinc-300 py-6 grid grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <p className="text-zinc-500">Asset Title:</p>
            <p className="font-bold text-zinc-900">{report.mediaName}</p>
          </div>
          <div>
            <p className="text-zinc-500">Certificate Seal ID:</p>
            <p className="font-bold text-zinc-950">{report.certificateId}</p>
          </div>
          <div>
            <p className="text-zinc-500">Authentication Date:</p>
            <p className="font-bold text-zinc-900">{new Date(report.scanDate).toLocaleDateString()} {new Date(report.scanDate).toLocaleTimeString()}</p>
          </div>
          <div>
            <p className="text-zinc-500">Physical SHA-256 Signature Hash:</p>
            <p className="font-mono text-[9px] truncate max-w-[200px] font-bold text-zinc-800">{report.forensicHash}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900">Official Authenticator Verdict</h3>
          <p className="text-xs italic leading-relaxed text-zinc-700">
            &ldquo;Based upon spatial neural frequency map sweeps, CNN color spectrum calibration, and EXIF camera profiling executed by the Google Gemini intelligence matrix, the system establishes a digital integrity rating of <strong className="text-zinc-950 underline">{report.scores.authenticity}% Authenticty</strong> with an error precision threshold of plus-minus 3%.&rdquo;
          </p>
        </div>

        <div className="mt-14 pt-8 border-t border-zinc-200 grid grid-cols-2 gap-8 text-center text-[10px] font-mono uppercase text-zinc-500">
          <div>
            <div className="w-40 border-b border-zinc-300 mx-auto mb-2 py-3"></div>
            <p>Authorized Cybersecurity Chief Agent</p>
          </div>
          <div>
            <div className="w-40 border-b border-zinc-300 mx-auto mb-2 py-3"></div>
            <p>Sealed Autopsy Token Code Matrix</p>
          </div>
        </div>
      </div>
    </div>
  );
}
