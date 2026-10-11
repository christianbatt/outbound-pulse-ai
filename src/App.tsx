import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Building2,
  ShieldCheck,
  Clock,
  WifiOff,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import {
  GeneratedCampaignData,
  GenerationMetrics,
  SessionRecord,
  UserSettings,
} from './types';
import { Header } from './components/Header';
import { CompanyInput } from './components/CompanyInput';
import { ProgressBar } from './components/ProgressBar';
import { AnalysisCard } from './components/AnalysisCard';
import { EmailSequenceCard } from './components/EmailSequenceCard';
import { SessionsDrawer } from './components/SessionsDrawer';
import { SettingsModal } from './components/SettingsModal';
import { RecruiterModal } from './components/RecruiterModal';
import { ToastContainer, ToastItem } from './components/Toast';
import { PRESET_COMPANIES_BY_LOCALE } from './utils/presets';
import {
  loadSettings,
  saveSettings,
  loadSessions,
  saveSession,
  deleteSession,
  toggleFavoriteSession,
  clearAllSessions,
  exportCampaignAsMarkdown,
  downloadFile,
  extractCompanyName,
} from './utils/storage';
import { playSuccessChime } from './utils/audio';
import { TRANSLATIONS } from './utils/i18n';

interface ApiErrorState {
  message: string;
  code?: string;
  timestamp: string;
}

