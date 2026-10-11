# 🚀 LeadPulse B2B — Sales Intelligence & Outbound Sequences Generator

> **Enterprise Full-Stack B2B Sales Intelligence Platform powered by Google Gemini 3.8 Flash SDK, React 19, TypeScript, and Express. Analyzes target company copy to extract core value propositions, detect critical operational pain points, and synthesize high-converting outbound email sequences (AIDA Hook + 3-Day Follow-Up).**

[![Author](https://img.shields.io/badge/Author-Christian_Battistoni-indigo.svg?logo=github)](mailto:christianbattistoni85@gmail.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Gemini_API-3.8_Flash-8e75ff.svg?logo=google)](https://ai.google.dev/)
[![Node.js / Express](https://img.shields.io/badge/Backend-Express_%2B_Vite-green.svg?logo=express)](https://expressjs.com/)
[![i18n](https://img.shields.io/badge/i18n-IT_%7C_EN_%7C_FR-orange.svg)](#-native-trilingual-architecture-it--en--fr)
[![License](https://img.shields.io/badge/License-Apache_2.0-lightgrey.svg)](LICENSE)

---

## 👨‍💻 Engineering Spotlight (For Hiring Managers & HR)

This project was engineered by **Christian Battistoni** ([christianbattistoni85@gmail.com](mailto:christianbattistoni85@gmail.com)) as a production-grade portfolio demonstration of modern **Full-Stack Software Engineering**, **AI/LLM System Architecture**, and **Product-Centric UX Design**.

### Key Architectural & Engineering Decisions:
1. **Secure Server-Side LLM Proxying**:
   - Zero client-side API key exposure. The frontend never imports `@google/genai` or accesses sensitive tokens.
   - All interactions route through `POST /api/generate` running on a Node.js Express server.
2. **Type-Safe Structured Output Schema**:
   - Enforces a deterministic JSON output contract using the official `@google/genai` TypeScript SDK (`Type.OBJECT`, `responseSchema`, `responseMimeType: 'application/json'`).
   - Guarantees strict output conformance without hallucinated markdown wrappers.
3. **Resilient Heuristic Failover System**:
   - If the remote Gemini API key encounters rate-limiting or quota depletion, the backend server automatically engages an intelligent contextual heuristic NLP engine. The UI remains resilient, operational, and responsive at all times.
4. **Native Trilingual Internationalization (i18n)**:
   - Full support for **Italian 🇮🇹**, **English 🇬🇧**, and **French 🇫🇷**.
   - Language synchronization cascades across UI components, LLM prompting parameters, localized test presets, and exportable deliverables.
5. **Privacy & Offline First (Zero Third-Party Trackers)**:
   - Session histories persist locally in encrypted client storage. No customer prospect data is sent to external storage.
   - Includes full offline detection and synthesized Web Audio feedback chimes with zero external audio assets.

---

## 📌 Table of Contents
- [Executive Overview](#-executive-overview)
- [Key Features](#-key-features)
- [Native Trilingual Architecture (IT / EN / FR)](#-native-trilingual-architecture-it--en--fr)
- [JSON Output Specifications](#-json-output-specifications)
- [Tech Stack](#-tech-stack)
- [Quickstart & Installation](#-quickstart--installation)
- [Environment Configuration (Public Repo Security)](#-environment-configuration-public-repo-security)
- [How to Publish to GitHub](#-how-to-publish-to-github)
- [Available Scripts](#-available-scripts)
- [Author & Contact](#-author--contact)
- [License](#-license)

---

## 💡 Executive Overview

Generic cold outreach in B2B Tech and SaaS delivers near-zero response rates. **LeadPulse B2B** solves this by analyzing raw text pasted from a target company’s website, landing page, or pitch deck to produce:

1. **Strategic Sales Intelligence Card (Left)**:
   - **Core Business Model**: High-level classification (SaaS, FinTech, Logistics, Marketplace, Cybersecurity, etc.).
   - **Value Proposition**: Exact problem solved and target buyer audience.
   - **Detected Pain Points**: 3 prioritized operational bottlenecks and friction points.

2. **High-Converting Outbound Sequences (Right)**:
   - **Email #1 — Hook AIDA (Day 1)**: Formatted via the *Attention, Interest, Desire, Action* framework, directly citing their value proposition (strict limit: **< 120 words**, friction-free CTA).
   - **Email #2 — Follow-up & Case Study (Day 4 / +3 days)**: Concrete case proof solving one of the detected pain points (strict limit: **< 80 words**).

---

## ✨ Key Features

- 🎯 **One-Click Target Intelligence**: Paste any target company copy or click one of the localized presets (FinTech, Logistics IoT, HR Tech, Cybersecurity).
- 📋 **Dual-Card Responsive UX**:
  - Independent **"Copy Text"** and **"Copy Subject"** buttons for every email.
  - Live word count validation pills (`words / max target`).
  - Dynamic variable preview toggle (renders your name, company, and recipient name).
  - Direct draft mailto trigger (`mailto:`).
- 📊 **Multi-Stage Progress Indicator**: Visual progression tracker with elapsed millisecond latency timing during text generation.
- 🗄️ **Side Drawer Session Archive**:
  - Local persistence of past company analyses.
  - Live fuzzy search across company names, industries, and email subjects.
  - Favorite/Star toggle (⭐️) and 1-click session restoration.
  - Bulk data exports in **JSON**, **CSV**, and formatted **Markdown (.md)**.
- ⚙️ **Sender Profile Customization**:
  - Configurable sender identity (name, company, value offering).
  - Target persona selection (*VP of Growth*, *COO*, *Head of Sales*, *CTO*, *Founder*).
  - Tone adaptation (Assertive Tech, Direct ROI, Consultative, Challenger).
  - Call to Action (CTA) styling.
- 🎨 **4 Custom Themes**:
  - **Dark Slate** (default)
  - **Midnight Navy** (deep space blue)
  - **Obsidian Pure** (pitch-black AMOLED)
  - **Clean Light** (minimal daylight)
- 🔔 **Synthesized Audio Chimes**: Lightweight Web Audio API frequency synthesis on copy and completion events.
- 💼 **Recruiter Showcase Modal**: Built-in interactive candidate sheet detailing engineering decisions, stack overview, and hiring contact.

---

## 🌐 Native Trilingual Architecture (IT / EN / FR)

The application provides first-class support for three European business languages:

| Language | UI Interface | LLM Prompts & Fallback | Localized Test Presets |
|---|---|---|---|
| **🇮🇹 Italiano** | Full Italian UI strings | Contextual Italian AIDA copy | PayMetrics Cloud (IT), FleetPulse AI (IT), etc. |
| **🇬🇧 English** | Full English UI strings | Contextual US/UK B2B AIDA copy | PayMetrics Cloud (EN), FleetPulse AI (EN), etc. |
| **🇫🇷 Français** | Full French UI strings | Contextual French B2B AIDA copy | PayMetrics Cloud (FR), FleetPulse AI (FR), etc. |

Switch languages dynamically in the header or in the settings modal.

---

## 📐 JSON Output Specifications

All responses from `/api/generate` adhere strictly to the following validated JSON schema:

```json
{
  "company_analysis": {
    "core_business": "Brief description of the target company's business model",
    "value_proposition": "The identified value proposition (problem solved and target audience)",
    "detected_pains": [
      "Operational or business pain point 1",
      "Operational or business pain point 2",
      "Operational or business pain point 3"
    ]
  },
  "email_campaign": {
    "email_1_hook": {
      "subject": "Catchy subject line (max 5 words), focused on ROI or core problem",
      "body": "Email based on AIDA framework (Attention, Interest, Desire, Action). Directly references their value proposition. Max 120 words. Low-friction CTA."
    },
    "email_2_followup": {
      "subject": "Re: Previous subject or variation on primary pain point",
      "body": "3-day follow-up email. Features a concrete case study or benchmark resolving one of the detected pains. Max 80 words."
    }
  }
}
```

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 19 (`react`, `react-dom`)
  - TypeScript 5.x (`strict: true`, clean modular design)
  - Tailwind CSS v4 (`@tailwindcss/vite` engine)
  - Lucide React (clean, lightweight iconography)
  - Web Audio API (zero external audio payloads)
- **Backend**:
  - Node.js & Express (`server.ts` entry point)
  - Google GenAI SDK (`@google/genai` v2)
  - Vite dev server middleware integration
  - `tsx` (TypeScript execute engine)

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Node.js** >= 18.x
- **npm** (or pnpm / yarn)
- A **Google Gemini API Key** (obtainable free of charge at [Google AI Studio](https://aistudio.google.com/))

### 1. Clone the repository
```bash
git clone https://github.com/christianbattistoni/leadpulse-b2b-ai.git
cd leadpulse-b2b-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables (Public Repo Safe)
Copy the example template:
```bash
cp .env.example .env
```

Edit your `.env` file and insert your API key:
```env
# Google Gemini API Key - Keep this private!
# NEVER commit this file to GitHub (already ignored by .gitignore)
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=3000
```

### 4. Start the development server
```bash
npm run dev
```

Open your browser at:  
👉 **`http://localhost:3000`**

---

## 🔒 Environment Configuration (Public Repo Security)

> ⚠️ **Public Repository Safeguard**:
> This repository is configured to be public-safe:
> - **No real API keys are committed anywhere in the codebase.**
> - The `.gitignore` file includes `.env*` to strictly prevent local credentials from ever being pushed to GitHub.
> - The server reads keys exclusively from server-side environment variables (`process.env.GEMINI_API_KEY`).

---

## 📤 How to Publish to GitHub

You can publish this project to GitHub using either of the following methods:

### Method A: Directly from Google AI Studio UI
1. Look at the top navigation bar of Google AI Studio.
2. Click on the **GitHub** icon / button (**"Export to GitHub"** or **"Push to GitHub"**).
3. Authenticate with your GitHub account when prompted.
4. Select **"Create a new repository"**, name it (e.g. `leadpulse-b2b-ai`), choose **Public**, and confirm. AI Studio will automatically push the clean codebase!

### Method B: Via Terminal / Git CLI
```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Stage all files (sensitive files are automatically skipped by .gitignore)
git add .

# 3. Commit your changes
git commit -m "feat: complete LeadPulse B2B sales intelligence app with i18n support"

# 4. Link your remote GitHub repository
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/leadpulse-b2b-ai.git

# 5. Push to GitHub
git push -u origin main
```

---

## 📜 Available Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Runs the full-stack server (Express + Vite middlewares) on port 3000 |
| `npm run build` | Compiles client assets for production into `/dist` |
| `npm start` | Launches the production server with `tsx server.ts` |
| `npm run lint` | Performs strict TypeScript type checks (`tsc --noEmit`) |
| `npm run clean` | Cleans up the `/dist` directory |

---

## 👤 Author & Contact

**Christian Battistoni**  
*Senior Full-Stack Software Engineer & AI Solutions Architect*  
📧 **Email:** [christianbattistoni85@gmail.com](mailto:christianbattistoni85@gmail.com)  
💼 **Portfolio & Recruiter Inquiries:** Available for full-time senior / lead engineering roles and contract AI engineering projects.

---

## 📄 License

Licensed under the **Apache-2.0 License**. See [LICENSE](LICENSE) for details.
