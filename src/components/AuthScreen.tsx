/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Key, Mail, User as UserIcon, ChevronRight } from 'lucide-react';
import { User } from '../types';

interface AuthScreenProps {
  onAuthSuccess: (user: User, token: string) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin 
      ? { email, password } 
      : { username, email, password, role };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Credential authentication failed.");
      }

      onAuthSuccess(data.user, data.token);
    } catch (err: any) {
      setError(err.message || "Threat firewall denied entry. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const loginAsSeeded = async (type: 'guest' | 'admin') => {
    setLoading(true);
    setError(null);
    const credentials = type === 'admin' 
      ? { email: "admin@truthlens.ai", password: "admin123" }
      : { email: "guest@truthlens.ai", password: "user123" };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      onAuthSuccess(data.user, data.token);
    } catch (err: any) {
      setError(`Seeded database bypass failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-cyber-mesh text-white/90">
      <div className="w-full max-w-lg bg-zinc-950/80 backdrop-blur-md rounded-2xl border border-zinc-800 p-8 glow-indigo relative overflow-hidden">
        {/* Animated Corner Tech Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-indigo-500 rounded-tl-lg pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-500 rounded-tr-lg pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-indigo-500 rounded-bl-lg pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-indigo-500 rounded-br-lg pointer-events-none"></div>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-indigo-500/10 rounded-xl mb-4 border border-indigo-500/20 text-indigo-400">
            <Shield className="w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold font-sans tracking-tight text-white mb-1">
            TRUTHLENS AI
          </h1>
          <p className="text-sm font-mono text-indigo-400 uppercase tracking-widest">
            Deepfake Forensic Authenticator
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg mb-4 font-mono flex items-start gap-2 animate-shake">
            <span className="font-bold">ALERT:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm font-sans focus:outline-none focus:border-indigo-500 text-white placeholder-zinc-600 transition-colors"
                  placeholder="Security_Analyst"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">Security Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm font-sans focus:outline-none focus:border-indigo-500 text-white placeholder-zinc-600 transition-colors"
                placeholder="analyst@truthlens.ai"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1">Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm font-sans focus:outline-none focus:border-indigo-500 text-white placeholder-zinc-600 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Systems Clearance Level</label>
              <div className="flex gap-4">
                <label className="flex-1 flex items-center justify-center py-2.5 px-4 bg-zinc-900 rounded-lg border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
                  <input
                    type="radio"
                    name="role"
                    checked={role === 'user'}
                    onChange={() => setRole('user')}
                    className="mr-2 accent-indigo-500"
                  />
                  <span className="text-xs font-mono uppercase">User Analyst</span>
                </label>
                <label className="flex-1 flex items-center justify-center py-2.5 px-4 bg-zinc-900 rounded-lg border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
                  <input
                    type="radio"
                    name="role"
                    checked={role === 'admin'}
                    onChange={() => setRole('admin')}
                    className="mr-2 accent-indigo-500"
                  />
                  <span className="text-xs font-mono uppercase">System Admin</span>
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-medium rounded-lg py-2.5 text-sm uppercase tracking-wide flex items-center justify-center gap-2 hover:shadow-indigo-500/10 cursor-pointer border border-indigo-400/20 active:translate-y-px transition-all mt-4"
          >
            {loading ? (
              <span className="border-2 border-white/30 border-t-white rounded-full w-4 h-4 animate-spin"></span>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>{isLogin ? "Authenticate Certificate" : "Register Security Clearances"}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-mono text-zinc-400 hover:text-indigo-400 transition-colors focus:outline-none"
          >
            {isLogin ? "PROVISION NEW ACCOUNT >" : "RETURN TO MAIN ACCESS DECRYPT >"}
          </button>
        </div>

        {/* Guest access portal for instant preview evaluation */}
        <div className="mt-8 pt-6 border-t border-zinc-900">
          <p className="text-center text-xs font-mono text-zinc-500 mb-3 uppercase tracking-wider">
            Gateways Quick Sandbox Bypass
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => loginAsSeeded('guest')}
              disabled={loading}
              className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-indigo-400 rounded-lg border border-indigo-500/10 text-xs font-mono uppercase text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>User Bypass</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => loginAsSeeded('admin')}
              disabled={loading}
              className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-teal-400 rounded-lg border border-teal-500/10 text-xs font-mono uppercase text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Admin Bypass</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-2 text-center text-[10px] font-mono text-zinc-600">
            Guest credentials: user123 (user) & admin123 (admin)
          </div>
        </div>
      </div>
    </div>
  );
}
