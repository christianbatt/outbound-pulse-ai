import React, { useState } from 'react';
import {
  Building2,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  Target,
  Sparkles,
} from 'lucide-react';
import { CompanyAnalysis, GenerationMetrics } from '../types';
import { playCopyChime } from '../utils/audio';
import { Locale, TRANSLATIONS } from '../utils/i18n';
import { copyToClipboard } from '../utils/clipboard';

interface AnalysisCardProps {
  analysis: CompanyAnalysis;
  metrics?: GenerationMetrics;
  companyName?: string;
  soundEnabled?: boolean;
  locale?: Locale;
  onToast: (msg: string) => void;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({
  analysis,
  metrics,
  companyName,
  soundEnabled,
  locale = 'it',
  onToast,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const t = TRANSLATIONS[locale];

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedSection(label);
      if (soundEnabled) playCopyChime();
      onToast(`${t.copiedBtn}: ${label}`);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  const handleCopyFullAnalysis = async () => {
    const fullText = `[${t.analysisTitle.toUpperCase()}]
${t.coreBusinessLabel}: ${analysis.core_business}
${t.valuePropLabel}: ${analysis.value_proposition}

${t.detectedPainsLabel}:
${analysis.detected_pains.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;

    const success = await copyToClipboard(fullText);
    if (success) {
      setCopiedSection('full');
      if (soundEnabled) playCopyChime();
      onToast(t.copiedBtn);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between h-full transition-all hover:border-slate-700/80">
      <div className="space-y-6">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{t.analysisTitle}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  {t.analysisSubtitle}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleCopyFullAnalysis}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all cursor-pointer"
            title={t.copyAnalysisBtn}
          >
            {copiedSection === 'full' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">{t.copiedBtn}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>{t.copyAnalysisBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* 1. Core Business Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              {t.coreBusinessLabel}
            </span>
            <button
              onClick={() => handleCopy(analysis.core_business, 'Core Business')}
              className="text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer"
              title="Copy"
            >
              {copiedSection === 'Core Business' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-sm text-slate-200 leading-relaxed font-sans shadow-inner">
            {analysis.core_business}
          </div>
        </div>

        {/* 2. Value Proposition Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              {t.valuePropLabel}
            </span>
            <button
              onClick={() => handleCopy(analysis.value_proposition, 'Value Proposition')}
              className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
              title="Copy"
            >
              {copiedSection === 'Value Proposition' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-sm text-cyan-100/90 leading-relaxed font-sans shadow-inner border-l-4 border-l-cyan-500">
            {analysis.value_proposition}
          </div>
        </div>

        {/* 3. Detected Pain Points Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              {t.detectedPainsLabel} ({analysis.detected_pains.length})
            </span>
            <span className="text-[11px] text-slate-400">{t.detectedPainsSub}</span>
          </div>

          <div className="space-y-2.5">
            {analysis.detected_pains.map((pain, index) => (
              <div
                key={index}
                className="group relative p-3 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-rose-500/40 hover:bg-slate-950/90 transition-all flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-normal group-hover:text-slate-100 transition-colors">
                    {pain}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(pain, `Pain Point #${index + 1}`)}
                  className="opacity-60 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-300 transition-all shrink-0 cursor-pointer"
                  title="Copy"
                >
                  {copiedSection === `Pain Point #${index + 1}` ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic Recommendation Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-900/40 flex items-center gap-2.5 text-xs text-indigo-300">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <p className="leading-snug">
            <strong className="text-indigo-200">{t.strategyTitle}</strong> {t.strategyDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
