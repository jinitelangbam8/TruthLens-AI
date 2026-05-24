/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Award, AlertCircle, Trash2, Filter, Users, Database, ServerCrash } from 'lucide-react';
import { User, ForensicReport } from '../types';

interface AdminPanelTabProps {
  token: string | null;
  onSelectScan: (report: ForensicReport) => void;
  onRefreshStats: () => void;
}

export default function AdminPanelTab({ token, onSelectScan, onRefreshStats }: AdminPanelTabProps) {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [scansList, setScansList] = useState<ForensicReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [subTab, setSubTab] = useState<'users' | 'scans'>('users');
  const [error, setError] = useState<string | null>(null);

  const loadAdminTelemetry = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [usersResponse, scansResponse] = await Promise.all([
        fetch("/api/admin/users", { headers: { "Authorization": `Bearer ${token}` } }),
        fetch("/api/scans", { headers: { "Authorization": `Bearer ${token}` } })
      ]);

      const usersData = await usersResponse.json();
      const scansData = await scansResponse.json();

      if (!usersResponse.ok) throw new Error(usersData.message || "Failed to query system users.");
      if (!scansResponse.ok) throw new Error(scansData.message || "Failed to query system scans library.");

      setUsersList(usersData.users || []);
      setScansList(scansData.scans || []);
    } catch (err: any) {
      setError(err.message || "Credential authentication parameters mismatch.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminTelemetry();
  }, [token]);

  const deleteUser = async (id: string) => {
    if (!token) return;
    if (!window.confirm("CONFIRMATION ALERT: Terminate security clearance permissions for this operative?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setUsersList((prev) => prev.filter((u) => u.id !== id));
      loadAdminTelemetry();
    } catch (err: any) {
      alert(`Bypass failure: ${err.message}`);
    }
  };

  const deleteScan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) return;
    if (!window.confirm("CONFIRMATION ALERT: Expunge this report signature from central systems library logs?")) return;

    try {
      const res = await fetch(`/api/scans/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setScansList((prev) => prev.filter((s) => s.id !== id));
      onRefreshStats();
      loadAdminTelemetry();
    } catch (err: any) {
      alert(`Bypass failure: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            Clearance Level Admin Portal
          </h2>
          <p className="text-xs text-zinc-400">Review system activity records and monitor security parameters.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSubTab('users')}
            className={`px-3 py-1.5 font-mono text-xs uppercase rounded cursor-pointer ${subTab === 'users' ? 'bg-indigo-600 border border-indigo-400/20 text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-900 hover:text-zinc-200'}`}
          >
            <Users className="w-3.5 h-3.5 inline mr-1" /> OPERATIVES LISTINGS ({usersList.length})
          </button>
          <button
            onClick={() => setSubTab('scans')}
            className={`px-3 py-1.5 font-mono text-xs uppercase rounded cursor-pointer ${subTab === 'scans' ? 'bg-indigo-600 border border-indigo-400/20 text-white' : 'bg-zinc-900 text-zinc-400 border border-zinc-900 hover:text-zinc-200'}`}
          >
            <Database className="w-3.5 h-3.5 inline mr-1" /> SCANS CATALOGS ({scansList.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl text-teal-400 text-xs font-mono flex items-start gap-3">
          <ServerCrash className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-rose-500">ADMIN DECRYPTION TIMEOUT:</span>
            <p className="text-zinc-400 leading-normal">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center space-y-3 font-mono">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto"></div>
          <p className="text-xs text-zinc-400 uppercase tracking-widest animate-pulse">Accessing administrative core...</p>
        </div>
      ) : (
        <>
          {/* SubTab display Users lists */}
          {subTab === 'users' && (
            <div className="bg-zinc-950/60 rounded-2xl border border-zinc-800 p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-400">
                  <thead>
                    <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase text-zinc-500 bg-zinc-950/20">
                      <th className="py-3 px-4">Operative ID</th>
                      <th className="py-3 px-4">Identifier Handle</th>
                      <th className="py-3 px-4">Security Email Address</th>
                      <th className="py-3 px-4">Authorization Role</th>
                      <th className="py-3 px-4">Registration Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/60">
                    {usersList.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-900/20 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-zinc-400">{user.id}</td>
                        <td className="py-3.5 px-4 text-white font-medium">{user.username}</td>
                        <td className="py-3.5 px-4 font-mono">{user.email}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wide font-bold ${user.role === 'admin' ? 'bg-indigo-505 bg-indigo-500/10 text-indigo-400 border border-indigo-500/10' : 'bg-zinc-800 text-zinc-400 border border-zinc-800'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-500 font-mono">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            disabled={user.id === "user_admin" || user.email === "admin@truthlens.ai"}
                            onClick={() => deleteUser(user.id)}
                            className="p-1 px-2.5 bg-zinc-900 hover:bg-rose-950/30 text-zinc-500 hover:text-rose-400 rounded border border-zinc-800 hover:border-rose-900/30 transition-all disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SubTab display Scans libraries */}
          {subTab === 'scans' && (
            <div className="bg-zinc-950/60 rounded-2xl border border-zinc-800 p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-400">
                  <thead>
                    <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase text-zinc-500 bg-zinc-950/20">
                      <th className="py-3 px-4">License Code</th>
                      <th className="py-3 px-4">Media File Name</th>
                      <th className="py-3 px-4">Family Base</th>
                      <th className="py-3 px-4">Authenticity</th>
                      <th className="py-3 px-4">Risk Level</th>
                      <th className="py-3 px-4 text-right header-actions">Audited Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/60">
                    {scansList.map((scan) => {
                      const isFake = scan.scores.authenticity < 60;
                      return (
                        <tr 
                          key={scan.id} 
                          className="hover:bg-zinc-900/40 cursor-pointer transition-colors group"
                          onClick={() => onSelectScan(scan)}
                        >
                          <td className="py-3.5 px-4 font-mono text-indigo-400 font-semibold group-hover:underline">
                            {scan.certificateId}
                          </td>
                          <td className="py-3.5 px-4 text-white font-medium max-w-[200px] truncate">{scan.mediaName}</td>
                          <td className="py-3.5 px-4 font-mono uppercase text-[10px]">{scan.mediaType}</td>
                          <td className="py-3.5 px-4 font-mono font-bold">
                            <span className={isFake ? 'text-rose-400 animate-pulse' : 'text-teal-400'}>
                              {scan.scores.authenticity}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold ${isFake ? 'bg-rose-500/10 text-rose-400 border border-rose-500/10' : 'bg-teal-500/10 text-teal-400 border border-teal-500/10'}`}>
                              {scan.scores.riskLevel}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => deleteScan(scan.id, e)}
                              className="p-1 px-2.5 bg-zinc-900 hover:bg-rose-950/30 text-zinc-500 hover:text-rose-400 rounded border border-zinc-800 hover:border-rose-900/30 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
