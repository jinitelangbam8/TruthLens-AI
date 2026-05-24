# TruthLens AI 🛡️
### Advanced AI Deepfake Detection & Cybersecurity Analytics System

TruthLens AI is a modern, full-stack, AI-powered cybersecurity application designed to detect manipulated media and synthesized components—including AI-generated images, face-swapping patterns, edited videos, fake celebrity faces, and cloned synthetic voices. Powered by the Google Gemini API (Google AI Studio) and designed with a dark, high-contrast, cybernetic interface, the system generates verifiable forensic reports, provides a cybersecurity advisor, and acts as an educational and monitoring platform.

This repository is structured to serve as an exemplary **Final-Year Computer Science or Cybersecurity Engineering Project**, incorporating clean, scalable directory layouts, secure authentication tokens (JWT), cryptographic hashing, Express security guards, and in-depth multi-modal neural analyses.

---

## 🚀 Key Architectural Features
1. **Modern Cyber Glassmorphism Interface**: Standard Space Grotesk and JetBrains Mono pairings styled with Tailwind CSS, animated radars, responsive gauges, and printable report sheets.
2. **Multi-Modal AI Ingestion Ports**: Integrates secure file drops (images, videos, audio) alongside a live webcam portrait capture module to test face manipulation on fresh portraits.
3. **Google Gemini Forensic Intelligence**: Analyzes pixel densities, spectral frequencies, lighting consistency, and vocal phonemes sequences to spot spatial GAN/diffusion noise or robotic wave-cloners (ElevenLabs types).
4. **Interactive Autopsy Certificates**: Generates official print-ready forensic credentials featuring discrete SHA-256 signatures, validation logs, and certification blocks.
5. **Grounded Verification Desk**: Connects to active news indices via Google Search Grounding to check headlines, viral claims, and calculates social handle credibility scores.
6. **Defense Coach Bot**: Conversational AI assistant trained to tutor operatives on generative frameworks (diffusion, GANs, deep learning) and corporate spear-phishing tactics.
7. **Role-Based Command Portal**: Admin-specific clearances allowing systems officers to query registered operative tables, supervise scan data catalogs, and terminate records dynamically.

---

## 📂 Engineering Directory Layout
```text
├── backend/
│   ├── db.ts               # Unified Memory & MongoDB-Ready persistence engine
│   └── services/
│       └── gemini.ts       # Secure Google GenAI SDK model adapters (Search Grounding & prompts)
├── src/
│   ├── components/
│   │   ├── AuthScreen.tsx             # Futuristic glowing register & credentials login
│   │   ├── DashboardStatsOverview.tsx # Custom responsive SVG activity gauges & timelines
│   │   ├── ScannerTab.tsx             # Interactive file upload drop zone & webcam snapper
│   │   ├── ForensicReportView.tsx    # High-authenticity certificates & anomaly audit blocks
│   │   ├── FactCheckTab.tsx           # Profile scanners & misinformation fact checks
│   │   └── CyberAssistantTab.tsx      # Defensive AI cybersecurity tutorship chat
│   ├── App.tsx             # Interactive route orchestrator & auth-gates
│   ├── types.ts            # Declaration bindings mapping users, reports, and stats
│   └── index.css           # Grid lines, laser-pulse overrides, print media parameters
├── server.ts               # Custom Express Entry (Helmet-alternative headers, Rate-limit, sanitization)
└── package.json            # Dynamic Express + Vite script configurations
```

---

## 🔧 Production Setup & Deployment Guidance

### 1. MongoDB Atlas Provisioning (Optional)
If scaling to full MongoDB Atlas persistence for production, compile the environment variables as follows:
1. Navigate to [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database) and provision a clean cluster database.
2. Create an admin database access operative and retrieve the connection URI.
3. Replace the placeholder database URI config in your production variables with:
   ```text
   MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/truthlens"
   ```

### 2. Google AI Studio Integration
1. Visit the [Google AI Studio Secrets Portal](https://aistudio.google.com/) and register a free Gemini API Secret Key.
2. Store this variable as `GEMINI_API_KEY` inside your host settings (Render, Railway, or Vercel). NEVER build API keys directly into client-side asset code.

### 3. Backend Express Deployment (Render / Railway)
The backend compiles automatically and is standalone standard production ready:
* **Build Command**: `npm run build`
* **Start Command**: `npm run start`
* **Required Environment Variables**:
  * `NODE_ENV="production"`
  * `PORT=3000` (The server binds to port `3000` on host `0.0.0.0` automatically as required for container network route ingestion).
  * `GEMINI_API_KEY=<your_gcap_api_key>`
  * `JWT_SECRET=<unique_private_signature_phrase>`
  * `MONGODB_URI=<your_atlas_connection_string>`

### 4. Frontend Client Deployment (Vercel)
Vercel hosts Vite + Express full-stack combinations natively. Ensure configuration mirrors standard parameters:
1. Open the Vercel dashboard and Import this repository.
2. Configure environment variables (`GEMINI_API_KEY`, `JWT_SECRET`) within Vercel's Settings tab.
3. Deploy is automatic! Vite handles single-page asset generation, and Express handles server routes in production fallback loops.

---

## 🔒 Security Best Practices Implemented
* **Rate-Limit Guard**: Custom telemetry middleware blocking active denial-of-service attempts by restricting ports to 120 calls per minute per IP.
* **NoSQL Injection / Path Terminations**: Scans all query, parameter, and payload keys starting with `$` or `.` and sanitizes malicious input blocks dynamically.
* **Squeaky-Clean CSP**: Configures Content-Security-Policy headers explicitly, denying frame-nested overlays, ensuring secure asset parsing, and keeping operations self-contained.
* **Hashed Credentials**: Leverages `bcryptjs` hashing with standard salt strength (10 rounds) to encrypt systems-registered passwords securely.
* **JWT Sealed Claims**: Restricts sensitive APIs (admin tables, chat histories, forensic clearings) using signed cryptographic tokens verified on every incoming route signature.

---

## 🎓 Project Deliverables Checklists
- [x] Full responsive dashboard gauges with simulated active threat parameters.
- [x] High-performance file scanner supporting Images, Audio, and Video files.
- [x] Live interactive webcam snapshot taking.
- [x] Robust user account authentication gates (Register, Guest Analylist & Administrative clearances).
- [x] Dynamic, printable forensic certificates featuring discrete hash markers and verified seals.
- [x] Social reputation handle checking and grounded fact checks.
- [x] Custom security rate-limits, CSP filters, and input sanitization layers.
