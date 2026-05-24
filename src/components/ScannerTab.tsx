/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Camera, CheckSquare, RefreshCw, Film, Image, Music, Play, AlertTriangle } from 'lucide-react';
import { ForensicReport } from '../types';

interface ScannerTabProps {
  token: string | null;
  onScanComplete: (report: ForensicReport) => void;
  recentScans: ForensicReport[];
  onSelectScan: (report: ForensicReport) => void;
  onDeleteScan: (id: string) => void;
}

export default function ScannerTab({ token, onScanComplete, recentScans, onSelectScan, onDeleteScan }: ScannerTabProps) {
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: 'image' | 'video' | 'audio'; mime: string; base64: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'webcam'>('upload');
  const [webcamActive, setWebcamActive] = useState(false);
  const [scanHistory, setScanHistory] = useState<ForensicReport[]>(recentScans);

  // Filter keys
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setScanHistory(recentScans);
  }, [recentScans]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFileInput(e.dataTransfer.files[0]);
    }
  };

  const processFileInput = (file: File) => {
    const reader = new FileReader();
    const type = file.type.startsWith('image') ? 'image' 
               : file.type.startsWith('video') ? 'video'
               : file.type.startsWith('audio') ? 'audio' : null;

    if (!type) {
      alert("Unsupported asset class. TruthLens limits inputs to PNG, JPG, MP4, MP3, WAV.");
      return;
    }

    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + " MB";

    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      setSelectedFile({
        name: file.name,
        size: sizeFormatted,
        type: type,
        mime: file.type,
        base64: base64String
      });
    };
    reader.readAsDataURL(file);
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFileInput(e.target.files[0]);
    }
  };

  // Turn on/off Webcam API
  const toggleWebcam = async () => {
    if (webcamActive) {
      stopWebcam();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setWebcamActive(true);
      } catch (err) {
        alert("Failed to access standard webcam sensor device capture: " + err);
      }
    }
  };

  const stopWebcam = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setWebcamActive(false);
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  const captureSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const base64 = dataUrl.split(',')[1];
        setSelectedFile({
          name: `Webcam_Snapshot_${Date.now().toString().substring(8)}.jpg`,
          size: "0.4 MB",
          type: "image",
          mime: "image/jpeg",
          base64: base64
        });
        stopWebcam();
      }
    }
  };

  // Run the full step scanning simulation & trigger express API call
  const executeForensicScan = async () => {
    if (!selectedFile) return;
    setScanning(true);

    const steps = [
      "Securing raw cryptographic file signature...",
      "Analyzing spatial pixel density mapping grids...",
      "Running advanced Fourier Spectral transformation...",
      "Querying Google Gemini AI cyber-forensics repository...",
      "Generating cryptographic authenticity certificate seals..."
    ];

    let currentStep = 0;
    setScanStep(steps[currentStep]);

    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setScanStep(steps[currentStep]);
      } else {
        clearInterval(stepInterval);
      }
    }, 1200);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          base64: selectedFile.base64,
          mimeType: selectedFile.mime,
          fileName: selectedFile.name,
          mediaType: selectedFile.type,
          size: selectedFile.size
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Deepfake scan failed.");
      }

      clearInterval(stepInterval);
      setScanning(false);
      onScanComplete(data.report);
    } catch (err: any) {
      clearInterval(stepInterval);
      setScanning(false);
      alert(`Forensic server timeout: ${err.message}`);
    }
  };

  const handleResetFile = () => {
    setSelectedFile(null);
  };

  // Lists filtering logic
  const filteredHistory = scanHistory.filter((item) => {
    const matchesQuery = item.mediaName.toLowerCase().includes(searchQuery.toLowerCase()) || item.certificateId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' ? true : item.mediaType === filterType;
    return matchesQuery && matchesType;
  });

  return (
    <div className="space-y-6">
      
      {/* File Ingestion Container Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Hand: Upload/Cam Module */}
        <div className="lg:col-span-3 bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800 backdrop-blur-md flex flex-col justify-between min-h-[440px] relative">
          
          {/* Diagnostic Corner Grid lights */}
          <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[9px] font-mono text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            SECURE PORTS READY
          </div>

          {!selectedFile && !scanning && (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="flex border-b border-zinc-900 pb-2 gap-4">
                <button
                  onClick={() => { setActiveTab('upload'); stopWebcam(); }}
                  className={`text-xs font-mono uppercase tracking-wider pb-1 transition-all focus:outline-none cursor-pointer ${activeTab === 'upload' ? 'border-b-2 border-indigo-500 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Upload File Module
                </button>
                <button
                  onClick={() => { setActiveTab('webcam'); }}
                  className={`text-xs font-mono uppercase tracking-wider pb-1 transition-all focus:outline-none cursor-pointer ${activeTab === 'webcam' ? 'border-b-2 border-indigo-500 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Live Webcam Ingestion
                </button>
              </div>

              {/* Upload Tab display */}
              {activeTab === 'upload' && (
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerUploadClick}
                  className={`border-2 border-dashed rounded-xl flex-1 py-14 px-6 flex flex-col justify-center items-center text-center group cursor-pointer transition-all duration-300 ${dragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-zinc-800 bg-zinc-900/10 hover:border-zinc-700'}`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*,audio/*"
                    className="hidden"
                  />
                  <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/15 group-hover:scale-105 group-hover:bg-indigo-500/10 transition-transform text-indigo-400 mb-4 shadow-inner">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Drag and Drop Media Stream</h3>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs font-mono select-none">
                    Supports JPG, PNG, MP4, WAV, MP3 limits up to 50MB.
                  </p>
                  <button
                    type="button"
                    className="mt-4 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded font-mono text-[10px] uppercase border border-zinc-800"
                  >
                    Select File Manually
                  </button>
                </div>
              )}

              {/* Webcam Tab display */}
              {activeTab === 'webcam' && (
                <div className="flex-1 flex flex-col justify-center items-center py-4 bg-zinc-900/10 border border-zinc-900 rounded-xl min-h-[240px]">
                  {!webcamActive ? (
                    <div className="text-center p-6 space-y-4">
                      <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/15 text-indigo-400 inline-block">
                        <Camera className="w-8 h-8" />
                      </div>
                      <p className="text-xs font-mono text-zinc-400 max-w-xs leading-relaxed">
                        Allow camera permissions inside your micro-frame client to snap portraits for live Deepfake neural map testing.
                      </p>
                      <button
                        onClick={toggleWebcam}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 font-mono text-xs uppercase text-white rounded-lg transition-colors cursor-pointer"
                      >
                        ACTIVATE OPTICAL PORT
                      </button>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center gap-4 px-4">
                      <div className="w-full max-w-sm rounded-lg overflow-hidden border border-zinc-800 relative bg-black aspect-video flex items-center justify-center">
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                        {/* Interactive scan lines decorative overlays */}
                        <div className="absolute inset-0 border border-indigo-500/20 pointer-events-none animate-laser-pulse"></div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={captureSnapshot}
                          className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-mono text-xs uppercase rounded transition-colors cursor-pointer"
                        >
                          Capture Frame Snap
                        </button>
                        <button
                          onClick={stopWebcam}
                          className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-mono text-xs uppercase rounded transition-colors cursor-pointer"
                        >
                          Cancel Capture
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Asset Preview mode loaded */}
          {selectedFile && !scanning && (
            <div className="flex-1 flex flex-col justify-between py-2">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2 mb-4">
                <span className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5">
                  {selectedFile.type === "image" ? <Image className="w-3.5 h-3.5 text-indigo-400" />
                   : selectedFile.type === "video" ? <Film className="w-3.5 h-3.5 text-rose-400" />
                   : <Music className="w-3.5 h-3.5 text-teal-400" />}
                  File Stage Preview
                </span>
                <button
                  onClick={handleResetFile}
                  className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> RE-STAGE FILE
                </button>
              </div>

              {/* Dynamic previews container based on mime file typings */}
              <div className="flex-1 flex flex-col justify-center items-center py-4 rounded-xl border border-zinc-900 bg-zinc-900/20 max-h-[220px] overflow-hidden">
                {selectedFile.type === "image" && (
                  <img
                    src={`data:${selectedFile.mime};base64,${selectedFile.base64}`}
                    alt="Pending Analysis Preview"
                    referrerPolicy="no-referrer"
                    className="max-h-[160px] rounded-lg border border-zinc-800 shadow"
                  />
                )}
                
                {selectedFile.type === "video" && (
                  <div className="text-center p-6 space-y-2">
                    <Film className="w-10 h-10 text-rose-400 mx-auto opacity-80" />
                    <p className="text-xs text-white uppercase font-bold truncate max-w-xs">{selectedFile.name}</p>
                    <p className="text-[10px] font-mono text-zinc-500">Video parameters staged: ({selectedFile.size})</p>
                  </div>
                )}

                {selectedFile.type === "audio" && (
                  <div className="text-center p-6 space-y-2">
                    <Music className="w-10 h-10 text-teal-400 mx-auto opacity-80" />
                    <p className="text-xs text-white uppercase font-bold truncate max-w-xs">{selectedFile.name}</p>
                    <p className="text-[10px] font-mono text-zinc-500">Audio phonemes staged: ({selectedFile.size})</p>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-900 flex justify-between items-center bg-zinc-900/10 p-4 rounded-xl">
                <div className="text-left">
                  <p className="text-xs text-zinc-300 font-mono truncate max-w-[200px]">{selectedFile.name}</p>
                  <p className="text-[10px] text-zinc-500 font-mono">{selectedFile.size}</p>
                </div>
                <button
                  onClick={executeForensicScan}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 border border-indigo-400/20 rounded-lg text-xs font-mono text-white tracking-wider uppercase cursor-pointer"
                >
                  RUN FORENSIC SCAN
                </button>
              </div>
            </div>
          )}

          {/* Dynamic AI Scanning animations state */}
          {scanning && (
            <div className="flex-1 flex flex-col justify-center items-center text-center p-8 space-y-6">
              
              {/* Radar scanner graphics simulation overlay */}
              <div className="relative w-32 h-32 rounded-full border border-indigo-500/20 flex items-center justify-center p-3">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-500/10 animate-spin"></div>
                
                {/* Visual scan pulse sweeping */}
                <div className="absolute inset-2 rounded-full border border-teal-500/25 animate-laser-pulse"></div>

                <div className="w-full h-full rounded-full bg-zinc-900/50 flex flex-col justify-center items-center relative overflow-hidden">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping absolute"></span>
                  <UploadCloud className="w-8 h-8 text-indigo-400 animate-pulse relative z-10" />
                  
                  {/* Neon scrolling scanning wireframe effect */}
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-indigo-500 opacity-60 animate-scan-line"></div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest animate-pulse">Running Neural Audits</h4>
                <p className="text-sm font-semibold text-white max-w-sm">{scanStep}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Hand: Instructive Guidelines Info widget */}
        <div className="lg:col-span-2 bg-zinc-950/60 p-6 rounded-2xl border border-zinc-800 backdrop-blur-md space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            Detection Parameters Guide
          </h3>
          
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-lg space-y-1">
              <h4 className="font-bold text-indigo-400 font-sans">1. Image Forensic Swapping</h4>
              <p className="text-zinc-400 leading-normal font-mono">
                Scans micro-blending boundaries, specular lighting on pupils, ear asymmetries, hair grids, and Fourier noise signals.
              </p>
            </div>

            <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-lg space-y-1">
              <h4 className="font-bold text-rose-400 font-sans">2. Video Manipulations & Swaps</h4>
              <p className="text-zinc-400 leading-normal font-mono">
                Evaluates keyframe consistency and matches audio phonemes tracks with lip movements to spot splicing patterns.
              </p>
            </div>

            <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-lg space-y-1">
              <h4 className="font-bold text-teal-400 font-sans">3. Synthetic Voice Cloning</h4>
              <p className="text-zinc-400 leading-normal font-mono">
                Extracts vocal spectrogram boundaries to confirm organic breath structures or spot flat voice synthesis (e.g., ElevenLabs models).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History Table Container */}
      <div className="bg-zinc-950/60 rounded-2xl border border-zinc-800 backdrop-blur-md p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-zinc-900 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">Historical Forensic Library</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Filter and examine previous local media scans</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {/* Search Input bar */}
            <input
              type="text"
              placeholder="Search by ID or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-md py-1 px-3 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 w-full sm:w-44"
            />

            {/* Tags categories */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-800 rounded-md py-1 px-3 text-xs font-mono text-zinc-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Assets</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
            </select>
          </div>
        </div>

        {/* Forensic list table */}
        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-400">
              <thead>
                <tr className="border-b border-zinc-900 text-[10px] font-mono uppercase text-zinc-500 bg-zinc-950/20">
                  <th className="py-3 px-4">Certificate ID</th>
                  <th className="py-3 px-4">File Name</th>
                  <th className="py-3 px-4">Asset Family</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4">Authenticity</th>
                  <th className="py-3 px-4 text-right">Diagnostic Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {filteredHistory.map((scan) => {
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
                      <td className="py-3.5 px-4 text-white font-medium max-w-[180px] truncate">
                        {scan.mediaName}
                      </td>
                      <td className="py-3.5 px-4 font-mono uppercase text-[10px]">
                        {scan.mediaType}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold">
                        {scan.scores.confidence}%
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className={`w-2 h-2 rounded-full ${isFake ? 'bg-rose-500' : 'bg-teal-500'}`}></span>
                          <span className={isFake ? 'text-rose-400' : 'text-teal-400'}>
                            {scan.scores.authenticity}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold ${isFake ? 'bg-rose-500/10 text-rose-400 border border-rose-500/10' : 'bg-teal-500/10 text-teal-400 border border-teal-500/10'}`}>
                          {scan.scores.riskLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs font-mono text-zinc-500 uppercase">
            No active matching forensic certificates located in library catalog logs.
          </div>
        )}
      </div>
    </div>
  );
}
