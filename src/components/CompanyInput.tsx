import React, { useRef, useEffect } from 'react';
import {
  Send,
  Building2,
  Trash2,
  Sparkles,
  Target,
  Layers,
  FileText,
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
}

export const CompanyInput: React.FC<CompanyInputProps> = ({
  inputText,
  onInputChange,
  onGenerate,
  isGenerating,
  settings,
  onSelectPreset,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = TRANSLATIONS[settings.locale || 'it'];
  const activePresets = PRESET_COMPANIES_BY_LOCALE[settings.locale || 'it'] || PRESET_COMPANIES_BY_LOCALE.it;

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
              onClick={() => onSelectPreset(preset.id)}
              disabled={isGenerating}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/90 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-200 border border-slate-700/60 hover:border-indigo-500/50 transition-all font-medium whitespace-nowrap active:scale-95 cursor-pointer"
              title={preset.shortDesc}
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          disabled={isGenerating}
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
              onClick={() => onInputChange('')}
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
            disabled={!isValid || isGenerating}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 ${
              isValid && !isGenerating
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
