/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  Search, 
  Bot, 
  Users, 
  LogOut, 
  User as UserIcon, 
  Sun,
  Moon
} from 'lucide-react';

import AuthScreen from './components/AuthScreen';
import DashboardStatsOverview from './components/DashboardStatsOverview';
import ScannerTab from './components/ScannerTab';
import ForensicReportView from './components/ForensicReportView';
import FactCheckTab from './components/FactCheckTab';
import CyberAssistantTab from './components/CyberAssistantTab';
import AdminPanelTab from './components/AdminPanelTab';

import { User, ForensicReport, DashboardStats } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [scans, setScans] = useState<ForensicReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ForensicReport | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('truthlens_theme') as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('truthlens_theme', nextTheme);
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  // Parse session on component load
  useEffect(() => {
    const savedToken = localStorage.getItem('truthlens_token');
    const savedUser = localStorage.getItem('truthlens_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Fetch scans catalog & dynamic intelligence stats
  const fetchTelemetryData = async () => {
    try {
      // Setup authorization header optionally
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};
      
      const [scansRes, statsRes] = await Promise.all([
        fetch("/api/scans", { headers }),
        fetch("/api/analytics")
      ]);

      const scansData = await scansRes.json();
      const statsData = await statsRes.json();

      if (scansRes.ok && scansData.scans) {
        setScans(scansData.scans);
      }
      if (statsRes.ok && statsData.stats) {
        setStats(statsData.stats);
      }
    } catch (err) {
      console.error("Telemetry gateway sync failure:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTelemetryData();
    }
  }, [user, token]);

  const handleAuthSuccess = (authenticatedUser: User, sessionToken: string) => {
    setUser(authenticatedUser);
    setToken(sessionToken);
    localStorage.setItem('truthlens_token', sessionToken);
    localStorage.setItem('truthlens_user', JSON.stringify(authenticatedUser));
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setSelectedReport(null);
    localStorage.removeItem('truthlens_token');
    localStorage.removeItem('truthlens_user');
  };

  const handleScanCompleted = (report: ForensicReport) => {
    setSelectedReport(report);
    fetchTelemetryData();
  };

  const handleSelectReport = (report: ForensicReport) => {
    setSelectedReport(report);
  };

  const handleDeleteScan = async (id: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/scans/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setScans((prev) => prev.filter(s => s.id !== id));
        fetchTelemetryData();
      }
    } catch (err) {
      console.error("Failed to expunge signature:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white/90 flex flex-col justify-center items-center font-mono space-y-3">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
        <p className="text-xs uppercase tracking-widest text-zinc-500">Decrypting Gateways...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black bg-cyber-mesh py-8 flex items-center justify-center">
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white/95 font-sans flex flex-col justify-between relative overflow-hidden bg-cyber-mesh">
      
      {/* Absolute Ambient Colorful Lights behind content for high visual fidelity */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-[45%] h-[45%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[30%] right-[10%] w-[35%] h-[35%] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Aesthetic Top Vibrant Gradient Line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-cyan-400 via-indigo-500 via-purple-500 via-pink-500 to-rose-400 z-50 sticky top-0 no-print"></div>

      {/* Top Interactive Diagnostics Header banner */}
      <header className="border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md sticky top-1 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/15">
              <Shield className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white uppercase font-sans">TruthLens AI</h1>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold animate-pulse uppercase tracking-wider">Telemetry Active</span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-0.5">Deepfake Detection & Forensics</p>
            </div>
          </div>

          {/* Quick Stats overview panel */}
          <div className="flex items-center gap-4 text-xs font-mono">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-indigo-400 border border-zinc-800 rounded-lg transition-all cursor-pointer flex items-center justify-center"
              title={theme === 'dark' ? "Switch to High-Contrast Light Mode" : "Switch to Midnight Dark Mode"}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* Custom Active User profile display */}
            <div className="bg-zinc-900/40 p-1.5 px-3 rounded-lg border border-zinc-800 flex items-center gap-2">
              <span className="p-1 bg-indigo-500/10 rounded text-indigo-400">
                <UserIcon className="w-3.5 h-3.5" />
              </span>
              <div className="text-left">
                <div className="font-bold text-zinc-200">{user.username}</div>
                <div className="text-[9px] text-zinc-500 uppercase">{user.role} Operative</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 bg-zinc-900/60 hover:bg-rose-950/20 text-zinc-400 hover:text-rose-400 border border-zinc-800 rounded-lg transition-all cursor-pointer"
              title="Terminate Security Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Navigation Tabs Menu bar (hidden while viewing isolated forensic certificates) */}
        {!selectedReport && (
          <div className="flex border-b border-zinc-950 pb-2 no-print gap-5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`pb-2.5 text-xs font-mono uppercase tracking-wider transition-all focus:outline-none cursor-pointer flex items-center gap-2 ${activeTab === 'dashboard' ? 'border-b-2 border-indigo-500 text-indigo-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Activity className="w-4 h-4" />
              Intelligence Dashboard
            </button>
            <button
              onClick={() => setActiveTab('scanner')}
              className={`pb-2.5 text-xs font-mono uppercase tracking-wider transition-all focus:outline-none cursor-pointer flex items-center gap-2 ${activeTab === 'scanner' ? 'border-b-2 border-indigo-500 text-indigo-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Shield className="w-4 h-4" />
              Forensic Sweep Scanner
            </button>
            <button
              onClick={() => setActiveTab('factcheck')}
              className={`pb-2.5 text-xs font-mono uppercase tracking-wider transition-all focus:outline-none cursor-pointer flex items-center gap-2 ${activeTab === 'factcheck' ? 'border-b-2 border-indigo-500 text-indigo-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Search className="w-4 h-4" />
              Verification Desk
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className={`pb-2.5 text-xs font-mono uppercase tracking-wider transition-all focus:outline-none cursor-pointer flex items-center gap-2 ${activeTab === 'assistant' ? 'border-b-2 border-indigo-500 text-indigo-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Bot className="w-4 h-4" />
              Defense Coach Bot
            </button>
            
            {user.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`pb-2.5 text-xs font-mono uppercase tracking-wider transition-all focus:outline-none cursor-pointer flex items-center gap-2 ${activeTab === 'admin' ? 'border-b-2 border-indigo-500 text-indigo-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Users className="w-4 h-4" />
                Root Command Control
              </button>
            )}
          </div>
        )}

        {/* Dynamic Route views resolver */}
        {selectedReport ? (
          <ForensicReportView 
            report={selectedReport} 
            onBack={() => { setSelectedReport(null); fetchTelemetryData(); }} 
          />
        ) : (
          <div>
            {activeTab === 'dashboard' && (
              <DashboardStatsOverview 
                stats={stats} 
                onNavigateToTab={(tab) => { setActiveTab(tab); }} 
              />
            )}
            {activeTab === 'scanner' && (
              <ScannerTab 
                token={token} 
                onScanComplete={handleScanCompleted}
                recentScans={scans}
                onSelectScan={handleSelectReport}
                onDeleteScan={handleDeleteScan}
              />
            )}
            {activeTab === 'factcheck' && (
              <FactCheckTab />
            )}
            {activeTab === 'assistant' && (
              <CyberAssistantTab token={token} />
            )}
            {activeTab === 'admin' && (
              <AdminPanelTab 
                token={token} 
                onSelectScan={handleSelectReport} 
                onRefreshStats={fetchTelemetryData}
              />
            )}
          </div>
        )}
      </main>

      {/* Cybernetic footer telemetry indices */}
      <footer className="border-t border-zinc-900 bg-zinc-950/40 py-6 mt-12 no-print text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-zinc-500">
          <p className="uppercase tracking-wider">
            TRUTHLENS AI FORENSICS BLOCKCHAIN REGISTER SEAL &copy; 2026. ALL SECURITY ENGINES ARMORED.
          </p>
          <div className="flex gap-4">
            <span className="hover:text-zinc-300 transition-colors cursor-pointer uppercase">Threat Warning Standards</span>
            <span>&bull;</span>
            <span className="hover:text-zinc-300 transition-colors cursor-pointer uppercase">API Nodes</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
