import React, { useRef, useEffect, useState } from 'react';
import {
  Send,
  Building2,
  Trash2,
  Sparkles,
  Target,
  Layers,
  FileText,
  Cpu,
  Key,
  Globe,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Search,
} from 'lucide-react';
import { PRESET_COMPANIES_BY_LOCALE } from '../utils/presets';
import { UserSettings } from '../types';
import { TRANSLATIONS } from '../utils/i18n';

interface CompanyInputProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  settings: UserSettings;
  onSelectPreset: (presetId: string) => void;
  onOpenSettings?: () => void;
  onScrapeSuccess?: (siteTitle: string, url: string) => void;
}

export const CompanyInput: React.FC<CompanyInputProps> = ({
  inputText,
  onInputChange,
  onGenerate,
  isGenerating,
  settings,
  onSelectPreset,
  onOpenSettings,
  onScrapeSuccess,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = TRANSLATIONS[settings.locale || 'it'];
  const activePresets = PRESET_COMPANIES_BY_LOCALE[settings.locale || 'it'] || PRESET_COMPANIES_BY_LOCALE.it;

  // URL Scraping state
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [scrapedDomain, setScrapedDomain] = useState<string | null>(null);

  // Auto-resize or focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (!isGenerating && inputText.trim().length > 10) {
          e.preventDefault();
          onGenerate();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputText, isGenerating, onGenerate]);

  const handleScrapeWebsite = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetUrl.trim() || isScraping) return;

    setIsScraping(true);
    setScrapeError(null);

    try {
      const resp = await fetch('/api/scrape-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.error || 'Impossibile estrarre i dati da questo sito.');
      }

      // Populate textarea with clean scraped context
      onInputChange(data.text);
      setScrapedDomain(data.title || targetUrl);
      if (onScrapeSuccess) {
        onScrapeSuccess(data.title, data.url);
      }
    } catch (err: any) {
      console.error('Scrape error:', err);
      setScrapeError(err.message || 'Errore di connessione al sito.');
    } finally {
      setIsScraping(false);
    }
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;
  const isValid = inputText.trim().length >= 20;

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800/90 rounded-2xl p-5 shadow-xl backdrop-blur-sm transition-all hover:border-slate-700/80">
      {/* Top bar with Target context & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-sm text-slate-200 font-semibold">
          <Building2 className="w-4 h-4 text-indigo-400" />
          <span>{t.inputTitle}</span>
          <span className="text-xs font-normal text-slate-400">
            {t.inputSubtitle}
          </span>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            {t.presetsLabel}
          </span>
          {activePresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setScrapedDomain(null);
                setScrapeError(null);
                onSelectPreset(preset.id);
              }}
              disabled={isGenerating || isScraping}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/90 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-200 border border-slate-700/60 hover:border-indigo-500/50 transition-all font-medium whitespace-nowrap active:scale-95 cursor-pointer"
              title={preset.shortDesc}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* NEW: Dedicated Direct Website URL Scraping Bar */}
      <div className="mb-4 p-3 rounded-xl bg-slate-950/80 border border-indigo-500/30 shadow-inner">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <label className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.urlInputLabel}</span>
          </label>
          <span className="text-[11px] text-cyan-400/90 flex items-center gap-1">
            <Search className="w-3 h-3" />
            <span>{t.webGroundingBadge}</span>
          </span>
        </div>

        <form onSubmit={handleScrapeWebsite} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => {
                setTargetUrl(e.target.value);
                setScrapeError(null);
              }}
              placeholder={t.urlInputPlaceholder}
              disabled={isGenerating || isScraping}
              className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700/80 focus:border-indigo-500 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 font-mono transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!targetUrl.trim() || isScraping || isGenerating}
            className={`px-4 py-2 text-xs rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              targetUrl.trim() && !isScraping && !isGenerating
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-md shadow-indigo-600/20 active:scale-98'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            {isScraping ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.urlScrapingBtn}</span>
              </>
            ) : (
              <>
                <Globe className="w-3.5 h-3.5" />
                <span>{t.urlScrapeBtn}</span>
                <ArrowRight className="w-3 h-3" />
              </>
            )}
          </button>
        </form>

        {/* Feedback Messages */}
        {scrapedDomain && !scrapeError && (
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {t.urlScrapedSuccess} <strong>{scrapedDomain}</strong>
            </span>
          </div>
        )}

        {scrapeError && (
          <div className="mt-2 text-[11px] text-rose-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>{scrapeError}</span>
          </div>
        )}
      </div>

      {/* AI Multi-Model Architecture & Failover Notice */}
      <div className="mb-4 px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Core: Google Gemini 3.8 Flash + Search Grounding</span>
          </div>
          <span className="text-slate-500 text-[10px] hidden sm:inline">➜</span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px]" title="Fallback automatico su Cerebras Cloud">
            <span>⚡ Fallback #1: Cerebras Cloud (Llama 3.3 70B)</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px]" title="Fallback secondario su xAI Grok">
            <span>🚀 Fallback #2: xAI Grok (grok-2)</span>
          </div>
        </div>

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="text-[11px] font-medium text-slate-400 hover:text-white flex items-center gap-1 transition-colors self-end sm:self-auto cursor-pointer"
          >
            <Key className="w-3 h-3 text-amber-400" />
            <span>Configura Chiavi Fallback</span>
          </button>
        )}
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={isGenerating || isScraping}
          placeholder={t.inputPlaceholder}
          rows={5}
          className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans text-sm resize-y leading-relaxed"
        />

        {/* Bottom meta stats inside textarea wrapper */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-2">
          <div className="flex items-center gap-3">
            <span>
              {wordCount} {t.wordsLabel} • {charCount} {t.charsLabel}
            </span>
            {!isValid && inputText.trim().length > 0 && (
              <span className="text-amber-400/90 text-[11px]">
                {t.minCharsWarning}
              </span>
            )}
          </div>

          {inputText && !isGenerating && (
            <button
              onClick={() => {
                onInputChange('');
                setScrapedDomain(null);
                setScrapeError(null);
              }}
              className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors text-xs cursor-pointer"
              title={t.clearBtn}
            >
              <Trash2 className="w-3 h-3" />
              <span>{t.clearBtn}</span>
            </button>
          )}
        </div>
      </div>

      {/* Target Strategy Preferences Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
            <Target className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">{t.targetRoleLabel}</span>
            <span className="font-medium text-slate-200">{settings.targetRole}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">{t.toneLabel}</span>
            <span className="font-medium text-slate-200">{settings.tone}</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 hidden lg:flex">
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">{t.ctaLabel}</span>
            <span className="font-medium text-slate-200 truncate max-w-[200px]">{settings.ctaStyle}</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500 hidden sm:inline-block font-mono">
            Ctrl + Enter
          </span>
          <button
            onClick={onGenerate}
            disabled={!isValid || isGenerating || isScraping}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 ${
              isValid && !isGenerating && !isScraping
                ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white shadow-indigo-500/25 cursor-pointer ring-1 ring-indigo-400/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.generatingBtn}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t.generateBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
