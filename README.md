# 🚀 LeadPulse B2B (OutboundPulse) — Sales Intelligence & Outbound Sequences Generator

> **Enterprise Full-Stack B2B Sales Intelligence Platform powered by Google Gemini 3.8 Flash SDK, React 19, TypeScript, and Express. Analyzes target company copy to extract core value propositions, detect critical operational pain points, and synthesize high-converting outbound email sequences (AIDA Hook + 3-Day Follow-Up). Features high-availability multi-model failover with Cerebras Cloud (Llama 3.3 70B) and xAI Grok (grok-2).**

[![Live Demo](https://img.shields.io/badge/Live_Demo-outboundpulse.ai.studio-cyan.svg?logo=google-chrome)](https://outboundpulse.ai.studio)
[![Author](https://img.shields.io/badge/Author-Christian_Battistoni-indigo.svg?logo=github)](mailto:christian.battistoni.eu@gmail.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Gemini_API-3.8_Flash-8e75ff.svg?logo=google)](https://ai.google.dev/)
[![Cerebras Fallback](https://img.shields.io/badge/Fallback-Cerebras_Llama_3.3_70B-purple.svg)](https://cloud.cerebras.ai)
[![Grok Fallback](https://img.shields.io/badge/Fallback-xAI_Grok-blue.svg)](https://x.ai)
[![i18n](https://img.shields.io/badge/i18n-IT_%7C_EN_%7C_FR-orange.svg)](#-native-trilingual-architecture-it--en--fr)
[![License](https://img.shields.io/badge/License-Apache_2.0-lightgrey.svg)](LICENSE)

---

## 🌐 Live Demo & Interactive Testing

Test the live production application immediately in your browser:  
👉 **[https://outboundpulse.ai.studio](https://outboundpulse.ai.studio)**

---

## 💼 Sales Manager, Business Developer & AI Orchestrator Profile (For Recruiters & Hiring Teams)

This project was conceived, orchestrated, and built end-to-end by **Christian Battistoni** ([christian.battistoni.eu@gmail.com](mailto:christian.battistoni.eu@gmail.com)).

Christian is **not a traditional software developer or theoretical programmer**: his core professional identity is as a **Sales Manager, Business Developer, and Project Manager** who leverages **Generative AI as a force multiplier** to expand commercial business opportunities, accelerate revenue, and optimize operational efficiency.

Through **Vibe Coding** and **AI Orchestration**, Christian directs and coordinates cutting-edge LLMs (Google Gemini 3.8 Flash, xAI Grok, Cerebras Llama 3.3 70B) to rapidly conceptualize, prototype, and ship complete enterprise SaaS solutions that solve real business bottlenecks in record time.

### Core Value & Competencies Demonstrated:
1. **Sales Management & Business Development**:
   - Deep commercial acumen in B2B Tech and SaaS: market positioning, value proposition mapping, qualification criteria, and high-converting cold outbound strategy (AIDA framework).
2. **Project Management & Operational Scaling**:
   - Streamlining end-to-end delivery pipelines, removing administrative friction, and using AI automations to maximize team efficiency without inflating headcount.
3. **AI Orchestration & Multi-Model High Availability**:
   - Architectural mastery in coordinating multiple AI engines: Google Gemini 3.8 Flash as primary, with automatic failover to **Cerebras Cloud** (ultra-fast Llama 3.3 70B) and **xAI Grok** (grok-2), backed by a deterministic NLP heuristic engine so the platform never fails.
4. **Vibe Coding & Rapid Prototyping**:
   - Ability to turn high-level business briefs into production-grade web applications with trilingual internationalization (IT, EN, FR), responsive dual-card UX, local privacy encryption, and zero bloatware.

---

## 📌 Table of Contents
- [Executive Overview](#-executive-overview)
- [Multi-Model AI Architecture & Failover](#-multi-model-ai-architecture--failover)
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

Generic cold outreach in B2B Tech and SaaS delivers near-zero response rates. **LeadPulse B2B (OutboundPulse)** solves this by analyzing raw text pasted from a target company’s website, landing page, or pitch deck to produce:

1. **Strategic Sales Intelligence Card (Left)**:
   - **Core Business Model**: High-level classification (SaaS, FinTech, Logistics, Marketplace, Cybersecurity, etc.).
   - **Value Proposition**: Exact problem solved and target buyer audience.
   - **Detected Pain Points**: 3 prioritized operational bottlenecks and friction points.

2. **High-Converting Outbound Sequences (Right)**:
   - **Email #1 — Hook AIDA (Day 1)**: Formatted via the *Attention, Interest, Desire, Action* framework, directly citing their value proposition (strict limit: **< 120 words**, friction-free CTA).
   - **Email #2 — Follow-up & Case Study (Day 4 / +3 days)**: Concrete case proof solving one of the detected pain points (strict limit: **< 80 words**).

---

## ⚡ Multi-Model AI Architecture & Failover

To guarantee 100% uptime and resilience against rate limits or depleted credit quotas, the platform incorporates a tri-tiered AI failover cascade:

| Level | Engine | Model | Role |
|---|---|---|---|
| **Tier 1 (Primary)** | Google Gemini | `gemini-3.8-flash` | Ultra-fast multimodal structured JSON analysis |
| **Tier 2 (Fallback 1)** | Cerebras Cloud | `llama-3.3-70b` | Ultra-high inference throughput (2000+ tokens/sec) |
| **Tier 3 (Fallback 2)** | xAI Grok | `grok-2-latest` | Cutting-edge frontier reasoning & failover |
| **Tier 4 (Safety Net)** | Resilient NLP Engine | Deterministic B2B Engine | Zero-downtime heuristic generation if third-party APIs are unreachable |

Users can input and verify their **Cerebras** and **Grok** API keys directly in the application's **Settings Modal**, or set them in `.env`.

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
- ⚙️ **Sender Profile & AI Customization**:
  - Configurable sender identity (name, company, value offering).
  - Target persona selection (*VP of Growth*, *COO*, *Head of Sales*, *CTO*, *Founder*).
  - Tone adaptation (Assertive Tech, Direct ROI, Consultative, Challenger).
  - Model preference selector (Auto Failover, Force Gemini, Force Cerebras, Force Grok).
  - Live API key verification with instant feedback.
- 🎨 **4 Custom Themes**:
  - **Dark Slate** (default)
  - **Midnight Navy** (deep space blue)
  - **Obsidian Pure** (pitch-black AMOLED)
  - **Clean Light** (minimal daylight)
- 🔔 **Synthesized Audio Chimes**: Lightweight Web Audio API frequency synthesis on copy and completion events.
- 💼 **Recruiter Showcase Modal**: Built-in candidate sheet detailing commercial profile, engineering decisions, and direct contact.

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
- **Backend & AI Orchestration**:
  - Node.js & Express (`server.ts` entry point)
  - Google GenAI SDK (`@google/genai` v2)
  - Cerebras Cloud REST Client (`llama-3.3-70b`)
  - xAI Grok REST Client (`grok-2-latest`)
  - Vite dev server middleware integration
  - `tsx` (TypeScript execute engine)

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Node.js** >= 18.x
- **npm** (or pnpm / yarn)
- A **Google Gemini API Key** (obtainable free of charge at [Google AI Studio](https://aistudio.google.com/))
- *(Optional)* A **Cerebras Cloud API Key** ([cloud.cerebras.ai](https://cloud.cerebras.ai)) or **Grok API Key** ([console.x.ai](https://console.x.ai)) for fallback failover.

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

Edit your `.env` file:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
CEREBRAS_API_KEY="" # Optional fallback key
GROK_API_KEY=""     # Optional fallback key
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
> - The server reads keys exclusively from environment variables or client-controlled localStorage headers with zero persistence to disk.

---

## 📤 How to Publish to GitHub

### Method A: Directly from Google AI Studio UI
1. Look at the top navigation bar of Google AI Studio.
2. Click on the **GitHub** icon / button (**"Export to GitHub"** or **"Push to GitHub"**).
3. Authenticate with your GitHub account when prompted.
4. Select **"Create a new repository"**, name it (e.g. `leadpulse-b2b-ai`), choose **Public**, and confirm. AI Studio will automatically push the clean codebase!

### Method B: Via Terminal / Git CLI
```bash
# 1. Initialize git
git init

# 2. Stage all files (sensitive files are automatically skipped by .gitignore)
git add .

# 3. Commit changes
git commit -m "feat: complete LeadPulse B2B sales intelligence app with Cerebras and Grok failover"

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
*Sales Manager • Business Developer • Project Manager • AI Orchestrator & Vibe Coder*  
📧 **Email:** [christian.battistoni.eu@gmail.com](mailto:christian.battistoni.eu@gmail.com)  
🌐 **Live App Demo:** [https://outboundpulse.ai.studio](https://outboundpulse.ai.studio)  
💼 **Opportunities:** Open to leadership and strategic roles as Sales Manager, Business Development Director, Head of Growth, AI Operations Manager, and AI Product Orchestrator.

---

## 📄 License

Licensed under the **Apache-2.0 License**. See [LICENSE](LICENSE) for details.