export default function App() {
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [sessions, setSessions] = useState<SessionRecord[]>(loadSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const [inputText, setInputText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [apiError, setApiError] = useState<ApiErrorState | null>(null);
  const [currentCampaign, setCurrentCampaign] = useState<GeneratedCampaignData | null>(null);
  const [currentMetrics, setCurrentMetrics] = useState<GenerationMetrics | null>(null);
  const [currentCompanyName, setCurrentCompanyName] = useState<string>('');

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const t = TRANSLATIONS[settings.locale || 'it'];

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addToast(settings.locale === 'it' ? 'Connessione ripristinata' : settings.locale === 'fr' ? 'Connexion rétablie' : 'Connection restored', 'info');
    };
    const handleOffline = () => {
      setIsOnline(false);
      addToast(t.offlineNotice, 'info');
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [t.offlineNotice, settings.locale]);

  // Update HTML document class for theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    if (settings.theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.add('dark');
    }
  }, [settings.theme]);

  // Toast helper
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateSettings = (newPartial: Partial<UserSettings>) => {
    const updated = { ...settings, ...newPartial };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleSelectPreset = (presetId: string) => {
    const presetsList = PRESET_COMPANIES_BY_LOCALE[settings.locale || 'it'] || PRESET_COMPANIES_BY_LOCALE.it;
    const found = presetsList.find((p) => p.id === presetId);
    if (found) {
      setInputText(found.content);
      setApiError(null);
      addToast(`Preset: ${found.title}`, 'info');
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      addToast(settings.locale === 'it' ? 'Inserisci il testo aziendale per continuare' : 'Please provide company text', 'error');
      return;
    }

    if (!isOnline) {
      addToast(t.offlineNotice, 'error');
      return;
    }

    setIsGenerating(true);
    setApiError(null);
    const startMs = Date.now();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyText: inputText,
          senderName: settings.senderName,
          senderCompany: settings.senderCompany,
          targetRole: settings.targetRole,
          tone: settings.tone,
          ctaStyle: settings.ctaStyle,
          language: settings.language !== 'auto' ? settings.language : settings.locale,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        setApiError({
          message: json.error || 'Errore durante la chiamata API di generazione.',
          code: json.errorCode || String(response.status),
          timestamp: new Date().toLocaleTimeString(),
        });
        throw new Error(json.error || 'Errore durante la chiamata API di generazione.');
      }

      const campaignData: GeneratedCampaignData = json.data;
      const metrics: GenerationMetrics = json.metrics || {
        latencyMs: Date.now() - startMs,
        model: 'gemini-3.8-flash',
        completedAt: new Date().toISOString(),
      };

      const extractedName = extractCompanyName(inputText, campaignData);
      setCurrentCompanyName(extractedName);
      setCurrentCampaign(campaignData);
      setCurrentMetrics(metrics);
      setApiError(null);

      // Auto-save session
      if (settings.autoSave) {
        const newSession: SessionRecord = {
          id: Date.now().toString(),
          companyName: extractedName,
          inputText,
          data: campaignData,
          metrics,
          createdAt: Date.now(),
        };
        const updatedSessions = saveSession(newSession);
        setSessions(updatedSessions);
        setActiveSessionId(newSession.id);
      }

      if (settings.soundEnabled) {
        playSuccessChime();
      }

      addToast(`${t.completedStatus} (${metrics.latencyMs}ms)`, 'success');
    } catch (err: any) {
      console.error('Generazione fallita:', err);
      addToast(err?.message || 'Errore di generazione.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectSession = (session: SessionRecord) => {
    setActiveSessionId(session.id);
    setInputText(session.inputText);
    setCurrentCampaign(session.data);
    setCurrentMetrics(session.metrics);
    setCurrentCompanyName(session.companyName);
    setApiError(null);
    addToast(`Loaded: ${session.companyName}`, 'info');
  };

  const handleDeleteSession = (id: string) => {
    const updated = deleteSession(id);
    setSessions(updated);
    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
    addToast('Session removed', 'info');
  };

  const handleToggleFavorite = (id: string) => {
    const updated = toggleFavoriteSession(id);
    setSessions(updated);
  };

  const handleClearAllSessions = () => {
    clearAllSessions();
    setSessions([]);
    setActiveSessionId(null);
  };

  const handleExportMarkdown = () => {
    if (!currentCampaign) return;
    const sessionObj: SessionRecord = {
      id: activeSessionId || 'export',
      companyName: currentCompanyName || 'Target Company',
      inputText,
      data: currentCampaign,
      metrics: currentMetrics || {
        latencyMs: 0,
        model: 'gemini-3.8-flash',
        completedAt: new Date().toISOString(),
      },
      createdAt: Date.now(),
    };
    const md = exportCampaignAsMarkdown(sessionObj);
    const date = new Date().toISOString().slice(0, 10);
    downloadFile(md, `leadpulse_${currentCompanyName.replace(/\s+/g, '_')}_${date}.md`, 'text/markdown');
    addToast('Markdown export downloaded', 'success');
  };

  // Determine root theme container background
  const getThemeBackground = () => {
    switch (settings.theme) {
      case 'light':
        return 'bg-slate-100 text-slate-900';
      case 'midnight':
        return 'bg-[#090d16] text-slate-100';
      case 'obsidian':
        return 'bg-black text-slate-100';
      case 'dark':
      default:
        return 'bg-slate-950 text-slate-100';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${getThemeBackground()}`}>
      {/* App Header */}
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenRecruiterModal={() => setIsRecruiterModalOpen(true)}
        sessionCount={sessions.length}
        isGenerating={isGenerating}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Offline Alert Bar */}
        {!isOnline && (
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium animate-fadeIn">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t.offlineNotice}</span>
            </div>
            <span className="font-mono text-[11px] text-amber-400/80">Offline</span>
          </div>
        )}

        {/* Hero Section / Brief */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.badgeAi}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {t.heroDesc}
          </p>
        </div>

        {/* Input Section */}
        <section aria-label="Target Company Input">
          <CompanyInput
            inputText={inputText}
            onInputChange={(txt) => {
              setInputText(txt);
              if (apiError) setApiError(null);
            }}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            settings={settings}
            onSelectPreset={handleSelectPreset}
          />
        </section>

        {/* Loading Progress Bar */}
        {isGenerating && (
          <section aria-label="Processing Progress">
            <ProgressBar isGenerating={isGenerating} locale={settings.locale} />
          </section>
        )}

        {/* API Error Diagnostic Card */}
        {apiError && !isGenerating && (
          <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-rose-100 shadow-xl backdrop-blur-sm animate-fadeIn space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      Risposta API Gemini: {apiError.code || 'Errore di Rete / Quota'}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-900/60 text-rose-300 font-mono">
                      {apiError.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-rose-200 mt-1 leading-relaxed">
                    {apiError.message}
                  </p>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Riprova</span>
              </button>
            </div>

            {apiError.code === 'CREDITS_EXHAUSTED' && (
              <div className="mt-2 pt-2 border-t border-rose-900/50 flex flex-wrap items-center justify-between gap-2 text-xs text-rose-300">
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Puoi gestire i crediti prepagati o il piano del tuo account su Google AI Studio:
                </span>
                <a
                  href="https://ai.studio/projects"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-white flex items-center gap-1 font-semibold"
                >
                  <span>ai.studio/projects</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Request Status Indicator & Metrics */}
        {currentMetrics && !isGenerating && !apiError && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-white">
                {t.completedStatus}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">
                {currentCompanyName || 'Target Company'}
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {t.latencyLabel} <strong className="text-indigo-400">{currentMetrics.latencyMs}ms</strong>
              </span>
              <span>Modello: {currentMetrics.model}</span>
              <span className="hidden sm:inline text-emerald-400 font-medium">{t.savedLocal}</span>
            </div>
          </div>
        )}

        {/* Results Grid: Left Card (Analysis) & Right Card (Email Sequences) */}
        {currentCampaign && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch animate-fadeIn">
            {/* Left Card: Company Analysis & Pain Points */}
            <div className="flex">
              <AnalysisCard
                analysis={currentCampaign.company_analysis}
                metrics={currentMetrics || undefined}
                companyName={currentCompanyName}
                soundEnabled={settings.soundEnabled}
                locale={settings.locale}
                onToast={addToast}
              />
            </div>

            {/* Right Card: 2 Outbound Emails with 'Copia Testo' for each */}
            <div className="flex">
              <EmailSequenceCard
                campaign={currentCampaign.email_campaign}
                settings={settings}
                soundEnabled={settings.soundEnabled}
                onToast={addToast}
                onExportMarkdown={handleExportMarkdown}
              />
            </div>
          </section>
        )}

        {/* Empty State Showcase when no campaign generated yet */}
        {!currentCampaign && !isGenerating && !apiError && (
          <div className="p-8 sm:p-12 rounded-2xl border border-slate-800/80 bg-slate-900/40 text-center max-w-2xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {settings.locale === 'it' ? 'Nessuna analisi attiva al momento' : settings.locale === 'fr' ? 'Aucune analyse active pour le moment' : 'No active campaign analysis'}
            </h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              {settings.locale === 'it' 
                ? 'Incolla il testo del sito web della tua azienda target oppure seleziona uno dei preset di prova in alto per generare istantaneamente la Sales Intelligence e le email di vendita.'
                : settings.locale === 'fr'
                ? 'Collez le texte du site web de votre entreprise cible ou sélectionnez un exemple en haut pour générer la Sales Intelligence et vos e-mails de prospection.'
                : 'Paste your target company website description or pick one of the sample presets above to generate instant sales intelligence and email sequences.'}
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              {(PRESET_COMPANIES_BY_LOCALE[settings.locale || 'it'] || PRESET_COMPANIES_BY_LOCALE.it).slice(0, 2).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/60 transition-colors cursor-pointer"
                >
                  {p.title} ({p.category})
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">LeadPulse B2B</span>
            <span>• Sales Intelligence & Outbound Sequences</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Local Encryption & Zero Tracker
            </span>
            <span>🇮🇹 / 🇬🇧 / 🇫🇷 Multi-language Support</span>
            <span>Gemini 3.8 Flash SDK</span>
          </div>
        </div>
      </footer>

      {/* Session Drawer (Side Panel) */}
      <SessionsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        locale={settings.locale}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onToggleFavorite={handleToggleFavorite}
        onClearAll={handleClearAllSessions}
        onToast={addToast}
      />

      {/* User Profile & Customization Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings);
          saveSettings(newSettings);
        }}
        onToast={addToast}
      />

      {/* Recruiter & HR Candidate Showcase Modal */}
      <RecruiterModal
        isOpen={isRecruiterModalOpen}
        onClose={() => setIsRecruiterModalOpen(false)}
        locale={settings.locale}
      />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
