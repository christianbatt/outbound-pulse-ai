import React, { useState } from 'react';
import {
  X,
  User,
  Building,
  Target,
  Palette,
  Save,
  Check,
  RotateCcw,
  Volume2,
  Globe,
} from 'lucide-react';
import { UserSettings } from '../types';
import { DEFAULT_SETTINGS } from '../utils/storage';
import { Locale, TRANSLATIONS } from '../utils/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
  onToast: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onToast,
}) => {
  const [form, setForm] = useState<UserSettings>({ ...settings });
  const t = TRANSLATIONS[form.locale || 'it'];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onToast(t.saveBtn);
    onClose();
  };

  const handleReset = () => {
    setForm({ ...DEFAULT_SETTINGS, locale: form.locale });
    onToast(t.resetBtn);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {t.settingsTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {t.settingsSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Section 0: UI Locale Language Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Interface Language / Lingua / Langue
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'it', label: '🇮🇹 Italiano' },
                { id: 'en', label: '🇬🇧 English' },
                { id: 'fr', label: '🇫🇷 Français' },
              ].map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setForm({ ...form, locale: loc.id as Locale })}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    form.locale === loc.id
                      ? 'border-indigo-500 bg-indigo-950/50 text-white shadow-md'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 1: Profilo Mittente */}
          <div className="space-y-3.5 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" />
              {t.senderSection}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.senderName}
                </label>
                <input
                  type="text"
                  value={form.senderName}
                  onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                  placeholder="Es. Marco Rossi"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500/80"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.senderCompany}
                </label>
                <input
                  type="text"
                  value={form.senderCompany}
                  onChange={(e) => setForm({ ...form, senderCompany: e.target.value })}
                  placeholder="Es. GrowthMatrix Solutions"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500/80"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Strategia Target & Copywriting */}
          <div className="space-y-3.5 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" />
              {t.strategySection}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.targetRole}
                </label>
                <select
                  value={form.targetRole}
                  onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500/80"
                >
                  <option value="VP of Growth & Operations">VP of Growth & Operations</option>
                  <option value="Chief Operating Officer (COO)">Chief Operating Officer (COO)</option>
                  <option value="Head of Sales / CRO">Head of Sales / CRO</option>
                  <option value="Chief Technology Officer (CTO)">Chief Technology Officer (CTO)</option>
                  <option value="Chief Financial Officer (CFO)">Chief Financial Officer (CFO)</option>
                  <option value="Founder / CEO">Founder / CEO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.copyTone}
                </label>
                <select
                  value={form.tone}
                  onChange={(e) => setForm({ ...form, tone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500/80"
                >
                  <option value="Assertivo Tech & Diretto ROI">Assertivo Tech & Diretto ROI (Assertive Tech)</option>
                  <option value="Consulenziale & Basato su Benchmark">Consulenziale & Basato su Benchmark (Consultative)</option>
                  <option value="Ultra-Sintetico No-Nonsense">Ultra-Sintetico No-Nonsense (Concise)</option>
                  <option value="Provocatorio & Sfidante lo Status Quo">Provocatorio (Challenger)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.ctaStyle}
                </label>
                <select
                  value={form.ctaStyle}
                  onChange={(e) => setForm({ ...form, ctaStyle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500/80"
                >
                  <option value="breve confronto conoscitivo di 10 minuti">10-minute discovery exchange</option>
                  <option value="invio di un audit preliminare gratuito di 2 pagine">Free 2-page operational audit</option>
                  <option value="domanda aperta di qualificazione operativa">Open qualifying question</option>
                  <option value="condivisione di benchmark di settore">Industry benchmark comparison</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.outputLang}
                </label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-indigo-500/80"
                >
                  <option value="auto">Auto-detect from company text</option>
                  <option value="Italiano">🇮🇹 Italiano</option>
                  <option value="English">🇬🇧 English</option>
                  <option value="Français">🇫🇷 Français</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Aspetto & Esperienza */}
          <div className="space-y-3.5 pt-2 border-t border-slate-800/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              {t.appearanceSection}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'dark', label: 'Dark Slate', desc: 'Default' },
                { id: 'midnight', label: 'Midnight Navy', desc: 'Deep Blue' },
                { id: 'obsidian', label: 'Obsidian Pure', desc: 'Pure AMOLED' },
                { id: 'light', label: 'Clean Light', desc: 'Minimal Light' },
              ].map((themeOpt) => {
                const isSelected = form.theme === themeOpt.id;
                return (
                  <button
                    key={themeOpt.id}
                    type="button"
                    onClick={() => setForm({ ...form, theme: themeOpt.id as any })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-md'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>{themeOpt.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{themeOpt.desc}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-medium text-slate-200">
                  {t.soundFeedback}
                </span>
              </div>
              <input
                type="checkbox"
                checked={form.soundEnabled}
                onChange={(e) => setForm({ ...form, soundEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-800 border-slate-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetBtn}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t.saveBtn}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
