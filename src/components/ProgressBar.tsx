import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2 } from 'lucide-react';

interface ProgressBarProps {
  isGenerating: boolean;
}

const STAGES = [
  { label: 'Analisi Core Business & Mercato Target', targetProgress: 28 },
  { label: 'Isolamento Value Proposition & Problemi Risolti', targetProgress: 56 },
  { label: 'Rilevamento Pain Points Operativi e di Crescita', targetProgress: 82 },
  { label: 'Generazione Copy AIDA e Sequenza Outbound Follow-up', targetProgress: 96 },
];

export const ProgressBar: React.FC<ProgressBarProps> = ({ isGenerating }) => {
  const [progress, setProgress] = useState(12);
  const [stageIndex, setStageIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setProgress(100);
      setSeconds(0);
      return;
    }

    setProgress(15);
    setStageIndex(0);
    setSeconds(0);

    const timer = setInterval(() => {
      setSeconds((prev) => +(prev + 0.1).toFixed(1));
    }, 100);

    const stageTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) {
          setStageIndex(0);
          return prev + 6;
        } else if (prev < 60) {
          setStageIndex(1);
          return prev + 5;
        } else if (prev < 85) {
          setStageIndex(2);
          return prev + 3;
        } else if (prev < 95) {
          setStageIndex(3);
          return prev + 1;
        }
        return 95;
      });
    }, 280);

    return () => {
      clearInterval(timer);
      clearInterval(stageTimer);
    };
  }, [isGenerating]);

  if (!isGenerating) return null;

  return (
    <div className="w-full bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md transition-all animate-fadeIn">
      {/* Header with state */}
      <div className="flex items-center justify-between text-xs mb-3">
        <div className="flex items-center gap-2 text-indigo-300 font-medium">
          <Cpu className="w-4 h-4 text-indigo-400 animate-spin" />
          <span>{STAGES[stageIndex]?.label || 'Elaborazione logica B2B in corso...'}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-slate-400">
          <span>{seconds.toFixed(1)}s</span>
          <span className="text-indigo-400 font-bold">{Math.min(100, Math.round(progress))}%</span>
        </div>
      </div>

      {/* Track and Progress Bar */}
      <div className="relative w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-400 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer beam effect */}
          <div className="absolute inset-0 bg-white/25 w-full h-full transform -skew-x-12 -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>

      {/* Multi-step indicator pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2 border-t border-slate-800/60 text-[11px]">
        {STAGES.map((s, idx) => {
          const isDone = stageIndex > idx;
          const isCurrent = stageIndex === idx;
          return (
            <div
              key={idx}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                isDone
                  ? 'text-emerald-400 bg-emerald-950/30 border border-emerald-900/40'
                  : isCurrent
                  ? 'text-indigo-300 bg-indigo-950/50 border border-indigo-800/60 font-medium'
                  : 'text-slate-600 bg-slate-950/30'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              ) : (
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isCurrent ? 'bg-indigo-400 animate-ping' : 'bg-slate-700'
                  }`}
                />
              )}
              <span className="truncate">{s.label.split(' ')[1]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
