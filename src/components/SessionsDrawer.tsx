import React, { useState } from 'react';
import {
  X,
  Search,
  Star,
  Trash2,
  FileSpreadsheet,
  Download,
  Clock,
  Building2,
  FolderOpen,
  ShieldCheck,
} from 'lucide-react';
import { SessionRecord } from '../types';
import {
  exportAllSessionsAsJSON,
  exportAllSessionsAsCSV,
} from '../utils/storage';
import { Locale, TRANSLATIONS } from '../utils/i18n';

interface SessionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SessionRecord[];
  activeSessionId: string | null;
  locale?: Locale;
  onSelectSession: (session: SessionRecord) => void;
  onDeleteSession: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onClearAll: () => void;
  onToast: (msg: string) => void;
}

export const SessionsDrawer: React.FC<SessionsDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  locale = 'it',
  onSelectSession,
  onDeleteSession,
  onToggleFavorite,
  onClearAll,
  onToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const t = TRANSLATIONS[locale];

  if (!isOpen) return null;

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.data.company_analysis.core_business.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.data.email_campaign.email_1_hook.subject.toLowerCase().includes(searchTerm.toLowerCase());
    if (onlyFavorites) return matchesSearch && s.isFavorite;
    return matchesSearch;
  });

  const handleExportJSON = () => {
    exportAllSessionsAsJSON(sessions);
    onToast('JSON export complete');
  };

  const handleExportCSV = () => {
    exportAllSessionsAsCSV(sessions);
    onToast('CSV export complete');
  };

  const handleExecuteClear = () => {
    onClearAll();
    setConfirmClear(false);
    onToast('Archive cleared');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                <FolderOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  {t.drawerTitle}
                </h2>
                <p className="text-xs text-slate-400">
                  {t.drawerSub(sessions.length)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/80 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/30"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                  onlyFavorites
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>{t.onlyFavorites}</span>
              </button>

              <span className="text-[11px] text-slate-500 font-mono">
                {filteredSessions.length} results
              </span>
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-400">{t.noSessions}</p>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  {t.noSessionsSub}
                </p>
              </div>
            ) : (
              filteredSessions.map((s) => {
                const isActive = s.id === activeSessionId;
                const formattedDate = new Date(s.createdAt).toLocaleDateString(undefined, {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={s.id}
                    className={`group relative rounded-xl border p-3.5 transition-all text-left ${
                      isActive
                        ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-950/50'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div
                        onClick={() => {
                          onSelectSession(s);
                          onClose();
                        }}
                        className="cursor-pointer flex-1 min-w-0"
                      >
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition-colors">
                            {s.companyName}
                          </h4>
                          {isActive && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                              {t.activeBadge}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-sans">
                          {s.data.company_analysis.core_business}
                        </p>

                        <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formattedDate}
                          </span>
                          <span>• {s.metrics.latencyMs}ms</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onToggleFavorite(s.id)}
                          className="p-1 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
                          title="Favorite"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              s.isFavorite ? 'fill-amber-400 text-amber-400' : ''
                            }`}
                          />
                        </button>

                        <button
                          onClick={() => onDeleteSession(s.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Security & Global Actions */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/90 space-y-3">
            {/* Security Badge */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-[11px] text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>{t.securityNotice}</strong>
              </span>
            </div>

            {/* Global Export & Clear Controls */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJSON}
                  disabled={sessions.length === 0}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-medium border border-slate-700/60 transition-all cursor-pointer"
                  title="Export JSON"
                >
                  <Download className="w-3 h-3 text-indigo-400" />
                  <span>{t.exportJson}</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  disabled={sessions.length === 0}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-xs font-medium border border-slate-700/60 transition-all cursor-pointer"
                  title="Export CSV"
                >
                  <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
                  <span>{t.exportCsv}</span>
                </button>
              </div>

              {confirmClear ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleExecuteClear}
                    className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold cursor-pointer"
                  >
                    {t.confirmBtn}
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs cursor-pointer"
                  >
                    {t.cancelBtn}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  disabled={sessions.length === 0}
                  className="text-xs text-slate-500 hover:text-rose-400 disabled:opacity-30 transition-colors cursor-pointer"
                >
                  {t.clearArchive}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
