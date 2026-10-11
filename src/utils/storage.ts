import { GeneratedCampaignData, SessionRecord, UserSettings } from '../types';

const STORAGE_KEY_SESSIONS = 'leadpulse_b2b_sessions_v1';
const STORAGE_KEY_SETTINGS = 'leadpulse_b2b_settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  senderName: 'Marco Rossi',
  senderCompany: 'GrowthMatrix Solutions',
  targetRole: 'VP of Growth & Operations',
  tone: 'Assertivo Tech & Diretto ROI',
  ctaStyle: 'Breve confronto conoscitivo di 10 minuti',
  language: 'auto',
  locale: 'it',
  theme: 'dark',
  soundEnabled: true,
  autoSave: true,
  recipientName: 'Alex',
};

// --- Settings Management ---
export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('Errore lettura impostazioni:', err);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Errore salvataggio impostazioni:', err);
  }
}

// --- Sessions Management ---
export function loadSessions(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Errore caricamento sessioni:', err);
    return [];
  }
}

export function saveSession(session: SessionRecord): SessionRecord[] {
  try {
    const current = loadSessions();
    // Prepend new session or update existing
    const index = current.findIndex((s) => s.id === session.id);
    let updated: SessionRecord[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = session;
    } else {
      updated = [session, ...current];
    }
    // Cap to 50 sessions for high performance
    const capped = updated.slice(0, 50);
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(capped));
    return capped;
  } catch (err) {
    console.error('Errore salvataggio sessione:', err);
    return [];
  }
}

export function deleteSession(id: string): SessionRecord[] {
  try {
    const current = loadSessions();
    const updated = current.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Errore rimozione sessione:', err);
    return [];
  }
}

export function toggleFavoriteSession(id: string): SessionRecord[] {
  try {
    const current = loadSessions();
    const updated = current.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s));
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Errore aggiornamento preferito:', err);
    return [];
  }
}

export function clearAllSessions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_SESSIONS);
  } catch (err) {
    console.error('Errore cancellazione archivio:', err);
  }
}

// --- Export Utilities ---
export function exportCampaignAsMarkdown(session: SessionRecord): string {
  const { data, companyName, metrics, createdAt } = session;
  const dateStr = new Date(createdAt).toLocaleString();
  return `# LeadPulse B2B Intelligence Report: ${companyName || 'Target Company'}
*Generato il: ${dateStr} | Modello: ${metrics.model} | Latenza: ${metrics.latencyMs}ms*

---

## 🏢 Analisi Aziendale Target
- **Core Business:** ${data.company_analysis.core_business}
- **Value Proposition:** ${data.company_analysis.value_proposition}

### ⚠️ Pain Points Rilevati:
${data.company_analysis.detected_pains.map((p, i) => `${i + 1}. ${p}`).join('\n')}

---

## 📧 Sequenza Outbound Personalizzata

### Email 1: Hook AIDA (Giorno 1)
**Oggetto:** ${data.email_campaign.email_1_hook.subject}

\`\`\`
${data.email_campaign.email_1_hook.body}
\`\`\`

---

### Email 2: Follow-up & Caso d'uso (Giorno 4 / +3gg)
**Oggetto:** ${data.email_campaign.email_2_followup.subject}

\`\`\`
${data.email_campaign.email_2_followup.body}
\`\`\`

---
*Report esportato con successo da LeadPulse AI.*
`;
}

export function downloadFile(content: string, filename: string, type = 'text/plain'): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAllSessionsAsJSON(sessions: SessionRecord[]): void {
  const json = JSON.stringify(sessions, null, 2);
  const date = new Date().toISOString().slice(0, 10);
  downloadFile(json, `leadpulse_sessions_${date}.json`, 'application/json');
}

export function exportAllSessionsAsCSV(sessions: SessionRecord[]): void {
  const header = ['ID', 'Azienda', 'Core Business', 'Value Proposition', 'Oggetto Email 1', 'Oggetto Email 2', 'Data Creazione'];
  const rows = sessions.map((s) => [
    `"${s.id}"`,
    `"${(s.companyName || '').replace(/"/g, '""')}"`,
    `"${(s.data.company_analysis.core_business || '').replace(/"/g, '""')}"`,
    `"${(s.data.company_analysis.value_proposition || '').replace(/"/g, '""')}"`,
    `"${(s.data.email_campaign.email_1_hook.subject || '').replace(/"/g, '""')}"`,
    `"${(s.data.email_campaign.email_2_followup.subject || '').replace(/"/g, '""')}"`,
    `"${new Date(s.createdAt).toISOString()}"`,
  ]);
  const csvContent = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const date = new Date().toISOString().slice(0, 10);
  downloadFile(csvContent, `leadpulse_outbound_${date}.csv`, 'text/csv');
}

export function extractCompanyName(text: string, analysis?: GeneratedCampaignData): string {
  if (analysis?.company_analysis.core_business) {
    const match = text.match(/(?:Azienda|Società|Company|Brand|Startup|Piattaforma)\s*[:\-]?\s*([A-Za-z0-9\s\-]{2,30})/i);
    if (match && match[1]) return match[1].trim();
  }
  // First line or snippet
  const firstLine = text.trim().split('\n')[0].replace(/^#+\s*/, '').trim();
  if (firstLine.length > 0 && firstLine.length <= 40) return firstLine;
  return 'Azienda Target ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
