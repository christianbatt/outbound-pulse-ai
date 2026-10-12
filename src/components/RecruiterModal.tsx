import React from 'react';
import {
  X,
  Mail,
  Sparkles,
  Bot,
  Zap,
  Target,
  Award,
  Layers,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import { Locale } from '../utils/i18n';

interface RecruiterModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export const RecruiterModal: React.FC<RecruiterModalProps> = ({
  isOpen,
  onClose,
  locale,
}) => {
  if (!isOpen) return null;

  const email = 'christian.battistoni.eu@gmail.com';
  const demoUrl = 'https://outboundpulse.ai.studio';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Banner Top */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 p-6 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-500/30 shrink-0">
              CB
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-white">Christian Battistoni</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Sales Manager & AI Orchestrator
                </span>
              </div>
              <p className="text-sm font-semibold text-cyan-300 mt-0.5">
                Sales Manager • Business Developer • Project Manager
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Usa l'Intelligenza Artificiale come moltiplicatore di business e per ottimizzare l'efficienza operativa • Vibe Coder & AI Orchestrator
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-slate-200">
          {/* Executive Summary / Chi Sono */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Profilo Professionale & Approccio Strategico
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Non sono uno sviluppatore software tradizionale o un programmatore teorico: sono un <strong>Sales Manager, Business Developer e Project Manager</strong> con visione strategica che sa usare l'<strong>Intelligenza Artificiale per moltiplicare il business e migliorare l'efficienza</strong> dei processi aziendali.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Attraverso il <strong>Vibe Coding</strong> e l'<strong>AI Orchestration</strong>, guido e coordino modelli linguistici all'avanguardia (Google Gemini, xAI Grok, Cerebras Llama 3.3) per costruire in autonomia soluzioni di Sales Intelligence concrete, ad alto impatto e orientate al ROI.
            </p>
          </div>

          {/* Live App Demo Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Live Demo Online dell'Applicazione
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                Testa l'applicazione pubblicata e funzionante in tempo reale:
              </p>
              <a
                href={demoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-indigo-300 hover:text-white underline mt-1 inline-flex items-center gap-1"
              >
                <span>{demoUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <a
              href={demoUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all shrink-0 cursor-pointer"
            >
              <span>Apri Demo Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Core Competencies */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Competenze Chiave & Valore Aggiunto
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-2.5">
                <Briefcase className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Sales Management & Business Development</strong>
                  <span className="text-slate-400 leading-relaxed">
                    Comprovata capacità di guidare strategie commerciali B2B, espansione di mercato, gestione pipeline e generazione di lead qualificati orientati al closing.
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-2.5">
                <Layers className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Project Management & Efficienza Operativa</strong>
                  <span className="text-slate-400 leading-relaxed">
                    Pianificazione, coordinamento di team e ottimizzazione dei workflow di delivery, eliminando i colli di bottiglia e massimizzando il rendimento con strumenti AI.
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-2.5">
                <Bot className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">AI Orchestration & Multi-Model Failover</strong>
                  <span className="text-slate-400 leading-relaxed">
                    Padronanza nell'orchestrazione di LLM: architetture multi-provider con Google Gemini, fallback automatico su xAI Grok e Cerebras Cloud per uptime garantito.
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Vibe Coding & Rapid Prototyping</strong>
                  <span className="text-slate-400 leading-relaxed">
                    Capacità di tradurre requisiti di business complessi in applicazioni SaaS complete e operative al 100%, accelerando il time-to-market da mesi a ore.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Proof of Work */}
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/50 text-xs text-indigo-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Proof of Work:</strong> Questa intera applicazione SaaS (LeadPulse B2B / OutboundPulse) è stata ideata, orchestrata e completata da Christian Battistoni, unendo sensibilità commerciale B2B, copywriting AIDA e abilità di <em>Vibe Coding</em> su Gemini 3.8 Flash, Grok e Cerebras.
            </p>
          </div>

          {/* Direct Contact Links */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono text-cyan-300 font-semibold">{email}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`mailto:${email}?subject=${encodeURIComponent('Opportunità di Collaborazione - Christian Battistoni (Sales Manager & AI Orchestrator)')}`}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Scrivimi via Email</span>
              </a>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
