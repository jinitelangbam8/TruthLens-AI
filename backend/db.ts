/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, ForensicReport, ChatMessage, DashboardStats } from "../src/types";

// Fallback JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "truthlens_ai_security_secret_2026";

// Dynamic in-memory operational databases
let usersDB: User[] = [];
let userPasswords: Record<string, string> = {}; // userId -> hashed_pwd
let scansDB: ForensicReport[] = [];
let chatsDB: Record<string, ChatMessage[]> = {}; // userId -> chat array

// Preseed system with premium forensic cases for stellar visualization on startup
const startTimestamp = new Date();
const initialScans: ForensicReport[] = [
  {
    id: "scan_101",
    mediaName: "fake_politician_press_release.mp4",
    mediaSize: "14.2 MB",
    mediaType: "video",
    scanDate: new Date(startTimestamp.getTime() - 24 * 3600 * 1000).toISOString(),
    scores: {
      authenticity: 24,
      confidence: 94,
      riskLevel: "CRITICAL"
    },
    aiExplanation: "CRITICAL WARNING: Automated lip-sync translation pipeline found. Speech tracks exhibit asymmetric timing discrepancies and synthetic facial pixel blending around visual quadrants 12-B.",
    details: "This scan targets a viral social video. Facial landmarks match GAN face-swap templates. Auditory pitch waves match known generative synthesizer profiles (ElevenLabs clone type). Synthetic pixel noise is clearly visible around the eyes and mouth boundary.",
    manipulatedRegions: [
      { label: "Ocular Frame Splices", confidence: 96, description: "Facial frame exhibits spatial frequency anomalies around eye reflections." },
      { label: "Lip Sequence desynchronization", confidence: 92, description: "180ms delay detected between audio track output and optical lip contours." }
    ],
    metadata: [
      { key: "Encoding Software", value: "Unknown synthetic injection", status: "suspicious" },
      { key: "Frame Rate", value: "29.97 fps (Stabilized)", status: "clean" },
      { key: "Focal Length", value: "No EXIF lens profile", status: "suspicious" },
      { key: "Sensor Matching", value: "Mismatch between frame 120 and 310", status: "suspicious" }
    ],
    forensicHash: "8f4fa24be618c7ea9da9240fc926ca21ad1249b6fa918001b918f029acc1cf2b",
    certificateId: "AUTHCODE-8F4FA2",
    verificationTimeline: [
      { date: new Date().toISOString(), event: "Ingested video package file", status: "passed" },
      { date: new Date().toISOString(), event: "Frame frequency alignment check", status: "failed" },
      { date: new Date().toISOString(), event: "Voice cadence authenticity check", status: "failed" }
    ]
  },
  {
    id: "scan_102",
    mediaName: "ai_watermark_synthesized_avatar.png",
    mediaSize: "2.1 MB",
    mediaType: "image",
    scanDate: new Date(startTimestamp.getTime() - 12 * 3600 * 1000).toISOString(),
    scores: {
      authenticity: 12,
      confidence: 98,
      riskLevel: "CRITICAL"
    },
    aiExplanation: "AI WATERMARK DETECTED: This picture is fully synthetic. Contains embedded digital high-frequency signature patterns used by Stability AI generator engines.",
    details: "Spectral frequency analysis of the pixel grids reveals standard noise compression consistent with Latent Diffusion Models. Facial symmetries are synthetically ideal, and high-frequency details (hair strands, fabric textures) contain typical geometric loops.",
    manipulatedRegions: [
      { label: "Diffusion noise pattern", confidence: 99, description: "Fourier transform of the image segments yields synthetic noise loops." },
      { label: "Geometric Hair Inconsistency", confidence: 88, description: "Micro hair elements fuse unnaturally into solid dermal skin matrices." }
    ],
    metadata: [
      { key: "EXIF Generator", value: "StableDiffusion V3 (Latent)", status: "suspicious" },
      { key: "Resolution", value: "1024x1024", status: "clean" },
      { key: "Color Space", value: "sRGB (Uncalibrated)", status: "suspicious" }
    ],
    forensicHash: "c010afeefaa11234b9d0901e888911abfe92aa129cc62181fc8ea7dacc1243ab",
    certificateId: "AUTHCODE-C010AF",
    verificationTimeline: [
      { date: new Date().toISOString(), event: "Asset upload successful", status: "passed" },
      { date: new Date().toISOString(), event: "Fourier Transform noise check", status: "failed" }
    ]
  },
  {
    id: "scan_103",
    mediaName: "ceo_voice_clone_instruction.mp3",
    mediaSize: "1.4 MB",
    mediaType: "audio",
    scanDate: new Date(startTimestamp.getTime() - 4 * 3600 * 1000).toISOString(),
    scores: {
      authenticity: 38,
      confidence: 89,
      riskLevel: "HIGH"
    },
    aiExplanation: "VOICE CLONE SUSPECTED: Deep learning phonetic patterns and audio spectrogram anomalies suggest synthetic vocal rendering (speech-to-speech transfer).",
    details: "The audio spectrum shows flat vocal breathing segments. Sentences end abruptly without physiological inhalation cues. Tone fluctuations match standardized neural voice clones.",
    manipulatedRegions: [
      { label: "Anomalous Flat Spectrogram", confidence: 91, description: "Absence of natural micro-level vocal noise across speech bands." },
      { label: "Zero Physiological Pauses", confidence: 85, description: "Phonetic sentences link without any respiration gaps or breath elements." }
    ],
    metadata: [
      { key: "Encoding Profile", value: "ElevenLabs AI Audio Clone v2", status: "suspicious" },
      { key: "Frequency", value: "44.1 kHz Mono", status: "clean" },
      { key: "Noise Splicer", value: "Artificially smooth floor", status: "suspicious" }
    ],
    forensicHash: "d128bca128bbcaebbcafce019accfbcda901992bcda77bc6a1dacf01142bc3df",
    certificateId: "AUTHCODE-D128BC",
    verificationTimeline: [
      { date: new Date().toISOString(), event: "Phonetic raw wave separation", status: "passed" },
      { date: new Date().toISOString(), event: "Spectrogram frequency check", status: "failed" }
    ]
  },
  {
    id: "scan_104",
    mediaName: "executive_headshot_verified.jpg",
    mediaSize: "3.5 MB",
    mediaType: "image",
    scanDate: new Date(startTimestamp.getTime() - 2 * 3600 * 1000).toISOString(),
    scores: {
      authenticity: 94,
      confidence: 96,
      riskLevel: "LOW"
    },
    aiExplanation: "VERIFIED AUTHENTIC: Solid sensor-level noise profile and structural EXIF matching confirmed. Digital watermark signature validates camera capture device.",
    details: "The asset stands up to full rigorous testing. Pixel boundaries display authentic high-frequency chromatic aberration. Geometric ratios perfectly match camera calibration metadata.",
    manipulatedRegions: [],
    metadata: [
      { key: "Camera Vendor", value: "Fujifilm X-T5", status: "clean" },
      { key: "Lens Profile", value: "XF33mmF1.4 R LM WR", status: "clean" },
      { key: "Software Signature", value: "Fujifilm RAW Converter", status: "clean" }
    ],
    forensicHash: "32ebcaef18accfeab9d9196bcf291accfcdeae19a9dcca1d7a8bf20a9dcdaec2",
    certificateId: "AUTHCODE-32EBCA",
    verificationTimeline: [
      { date: new Date().toISOString(), event: "Ingested profile asset", status: "passed" },
      { date: new Date().toISOString(), event: "EXIF signature verify completed", status: "passed" },
      { date: new Date().toISOString(), event: "Deep neural pixel map verified", status: "passed" }
    ]
  }
];

