/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ShieldAlert, Send, Bot, User as UserIcon, HelpCircle } from 'lucide-react';
import { ChatMessage } from '../types';

interface CyberAssistantTabProps {
  token: string | null;
}

export default function CyberAssistantTab({ token }: CyberAssistantTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If authenticated, load backchat logs
    const loadChatHistory = async () => {
      if (!token) return;
      try {
        const res = await fetch("/api/chat/history", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.history) {
          setMessages(data.history);
        }
      } catch (err) {
        console.error("Failed to fetch chat logs.");
      }
    };

    loadChatHistory();
  }, [token]);

  // Handle auto scrolling
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !token) return;

    const userText = input;
    setInput('');
    setLoading(true);

    // Append user message optimistically
    const userMessage: ChatMessage = {
      id: "temp_user_" + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: userText })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      // Graceful error appendage
      const errorMessage: ChatMessage = {
        id: "temp_error_" + Date.now(),
        sender: 'assistant',
        text: "🔐 SYSTEM ERROR: Threat Intelligence Gateway timeout. Please verify active backend telemetry is running.",
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const preFilledPrompts = [
    "Explain ElevenLabs voice cloning indicators",
    "How to analyze a profile for diffusion avatars?",
    "Give me corporate deepfake phishing countermeasures",
    "What EXIF tags signal Generative AI tool metadata?"
  ];

  const handlePreFill = (text: string) => {
    if (loading) return;
    setInput(text);
  };

  return (
    <div className="bg-zinc-950/60 rounded-2xl border border-zinc-800 backdrop-blur-md p-6 h-[500px] flex flex-col justify-between relative overflow-hidden">
      
      {/* Header telemetry indicator */}
      <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">TruthLens Security Advisor</h3>
            <p className="text-[10px] text-zinc-500 uppercase font-mono">Cognitive warfare countermeasures coach</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
          Advisor Secured
        </div>
      </div>

      {/* Messages layout box */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="h-full flex flex-col justify-center items-center text-center p-8 space-y-3">
            <Bot className="w-10 h-10 text-indigo-400 opacity-60 animate-pulse" />
            <p className="text-xs uppercase font-mono text-zinc-400">Authenticating Communications Channel</p>
            <p className="text-[10px] text-zinc-500 max-w-sm uppercase font-mono">Please select a quick query or input questions below.</p>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-lg self-start border shrink-0 ${isUser ? 'bg-indigo-600/10 border-indigo-500/15 text-indigo-400' : 'bg-zinc-900/40 border-zinc-800 text-teal-400'}`}>
                {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3.5 rounded-xl text-xs space-y-1 ${isUser ? 'bg-indigo-600/15 border border-indigo-500/20 text-indigo-100 rounded-tr-none' : 'bg-zinc-900/60 border border-zinc-900 text-zinc-300 rounded-tl-none leading-relaxed font-mono whitespace-pre-wrap'}`}>
                <p>{msg.text}</p>
                <span className="text-[8px] text-zinc-500 uppercase font-mono block text-right mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="p-2 rounded-lg bg-zinc-900/45 border border-zinc-800 text-teal-400 inline-block self-start">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3 bg-zinc-900/30 border border-zinc-900/40 text-zinc-500 rounded-xl rounded-tl-none text-[11px] font-mono animate-pulse">
              System Advisor parsing phonetic structures...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Quick Queries board */}
      {messages.length <= 1 && !loading && (
        <div className="mt-auto mb-4 border-t border-zinc-900/60 pt-3">
          <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-1 mb-2">
            <HelpCircle className="w-3.5 h-3.5" /> Quick Cybersecurity Prompts Guidance
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
            {preFilledPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handlePreFill(p)}
                className="p-2 hover:bg-zinc-900/60 transition-colors bg-zinc-900/30 border border-zinc-900 rounded text-[10px] font-mono text-zinc-400 hover:text-white truncate cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input form */}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading || !token}
          placeholder={token ? "Type deepfake safety questions..." : "Please log in to query systems advisor..."}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !input.trim() || !token}
          className="p-2 px-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-900 rounded-lg text-white border border-indigo-400/20 shadow flex items-center justify-center cursor-pointer transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
