/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface SecurityScore {
  authenticity: number; // 0-100 (high = genuine, low = manipulated/deepfake)
  confidence: number;   // 0-100 (AI model confidence)
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ManipulatedRegion {
  label: string;
  confidence: number;
  description: string;
  location?: string; // region label coordinates or visual landmarks
}

export interface MetadataField {
  key: string;
  value: string;
  status: 'clean' | 'suspicious' | 'unknown';
}

export interface VerificationHistory {
  date: string;
  event: string;
  status: 'passed' | 'warning' | 'failed';
}

export interface ForensicReport {
  id: string;
  userId?: string;
  mediaName: string;
  mediaSize: string;
  mediaType: 'image' | 'video' | 'audio';
  thumbnailUrl?: string;
  scanDate: string;
  scores: SecurityScore;
  aiExplanation: string;
  details: string;
  manipulatedRegions: ManipulatedRegion[];
  metadata: MetadataField[];
  forensicHash: string; // Fake physical token hash
  certificateId: string; // AUTHCODE-XXXX
  verificationTimeline: VerificationHistory[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface SocialMediaProfileScan {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'unknown';
  profileUrl: string;
  profileName: string;
  reputationScore: number; // 0-100
  isFake: boolean;
  reasons: string[];
}

export interface NewsFactCheck {
  query: string;
  verdict: 'TRUE' | 'FALSE' | 'MISLEADING' | 'UNVERIFIED';
  confidence: number;
  explanation: string;
  sources: { title: string; url: string }[];
}

export interface DashboardStats {
  totalScans: number;
  fakeMediaDetected: number;
  averageAccuracy: number;
  criticalAlerts: number;
  activityTimeline: { date: string; scans: number; manipulated: number }[];
  mediaTypeBreakdown: { name: string; value: number }[];
  accuracyTrend: { name: string; score: number }[];
}
