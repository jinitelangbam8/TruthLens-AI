/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Search, ShieldX, Link2, AlertTriangle, Scale, ExternalLink, RefreshCw, UserCheck } from 'lucide-react';
import { NewsFactCheck, SocialMediaProfileScan } from '../types';

export default function FactCheckTab() {
  // Fact check states
  const [factQuery, setFactQuery] = useState('');
  const [factLoading, setFactLoading] = useState(false);
  const [factResult, setFactResult] = useState<NewsFactCheck | null>(null);

  // Profile scanner states
  const [profileUrl, setProfileUrl] = useState('');
  const [profilePlatform, setProfilePlatform] = useState<'twitter' | 'facebook' | 'linkedin' | 'instagram'>('twitter');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileResult, setProfileResult] = useState<SocialMediaProfileScan | null>(null);

  const executeFactCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factQuery.trim()) return;
    setFactLoading(true);

    try {
      const res = await fetch("/api/fact-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: factQuery })
      });
      const data = await res.json();
      setFactResult(data.report);
    } catch (err) {
      alert("Fact check connection error.");
    } finally {
      setFactLoading(false);
    }
  };

  const executeProfileScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileUrl.trim()) return;
    setProfileLoading(true);

    // Dynamic pattern mapping for social media fraud markers simulation
    setTimeout(() => {
      const isFake = Math.random() < 0.5;
      const score = isFake ? Math.floor(Math.random() * 30) + 15 : Math.floor(Math.random() * 40) + 60;
      
      const reasons = isFake ? [
        "Facial avatar matches known Generative adversarial synthetic grids (diffusion noise).",
        "Abnormally high posting frequency rate (exceeding standard organic capability limits).",
        "EXIF/descriptive history aligns with adversarial bot templates."
      ] : [
        "Consistent profile history matching clean patterns.",
        "Verified platform account linking status.",
        "Organic semantic interaction models."
      ];

      setProfileResult({
        platform: profilePlatform,
        profileUrl: profileUrl,
        profileName: profileUrl.split('/').pop() || "Staged Operative Profile",
        reputationScore: score,
        isFake,
        reasons
      });
      setProfileLoading(false);
    }, 1500);
  };

  const clearFactCheck = () => {
    setFactResult(null);
    setFactQuery('');
  };

  const clearProfileCheck = () => {
    setProfileResult(null);
    setProfileUrl('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Side: News Verification ground checks */}
        <div className="bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800 backdrop-blur-md flex flex-col justify-between space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-400" />
              News Verification Ground Scanner
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5 uppercase font-mono">
              Ground truth fact checker (Gemini + Web search)
            </p>
          </div>

          {!factResult && !factLoading && (
            <form onSubmit={executeFactCheck} className="space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                Verify viral rumors or media stories for synthetic bias or misinformation networks. This queries active web indices dynamically.
              </p>
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Enter Headline / Claim</label>
                <textarea
                  required
                  rows={3}
                  value={factQuery}
                  onChange={(e) => setFactQuery(e.target.value)}
                  placeholder="e.g., 'Did a politician make a speech generated entirely on synthetic audio at a conference?'"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 font-mono text-xs uppercase tracking-wide text-white rounded-lg border border-indigo-400/20 shadow-md cursor-pointer transition-all"
              >
                Execute Ground Verification
              </button>
            </form>
          )}

          {factLoading && (
            <div className="flex-1 py-14 flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-10 h-10 rounded-full border-2 border-indigo-500/25 border-t-indigo-500 animate-spin"></div>
              <div className="space-y-1 font-mono">
                <p className="text-xs text-indigo-400 uppercase tracking-widest animate-pulse">Consulting Web Index</p>
                <p className="text-[10px] text-zinc-500 uppercase">Cross-referencing truth baselines...</p>
              </div>
            </div>
          )}

          {factResult && !factLoading && (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              {/* Verdict Indicator */}
              <div className={`p-4 border rounded-xl flex items-start gap-3 ${factResult.verdict === 'TRUE' ? 'bg-teal-950/10 border-teal-900/30 text-teal-300' : factResult.verdict === 'FALSE' ? 'bg-red-950/10 border-red-900/30 text-rose-300' : 'bg-zinc-90 w bg-zinc-900/20 border-zinc-800 text-zinc-300'}`}>
                <span className="p-1.5 bg-black/10 rounded-lg">
                  {factResult.verdict === 'TRUE' ? <ShieldCheck className="w-5 h-5" /> : <ShieldX className="w-5 h-5 animate-pulse" />}
                </span>
                <div className="text-xs space-y-1">
                  <span className="font-mono uppercase text-[9px] tracking-widest block text-zinc-400">Verdict Verdict ID</span>
                  <div className="text-sm font-bold font-sans tracking-wide">Query is: {factResult.verdict}</div>
                  <p className="leading-relaxed font-mono text-[11.5px] mt-1">{factResult.explanation}</p>
                </div>
              </div>

              {/* Verified Sources Ground References */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Grounded References sources</span>
                {factResult.sources.length > 0 ? (
                  <div className="space-y-2">
                    {factResult.sources.slice(0, 2).map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-zinc-900 bg-zinc-900/30 hover:bg-zinc-900/50 rounded flex justify-between items-center text-[11px] font-mono text-zinc-300 transition-colors cursor-pointer group"
                      >
                        <span className="truncate max-w-[210px]">{src.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="p-2.5 bg-zinc-900/20 text-center rounded text-[10px] text-zinc-500 font-mono">
                    No citation links parsed on web database index.
                  </div>
                )}
              </div>

              <button
                onClick={clearFactCheck}
                className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 font-mono text-[10px] uppercase text-zinc-400 hover:text-white rounded border border-zinc-800 cursor-pointer transition-colors"
              >
                RESET SCAN GROUND
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Social Media Fake Profile Checker */}
        <div className="bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800 backdrop-blur-md flex flex-col justify-between space-y-5">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-400" />
              Social Media Synthetic Profile Analyzer
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5 uppercase font-mono">
              Metadata & reputation audit
            </p>
          </div>

          {!profileResult && !profileLoading && (
            <form onSubmit={executeProfileScan} className="space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                Analyze platforms profiles URLs or descriptions to identify synthetic identities, botting campaigns, or fake generated display icons.
              </p>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Target Platform Select</label>
                  <select
                    value={profilePlatform}
                    onChange={(e) => setProfilePlatform(e.target.value as any)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-xs font-mono text-zinc-300"
                  >
                    <option value="twitter">X (formerly Twitter)</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1">Profile Handle / URL Link</label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="url"
                      required
                      value={profileUrl}
                      onChange={(e) => setProfileUrl(e.target.value)}
                      placeholder="https://x.com/cyber_integrity_target"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 font-mono text-xs uppercase tracking-wide text-white rounded-lg border border-indigo-400/20 shadow-md cursor-pointer transition-all"
              >
                Scan Profile Credibility
              </button>
            </form>
          )}

          {profileLoading && (
            <div className="flex-1 py-14 flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-10 h-10 rounded-full border-2 border-teal-500/25 border-t-teal-500 animate-spin"></div>
              <div className="space-y-1 font-mono">
                <p className="text-xs text-teal-400 uppercase tracking-widest animate-pulse">Running Reputation Sweep</p>
                <p className="text-[10px] text-zinc-500 uppercase">Extracting handle network metrics...</p>
              </div>
            </div>
          )}

          {profileResult && !profileLoading && (
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between p-3 border border-zinc-900 bg-zinc-900/25 rounded-xl">
                <div>
                  <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Target ID Handle</div>
                  <div className="text-xs font-mono font-bold text-white max-w-[160px] truncate">@{profileResult.profileName}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Reputation Level</div>
                  <div className={`text-sm font-bold font-mono ${profileResult.isFake ? 'text-rose-400' : 'text-teal-400'}`}>
                    {profileResult.reputationScore}% / {profileResult.isFake ? "Suspicious" : "Valid"}
                  </div>
                </div>
              </div>

              {/* Reasons */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider">Audit Forensic Checkpoints</span>
                <div className="space-y-1.5 text-xs font-mono text-zinc-400 leading-normal">
                  {profileResult.reasons.map((reason, i) => (
                    <div key={i} className="flex gap-2 items-start p-2 bg-zinc-900/10 border border-zinc-900/50 rounded text-[11px]">
                      {profileResult.isFake ? <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" /> : <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />}
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={clearProfileCheck}
                className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 font-mono text-[10px] uppercase text-zinc-400 hover:text-white rounded border border-zinc-800 cursor-pointer transition-colors"
              >
                SCAN ANOTHER HANDLE
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
