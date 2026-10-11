import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  Clock,
  Sparkles,
  ExternalLink,
  Share2,
  FileDown,
  CheckCheck,
  Send,
  Eye,
  Edit3,
} from 'lucide-react';
import { EmailCampaign, UserSettings } from '../types';
import { playCopyChime } from '../utils/audio';

interface EmailSequenceCardProps {
  campaign: EmailCampaign;
  settings: UserSettings;
  soundEnabled?: boolean;
  onToast: (msg: string) => void;
  onExportMarkdown: () => void;
}

export const EmailSequenceCard: React.FC<EmailSequenceCardProps> = ({
  campaign,
  settings,
  soundEnabled,
  onToast,
  onExportMarkdown,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Dynamic variable replacement helper for real-world preview
  const formatEmailBody = (rawBody: string) => {
    let text = rawBody;
    // Replace typical placeholders if present or personalize
    text = text.replace(/\[Nome\s*(?:Lead|Referente|Destinatario)?\]/gi, settings.recipientName || 'Alex');
    text = text.replace(/\[Tuo\s*Nome\]/gi, settings.senderName || 'Marco Rossi');
    text = text.replace(/\[Tua\s*Azienda\]/gi, settings.senderCompany || 'GrowthMatrix');
    return text;
  };

  const handleCopy = (content: string, id: string, label: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    if (soundEnabled) playCopyChime();
    onToast(`Copiato: ${label}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyEntireSequence = () => {
    const sequenceText = `EMAIL 1: HOOK AIDA (Giorno 1)
Oggetto: ${campaign.email_1_hook.subject}
---
${formatEmailBody(campaign.email_1_hook.body)}

==================================================

EMAIL 2: FOLLOW-UP (Giorno 4 / +3gg)
Oggetto: ${campaign.email_2_followup.subject}
---
${formatEmailBody(campaign.email_2_followup.body)}
`;
    navigator.clipboard.writeText(sequenceText);
    setCopiedId('full-sequence');
    if (soundEnabled) playCopyChime();
    onToast("Intera sequenza (Email 1 + Email 2) copiata negli appunti!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

  const email1Words = countWords(campaign.email_1_hook.body);
  const email2Words = countWords(campaign.email_2_followup.body);

  const createMailtoLink = (subject: string, body: string) => {
    const formatted = formatEmailBody(body);
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(formatted)}`;
  };

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between h-full transition-all hover:border-slate-700/80">
      <div className="space-y-6">
        {/* Top Header of Right Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Sequenza Outbound Ad Alta Conversione</span>
              </h3>
              <p className="text-xs text-slate-400">
                2 email iper-personalizzate pronte all'invio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isPreviewMode
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-800/90 border-slate-700/60 text-slate-300 hover:text-white'
              }`}
              title="Anteprima con dati mittente/destinatario inseriti"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isPreviewMode ? 'Vista Reale' : 'Variabili'}</span>
            </button>

            <button
              onClick={handleCopyEntireSequence}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              title="Copia entrambe le email contemporaneamente"
            >
              {copiedId === 'full-sequence' ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-white" />
                  <span>Sequenza Copiata!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copia Entrambe</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================= EMAIL 1: HOOK AIDA ================= */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4.5 space-y-3.5 shadow-md relative group hover:border-slate-700 transition-all">
          {/* Badge & Timing Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Email #1 • Hook AIDA
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Giorno 1</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span
                className={`px-2 py-0.5 rounded-md font-mono text-[11px] ${
                  email1Words <= 120
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                    : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                }`}
                title="Target di lunghezza: max 120 parole"
              >
                {email1Words} parole / max 120
              </span>
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300">Oggetto:</span>
              <button
                onClick={() => handleCopy(campaign.email_1_hook.subject, 'e1-sub', 'Oggetto Email 1')}
                className="flex items-center gap-1 text-slate-400 hover:text-indigo-300 transition-colors"
                title="Copia solo l'oggetto"
              >
                {copiedId === 'e1-sub' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">Copia Oggetto</span>
              </button>
            </div>
            <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 flex items-center justify-between">
              <span className="truncate">{campaign.email_1_hook.subject}</span>
            </div>
          </div>

          {/* Email Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300">Corpo del messaggio:</span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> ~30 sec lettura
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap select-text">
              {formatEmailBody(campaign.email_1_hook.body)}
            </div>
          </div>

          {/* Bottom Card Actions */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/60">
            <a
              href={createMailtoLink(campaign.email_1_hook.subject, campaign.email_1_hook.body)}
              className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              title="Apri nel tuo client di posta predefinito"
            >
              <Send className="w-3 h-3" />
              <span>Apri bozza email</span>
            </a>

            <button
              onClick={() => handleCopy(formatEmailBody(campaign.email_1_hook.body), 'e1-body', 'Corpo Email 1')}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              {copiedId === 'e1-body' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copiato!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copia testo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================= EMAIL 2: FOLLOW-UP ================= */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4.5 space-y-3.5 shadow-md relative group hover:border-slate-700 transition-all">
          {/* Badge & Timing Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Email #2 • Follow-up & Caso d'uso
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Giorno 4 (+3 giorni)</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span
                className={`px-2 py-0.5 rounded-md font-mono text-[11px] ${
                  email2Words <= 80
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                    : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                }`}
                title="Target di lunghezza: max 80 parole"
              >
                {email2Words} parole / max 80
              </span>
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300">Oggetto:</span>
              <button
                onClick={() => handleCopy(campaign.email_2_followup.subject, 'e2-sub', 'Oggetto Email 2')}
                className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors"
                title="Copia solo l'oggetto"
              >
                {copiedId === 'e2-sub' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">Copia Oggetto</span>
              </button>
            </div>
            <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 flex items-center justify-between">
              <span className="truncate">{campaign.email_2_followup.subject}</span>
            </div>
          </div>

          {/* Email Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300">Corpo del messaggio:</span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> ~20 sec lettura
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap select-text">
              {formatEmailBody(campaign.email_2_followup.body)}
            </div>
          </div>

          {/* Bottom Card Actions */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/60">
            <a
              href={createMailtoLink(campaign.email_2_followup.subject, campaign.email_2_followup.body)}
              className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              title="Apri nel tuo client di posta predefinito"
            >
              <Send className="w-3 h-3" />
              <span>Apri bozza email</span>
            </a>

            <button
              onClick={() => handleCopy(formatEmailBody(campaign.email_2_followup.body), 'e2-body', 'Corpo Email 2')}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600/15 hover:bg-cyan-600/30 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              {copiedId === 'e2-body' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copiato!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copia testo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400">
          Formato certificato: AIDA + Follow-up 3gg
        </span>
        <button
          onClick={onExportMarkdown}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Esporta Sequenza (.md)</span>
        </button>
      </div>
    </div>
  );
};