scansDB = [...initialScans];

// Initialize default admin user so admin features can be previewed without registering
const defaultAdminPasswordHash = bcrypt.hashSync("admin123", 10);
usersDB.push({
  id: "user_admin",
  username: "SecurityOfficer",
  email: "admin@truthlens.ai",
  role: "admin",
  createdAt: new Date().toISOString()
});
userPasswords["user_admin"] = defaultAdminPasswordHash;

// Also seed a default guest user for immediate play
const defaultUserPasswordHash = bcrypt.hashSync("user123", 10);
usersDB.push({
  id: "user_guest",
  username: "GuestAnalyst",
  email: "guest@truthlens.ai",
  role: "user",
  createdAt: new Date().toISOString()
});
userPasswords["user_guest"] = defaultUserPasswordHash;

// Preseed the specific user's email as a high-clearance System Admin
usersDB.push({
  id: "user_jini",
  username: "Jini_Telangbam",
  email: "jinitelangbam8@gmail.com",
  role: "admin",
  createdAt: new Date().toISOString()
});
userPasswords["user_jini"] = bcrypt.hashSync("user123", 10);

// Storage utility exports
export const Storage = {
  // Users
  updatePassword: async (userId: string, passwordPlain: string): Promise<void> => {
    const hash = await bcrypt.hash(passwordPlain, 10);
    userPasswords[userId] = hash;
  },
  createUser: async (username: string, email: string, passwordPlain: string, role: 'user' | 'admin' = 'user'): Promise<User> => {
    const existing = usersDB.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("Email is already registered under a TruthLens credential.");
    }
    const id = "user_" + Math.random().toString(36).substring(2, 9);
    const hash = await bcrypt.hash(passwordPlain, 10);
    const user: User = {
      id,
      username,
      email: email.toLowerCase(),
      role,
      createdAt: new Date().toISOString()
    };
    usersDB.push(user);
    userPasswords[id] = hash;
    return user;
  },

  findUserById: async (id: string): Promise<User | undefined> => {
    return usersDB.find((u) => u.id === id);
  },

  findUserByEmail: async (email: string): Promise<User | undefined> => {
    return usersDB.find((u) => u.email.toLowerCase() === email.toLowerCase());
  },

  verifyPassword: async (userId: string, passwordPlain: string): Promise<boolean> => {
    const hash = userPasswords[userId];
    if (!hash) return false;
    return bcrypt.compare(passwordPlain, hash);
  },

  getAllUsers: async (): Promise<User[]> => {
    return usersDB;
  },

  deleteUser: async (id: string): Promise<boolean> => {
    const index = usersDB.findIndex((u) => u.id === id);
    if (index !== -1) {
      usersDB.splice(index, 1);
      delete userPasswords[id];
      return true;
    }
    return false;
  },

  // JWT Signature Operations
  signToken: (user: User): string => {
    return jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
  },

  verifyToken: (token: string): any => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  },

  // Scan Reports
  saveReport: async (userId: string | undefined, report: Omit<ForensicReport, 'id' | 'forensicHash' | 'certificateId'>): Promise<ForensicReport> => {
    const id = "scan_" + Math.random().toString(36).substring(2, 9);
    const forensicHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const certificateId = "AUTHCODE-" + forensicHash.substring(0, 6).toUpperCase();

    const fullReport: ForensicReport = {
      ...report,
      id,
      userId,
      forensicHash,
      certificateId
    };

    scansDB.unshift(fullReport); // Insert at beginning
    return fullReport;
  },

  getReportById: async (id: string): Promise<ForensicReport | undefined> => {
    return scansDB.find((s) => s.id === id || s.certificateId === id);
  },

  getUserScans: async (userId: string): Promise<ForensicReport[]> => {
    return scansDB.filter((s) => s.userId === userId || s.userId === undefined);
  },

  getAllScans: async (): Promise<ForensicReport[]> => {
    return scansDB;
  },

  deleteScan: async (id: string): Promise<boolean> => {
    const index = scansDB.findIndex((s) => s.id === id);
    if (index !== -1) {
      scansDB.splice(index, 1);
      return true;
    }
    return false;
  },

  // Chats
  getUserChat: async (userId: string): Promise<ChatMessage[]> => {
    if (!chatsDB[userId]) {
      // Seed default welcoming message
      chatsDB[userId] = [
        {
          id: "msg_init",
          sender: "assistant",
          text: `🔐 System Active. Greeting, operative. I am TruthLens Advisor. I can explain generative deepfakes, provide prevention strategies for corporate spear-phishing campaigns, check profiles, or help review forensic indicators. How can I protect your security context today?`,
          timestamp: new Date().toISOString()
        }
      ];
    }
    return chatsDB[userId];
  },

  saveChatMessage: async (userId: string, sender: 'user' | 'assistant', text: string): Promise<ChatMessage> => {
    const chat = await Storage.getUserChat(userId);
    const newMessage: ChatMessage = {
      id: "msg_" + Math.random().toString(36).substring(2, 9),
      sender,
      text,
      timestamp: new Date().toISOString()
    };
    chat.push(newMessage);
    chatsDB[userId] = chat;
    return newMessage;
  },

  // Dynamic Dashboard Stats aggregator
  getSystemAnalytics: async (): Promise<DashboardStats> => {
    const totalScans = scansDB.length;
    const fakeMediaDetected = scansDB.filter((s) => s.scores.authenticity < 60).length;
    const criticalAlerts = scansDB.filter((s) => s.scores.riskLevel === "CRITICAL").length;
    
    // Average accuracy across scanned files (derived from mean confidence rate)
    let totalConfidence = 0;
    scansDB.forEach((s) => {
      totalConfidence += s.scores.confidence;
    });
    const averageAccuracy = totalScans > 0 ? Math.round(totalConfidence / totalScans) : 95;

    // Timeline calculations over 7 days activity
    const activityTimeline = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 3600 * 1000);
      const dateStr = d.toISOString().substring(8, 10) + " " + d.toLocaleString("default", { month: "short" });
      const dailyScans = scansDB.filter((s) => s.scanDate.substring(0, 10) === d.toISOString().substring(0, 10));
      const dailyManipulated = dailyScans.filter((s) => s.scores.authenticity < 60).length;

      activityTimeline.push({
        date: dateStr,
        scans: dailyScans.length + Math.floor(Math.random() * 2), // small organic fluff for visualization
        manipulated: dailyManipulated
      });
    }

    // Media Breakdowns
    const imageCount = scansDB.filter((s) => s.mediaType === "image").length;
    const videoCount = scansDB.filter((s) => s.mediaType === "video").length;
    const audioCount = scansDB.filter((s) => s.mediaType === "audio").length;

    const mediaTypeBreakdown = [
      { name: "Image Scan", value: imageCount || 1 },
      { name: "Video Scan", value: videoCount || 1 },
      { name: "Audio Scan", value: audioCount || 1 }
    ];

    const accuracyTrend = [
      { name: "00:00", score: 92 },
      { name: "04:00", score: 95 },
      { name: "08:00", score: 94 },
      { name: "12:00", score: 97 },
      { name: "16:00", score: 96 },
      { name: "20:00", score: 98 }
    ];

    return {
      totalScans: totalScans + 42, // display aggregate seeded values plus scanned counts
      fakeMediaDetected: fakeMediaDetected + 29,
      averageAccuracy: averageAccuracy,
      criticalAlerts: criticalAlerts + 12,
      activityTimeline,
      mediaTypeBreakdown,
      accuracyTrend
    };
  }
};
