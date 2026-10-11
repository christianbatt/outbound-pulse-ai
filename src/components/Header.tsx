import React from 'react';
import {
  Sparkles,
  History,
  Settings,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { UserSettings } from '../types';

interface HeaderProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onOpenDrawer: () => void;
  onOpenSettings: () => void;
  sessionCount: number;
  isGenerating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenDrawer,
  onOpenSettings,
  sessionCount,
  isGenerating,
}) => {
  const toggleSound = () => {
    onUpdateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'light' ? 'dark' : 'light';
    onUpdateSettings({ theme: nextTheme });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white font-mono flex items-center gap-1.5">
                LeadPulse <span className="text-indigo-400 font-sans font-semibold text-xs px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300">B2B Intel</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Sales Intelligence & Outbound Sequences Generator
            </p>
          </div>
        </div>

        {/* Engine Status & Capabilities */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-inner">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">Motore:</span>
          <span className="font-medium text-slate-200">Gemini 3.8 Flash</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></span>
          <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">AIDA Framework</span>
        </div>

        {/* Controls & Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Audio Chime Toggle */}
          <button
            onClick={toggleSound}
            title={settings.soundEnabled ? 'Disattiva feedback sonoro' : 'Attiva feedback sonoro'}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-800"
            aria-label="Toggle Sound"
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Theme Quick Switcher */}
          <button
            onClick={toggleTheme}
            title={settings.theme === 'light' ? 'Passa alla modalità scura' : 'Passa alla modalità chiara'}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-800"
            aria-label="Toggle Theme"
          >
            {settings.theme === 'light' ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-300" />}
          </button>

          {/* User Settings / Profile */}
          <button
            onClick={onOpenSettings}
            title="Configurazione Profilo & Copywriting"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-800 relative"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Session History Drawer */}
          <button
            onClick={onOpenDrawer}
            disabled={isGenerating}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/80 hover:border-indigo-500/50 transition-all shadow-sm group"
          >
            <History className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-[-20deg] transition-transform" />
            <span>Sessioni</span>
            {sessionCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {sessionCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
