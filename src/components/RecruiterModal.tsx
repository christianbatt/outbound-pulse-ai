import React from 'react';
import {
  X,
  Briefcase,
  Mail,
  Github,
  CheckCircle2,
  Code2,
  Layers,
  Cpu,
  ShieldCheck,
  Globe,
  Award,
  ExternalLink,
} from 'lucide-react';
import { Locale, TRANSLATIONS } from '../utils/i18n';

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

  const email = 'christianbattistoni85@gmail.com';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Banner Top */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 p-6 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-500/30 shrink-0">
              CB
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">Christian Battistoni</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Open to Opportunities
                </span>
              </div>
              <p className="text-sm font-semibold text-indigo-300">
                Senior Full-Stack Engineer • AI Solutions Architect
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                React 19 • TypeScript • Node.js / Express • LLM Orchestration • Distributed Systems
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-slate-200">
          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <Award className="w-4 h-4" />
              Executive Pitch for Hiring Managers / HR
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Progetto architettato per dimostrare competenze di ingegneria software avanzata: integrazione server-side sicura di Large Language Models (Google Gemini SDK), gestione dello stato frontend senza framework bloated, internazionalizzazione nativa (Italiano, Inglese, Francese), resilienza con failover euristico e UX orientata al business B2B.
            </p>
          </div>

          {/* Core Competencies Demonstrated in this Project */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              Competenze Dimostrate in Questa Applicazione
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Full-Stack Security by Design</strong>
                  <span className="text-slate-400">Zero esposizione di API keys nel client bundle; proxy backend con Express e convalida payload.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Structured LLM Schemas</strong>
                  <span className="text-slate-400">Schema JSON rigoroso tramite Gemini 3.8 Flash SDK per garantire consistenza assoluta dell'output.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Trilingual Native i18n</strong>
                  <span className="text-slate-400">Architettura i18n reattiva (IT, EN, FR) sincronizzata tra prompt LLM, UI e preset.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Zero Slop & Clean UI/UX</strong>
                  <span className="text-slate-400">Design raffinato con Tailwind CSS v4, animazioni su misura e feedback sonoro sintetizzato.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Contact Links */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>{email}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`mailto:${email}?subject=${encodeURIComponent('Opportunità di Lavoro - Profilo Full-Stack Lead')}`}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contatta Direttamente</span>
              </a>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
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
