import React, { useState, useEffect } from 'react';
import {
  Mail,
  Copy,
  Check,
  Clock,
  Send,
  Eye,
  CheckCheck,
  FileDown,
  Edit3,
  RotateCcw,
} from 'lucide-react';
import { EmailCampaign, UserSettings } from '../types';
import { playCopyChime } from '../utils/audio';
import { TRANSLATIONS } from '../utils/i18n';
import { copyToClipboard } from '../utils/clipboard';

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
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Editable local draft state
  const [email1Subject, setEmail1Subject] = useState(campaign.email_1_hook.subject);
  const [email1Body, setEmail1Body] = useState(campaign.email_1_hook.body);
  const [email2Subject, setEmail2Subject] = useState(campaign.email_2_followup.subject);
  const [email2Body, setEmail2Body] = useState(campaign.email_2_followup.body);

  const t = TRANSLATIONS[settings.locale || 'it'];

  // Sync state if campaign changes
  useEffect(() => {
    setEmail1Subject(campaign.email_1_hook.subject);
    setEmail1Body(campaign.email_1_hook.body);
    setEmail2Subject(campaign.email_2_followup.subject);
    setEmail2Body(campaign.email_2_followup.body);
  }, [campaign]);

  // Dynamic variable replacement helper for real-world preview
  const formatEmailBody = (rawBody: string) => {
    let text = rawBody;
    text = text.replace(/\[Nome\s*(?:Lead|Referente|Destinatario)?\]/gi, settings.recipientName || 'Alex');
    text = text.replace(/\[Tuo\s*Nome\]/gi, settings.senderName || 'Marco Rossi');
    text = text.replace(/\[Tua\s*Azienda\]/gi, settings.senderCompany || 'GrowthMatrix');
    return text;
  };

  const handleCopy = async (content: string, id: string, label: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopiedId(id);
      if (soundEnabled) playCopyChime();
      onToast(`${t.textCopiedBtn} (${label})`);
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      onToast('Impossibile copiare negli appunti');
    }
  };

  const handleCopyEntireSequence = async () => {
    const sequenceText = `${t.email1Badge.toUpperCase()} (${t.email1Timing})
${t.subjectLabel} ${email1Subject}
---
${formatEmailBody(email1Body)}

==================================================

${t.email2Badge.toUpperCase()} (${t.email2Timing})
${t.subjectLabel} ${email2Subject}
---
${formatEmailBody(email2Body)}
`;
    const success = await copyToClipboard(sequenceText);
    if (success) {
      setCopiedId('full-sequence');
      if (soundEnabled) playCopyChime();
      onToast(t.bothCopiedBtn);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const resetToOriginal = () => {
    setEmail1Subject(campaign.email_1_hook.subject);
    setEmail1Body(campaign.email_1_hook.body);
    setEmail2Subject(campaign.email_2_followup.subject);
    setEmail2Body(campaign.email_2_followup.body);
    onToast('Testo ripristinato');
  };

  const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

  const email1Words = countWords(email1Body);
  const email2Words = countWords(email2Body);

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
                <span>{t.sequenceTitle}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {t.sequenceSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                isEditing
                  ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                  : 'bg-slate-800/90 border-slate-700/60 text-slate-300 hover:text-white'
              }`}
              title="Modifica testo email"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Salva Modifiche' : 'Modifica'}</span>
            </button>

            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                isPreviewMode
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-800/90 border-slate-700/60 text-slate-300 hover:text-white'
              }`}
              title="Preview mode"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isPreviewMode ? t.previewToggle : t.variablesToggle}</span>
            </button>

            <button
              onClick={handleCopyEntireSequence}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95 cursor-pointer"
              title="Copy both emails"
            >
              {copiedId === 'full-sequence' ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-white" />
                  <span>{t.bothCopiedBtn}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copyBothBtn}</span>
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
                {t.email1Badge}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">{t.email1Timing}</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span
                className={`px-2 py-0.5 rounded-md font-mono text-[11px] ${
                  email1Words <= 120
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                    : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                }`}
                title="Target"
              >
                {email1Words} {t.wordsLabel} / {t.email1Target}
              </span>
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300">{t.subjectLabel}</span>
              <button
                onClick={() => handleCopy(email1Subject, 'e1-sub', 'Subject')}
                className="flex items-center gap-1 text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer"
                title={t.copySubjectBtn}
              >
                {copiedId === 'e1-sub' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{t.copySubjectBtn}</span>
              </button>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={email1Subject}
                onChange={(e) => setEmail1Subject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-indigo-500/60 text-sm font-medium text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            ) : (
              <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 flex items-center justify-between">
                <span className="truncate">{email1Subject}</span>
              </div>
            )}
          </div>

          {/* Email Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300">{t.bodyLabel}</span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {t.readingTime1}
              </span>
            </div>

            {isEditing ? (
              <textarea
                value={email1Body}
                onChange={(e) => setEmail1Body(e.target.value)}
                rows={6}
                className="w-full p-3.5 rounded-xl bg-slate-900 border border-indigo-500/60 text-sm text-slate-100 leading-relaxed font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
              />
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap select-text">
                {formatEmailBody(email1Body)}
              </div>
            )}
          </div>

          {/* Bottom Card Actions */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/60">
            <a
              href={createMailtoLink(email1Subject, email1Body)}
              className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              title="Mailto"
            >
              <Send className="w-3 h-3" />
              <span>{t.openMailto}</span>
            </a>

            <button
              onClick={() => handleCopy(formatEmailBody(email1Body), 'e1-body', 'Email 1')}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              {copiedId === 'e1-body' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">{t.textCopiedBtn}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copyTextBtn}</span>
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
                {t.email2Badge}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">{t.email2Timing}</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span
                className={`px-2 py-0.5 rounded-md font-mono text-[11px] ${
                  email2Words <= 80
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                    : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                }`}
                title="Target"
              >
                {email2Words} {t.wordsLabel} / {t.email2Target}
              </span>
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300">{t.subjectLabel}</span>
              <button
                onClick={() => handleCopy(email2Subject, 'e2-sub', 'Subject')}
                className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                title={t.copySubjectBtn}
              >
                {copiedId === 'e2-sub' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{t.copySubjectBtn}</span>
              </button>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={email2Subject}
                onChange={(e) => setEmail2Subject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/60 text-sm font-medium text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            ) : (
              <div className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm font-medium text-slate-100 flex items-center justify-between">
                <span className="truncate">{email2Subject}</span>
              </div>
            )}
          </div>

          {/* Email Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300">{t.bodyLabel}</span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {t.readingTime2}
              </span>
            </div>

            {isEditing ? (
              <textarea
                value={email2Body}
                onChange={(e) => setEmail2Body(e.target.value)}
                rows={5}
                className="w-full p-3.5 rounded-xl bg-slate-900 border border-cyan-500/60 text-sm text-slate-100 leading-relaxed font-sans focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-y"
              />
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap select-text">
                {formatEmailBody(email2Body)}
              </div>
            )}
          </div>

          {/* Bottom Card Actions */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/60">
            <a
              href={createMailtoLink(email2Subject, email2Body)}
              className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              title="Mailto"
            >
              <Send className="w-3 h-3" />
              <span>{t.openMailto}</span>
            </a>

            <button
              onClick={() => handleCopy(formatEmailBody(email2Body), 'e2-body', 'Email 2')}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600/15 hover:bg-cyan-600/30 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              {copiedId === 'e2-body' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">{t.textCopiedBtn}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t.copyTextBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              onClick={resetToOriginal}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Ripristina originale</span>
            </button>
          )}
        </div>
        <button
          onClick={onExportMarkdown}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all cursor-pointer"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>{t.exportMarkdownBtn}</span>
        </button>
      </div>
    </div>
  );
};
