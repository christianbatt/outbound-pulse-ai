export type Locale = 'it' | 'en' | 'fr';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  badgeAi: string;
  heroTitle: string;
  heroDesc: string;
  candidateBadge: string;
  recruiterBtn: string;
  engineStatus: string;
  sessionsBtn: string;
  settingsBtn: string;
  soundOn: string;
  soundOff: string;
  themeToggle: string;
  
  // Input section
  inputTitle: string;
  inputSubtitle: string;
  inputPlaceholder: string;
  presetsLabel: string;
  wordsLabel: string;
  charsLabel: string;
  minCharsWarning: string;
  clearBtn: string;
  generateBtn: string;
  generatingBtn: string;
  targetRoleLabel: string;
  toneLabel: string;
  ctaLabel: string;
  
  // Progress bar
  progressStages: [string, string, string, string];
  
  // Analysis card
  analysisTitle: string;
  analysisSubtitle: string;
  copyAnalysisBtn: string;
  copiedBtn: string;
  coreBusinessLabel: string;
  valuePropLabel: string;
  detectedPainsLabel: string;
  detectedPainsSub: string;
  strategyTitle: string;
  strategyDesc: string;
  
  // Email card
  sequenceTitle: string;
  sequenceSubtitle: string;
  previewToggle: string;
  variablesToggle: string;
  copyBothBtn: string;
  bothCopiedBtn: string;
  email1Badge: string;
  email1Timing: string;
  email1Target: string;
  email2Badge: string;
  email2Timing: string;
  email2Target: string;
  subjectLabel: string;
  copySubjectBtn: string;
  bodyLabel: string;
  readingTime1: string;
  readingTime2: string;
  openMailto: string;
  copyTextBtn: string;
  textCopiedBtn: string;
  exportMarkdownBtn: string;
  
  // Sessions Drawer
  drawerTitle: string;
  drawerSub: (count: number) => string;
  searchPlaceholder: string;
  onlyFavorites: string;
  noSessions: string;
  noSessionsSub: string;
  activeBadge: string;
  securityNotice: string;
  exportJson: string;
  exportCsv: string;
  clearArchive: string;
  confirmBtn: string;
  cancelBtn: string;
  
  // Settings modal
  settingsTitle: string;
  settingsSubtitle: string;
  senderSection: string;
  senderName: string;
  senderCompany: string;
  strategySection: string;
  targetRole: string;
  copyTone: string;
  ctaStyle: string;
  outputLang: string;
  appearanceSection: string;
  soundFeedback: string;
  saveBtn: string;
  resetBtn: string;
  
  // Status & metrics
  completedStatus: string;
  latencyLabel: string;
  savedLocal: string;
  offlineNotice: string;
}

export const TRANSLATIONS: Record<Locale, Translations> = {
  it: {
    appTitle: 'LeadPulse B2B',
    appSubtitle: 'Sales Intelligence & Sequenze Outbound ad Alta Conversione',
    badgeAi: 'B2B Sales Intelligence',
    heroTitle: 'Genera Sequenze Outbound Iper-Personalizzate in Pochi Secondi',
    heroDesc: "Incolla la descrizione di un'azienda target. LeadPulse analizzerà il loro modello di business, identificherà i Pain Points critici e genererà una sequenza email a due step (Hook AIDA + Follow-up a 3gg) ad altissimo tasso di conversione.",
    candidateBadge: 'Portfolio Project • Christian Battistoni — Senior Full-Stack Engineer',
    recruiterBtn: 'Profilo Candidato / HR',
    engineStatus: 'Motore: Gemini 3.8 Flash',
    sessionsBtn: 'Sessioni',
    settingsBtn: 'Impostazioni & Profilo',
    soundOn: 'Disattiva feedback sonoro',
    soundOff: 'Attiva feedback sonoro',
    themeToggle: 'Cambia tema visivo',
    
    inputTitle: 'Informazioni Azienda Target',
    inputSubtitle: '(Incolla testo dal sito web, landing page o profilo LinkedIn)',
    inputPlaceholder: "Esempio: Incolla qui il testo aziendale target (es. chi sono, proposta di valore, servizi offerti, landing page o descrizione di business)...",
    presetsLabel: 'Preset di prova:',
    wordsLabel: 'parole',
    charsLabel: 'caratteri',
    minCharsWarning: "Consigliati almeno 20 caratteri per un'analisi approfondita",
    clearBtn: 'Pulisci',
    generateBtn: 'Genera Campagna',
    generatingBtn: 'Analisi & Generazione in corso...',
    targetRoleLabel: 'Target Persona:',
    toneLabel: 'Tono:',
    ctaLabel: 'CTA:',
    
    progressStages: [
      'Analisi Core Business & Mercato Target',
      'Isolamento Value Proposition & Benefici',
      'Rilevamento Pain Points Operativi & Colli di Bottiglia',
      'Sintesi Copywriting AIDA & Follow-up Sequenza',
    ],
    
    analysisTitle: 'Analisi Sales Intelligence',
    analysisSubtitle: "Profilazione strategica e punti d'attrito target",
    copyAnalysisBtn: 'Copia Analisi',
    copiedBtn: 'Copiato',
    coreBusinessLabel: '1. Core Business',
    valuePropLabel: '2. Value Proposition',
    detectedPainsLabel: '3. Detected Pains',
    detectedPainsSub: 'Punti di rottura operativi',
    strategyTitle: 'Strategia Outbound:',
    strategyDesc: 'I pain point rilevati sono agganciati alle 2 email a destra con approccio AIDA e follow-up a prova di obiezione.',
    
    sequenceTitle: 'Sequenza Outbound Ad Alta Conversione',
    sequenceSubtitle: "2 email iper-personalizzate pronte all'invio",
    previewToggle: 'Vista Reale',
    variablesToggle: 'Variabili',
    copyBothBtn: 'Copia Entrambe',
    bothCopiedBtn: 'Sequenza Copiata!',
    email1Badge: 'Email #1 • Hook AIDA',
    email1Timing: 'Giorno 1',
    email1Target: 'max 120 parole',
    email2Badge: "Email #2 • Follow-up & Caso d'uso",
    email2Timing: 'Giorno 4 (+3 giorni)',
    email2Target: 'max 80 parole',
    subjectLabel: 'Oggetto:',
    copySubjectBtn: 'Copia Oggetto',
    bodyLabel: 'Corpo del messaggio:',
    readingTime1: '~30 sec lettura',
    readingTime2: '~20 sec lettura',
    openMailto: 'Apri bozza email',
    copyTextBtn: 'Copia testo',
    textCopiedBtn: 'Copiato!',
    exportMarkdownBtn: 'Esporta Sequenza (.md)',
    
    drawerTitle: 'Archivio Sessioni B2B',
    drawerSub: (count) => `${count} ${count === 1 ? 'campagna salvata' : 'campagne salvate'} in locale`,
    searchPlaceholder: 'Cerca per azienda, core business, oggetto...',
    onlyFavorites: 'Solo Preferiti',
    noSessions: 'Nessuna sessione trovata',
    noSessionsSub: 'Genera una nuova campagna per vederla archiviata automaticamente qui.',
    activeBadge: 'Attiva',
    securityNotice: 'Sicurezza Dati & Crittografia Locale: Nessun dato archiviato su server terzi.',
    exportJson: 'JSON',
    exportCsv: 'CSV',
    clearArchive: 'Svuota Archivio',
    confirmBtn: 'Conferma',
    cancelBtn: 'Annulla',
    
    settingsTitle: 'Profilo Mittente & Strategia Outbound',
    settingsSubtitle: "Personalizza le variabili di generazione e l'aspetto dell'applicazione",
    senderSection: '1. Dati Mittente (Tu & La Tua Azienda)',
    senderName: 'Tuo Nome Completo',
    senderCompany: 'Tua Azienda / Servizio',
    strategySection: '2. Parametri Outbound & Buyer Persona',
    targetRole: 'Ruolo Target Predefinito',
    copyTone: 'Tono del Copywriting',
    ctaStyle: 'Stile Call To Action (CTA)',
    outputLang: 'Lingua di Output Desiderata',
    appearanceSection: '3. Tema Visivo Personalizzabile & Audio',
    soundFeedback: 'Feedback sonoro per completamento e copia (Web Audio)',
    saveBtn: 'Salva Modifiche',
    resetBtn: 'Ripristina Default',
    
    completedStatus: 'Richiesta Completata con Successo',
    latencyLabel: 'Latenza:',
    savedLocal: '✓ Salvato in Locale',
    offlineNotice: 'Modalità Offline: Connessione di rete assente. I dati archiviati restano accessibili in locale.',
  },
  
  en: {
    appTitle: 'LeadPulse B2B',
    appSubtitle: 'High-Converting B2B Sales Intelligence & Outbound Sequences',
    badgeAi: 'B2B Sales Intelligence Engine',
    heroTitle: 'Generate Hyper-Personalized Outbound Email Sequences in Seconds',
    heroDesc: 'Paste any target company description or website copy. LeadPulse extracts core business models, detects operational pain points, and crafts a proven 2-step outbound sequence (AIDA Hook + 3-day Follow-up) tailored to your buyer persona.',
    candidateBadge: 'Portfolio Project • Christian Battistoni — Senior Full-Stack Engineer',
    recruiterBtn: 'Recruiter / HR Info',
    engineStatus: 'Engine: Gemini 3.8 Flash',
    sessionsBtn: 'Sessions',
    settingsBtn: 'Settings & Profile',
    soundOn: 'Disable sound feedback',
    soundOff: 'Enable sound feedback',
    themeToggle: 'Toggle visual theme',
    
    inputTitle: 'Target Company Information',
    inputSubtitle: '(Paste website about page, product overview or landing page text)',
    inputPlaceholder: 'Example: Paste target company website text, value proposition, services, or SaaS overview here...',
    presetsLabel: 'Test presets:',
    wordsLabel: 'words',
    charsLabel: 'characters',
    minCharsWarning: 'At least 20 characters recommended for in-depth intelligence',
    clearBtn: 'Clear',
    generateBtn: 'Generate Campaign',
    generatingBtn: 'Analyzing & Generating...',
    targetRoleLabel: 'Target Persona:',
    toneLabel: 'Tone:',
    ctaLabel: 'CTA:',
    
    progressStages: [
      'Core Business & Market Segmentation Analysis',
      'Value Proposition & Problem Mapping',
      'Operational Pain Points & Bottleneck Detection',
      'AIDA Copywriting & Sequence Synthesis',
    ],
    
    analysisTitle: 'Sales Intelligence Analysis',
    analysisSubtitle: 'Strategic buyer profiling & friction identification',
    copyAnalysisBtn: 'Copy Analysis',
    copiedBtn: 'Copied',
    coreBusinessLabel: '1. Core Business',
    valuePropLabel: '2. Value Proposition',
    detectedPainsLabel: '3. Detected Pains',
    detectedPainsSub: 'Critical operational bottlenecks',
    strategyTitle: 'Outbound Strategy:',
    strategyDesc: 'Detected pains are directly addressed across the 2 emails using the AIDA framework and objection-handling follow-up.',
    
    sequenceTitle: 'High-Converting Outbound Sequence',
    sequenceSubtitle: '2 hyper-personalized emails ready to send',
    previewToggle: 'Live Preview',
    variablesToggle: 'Variables',
    copyBothBtn: 'Copy Both Emails',
    bothCopiedBtn: 'Sequence Copied!',
    email1Badge: 'Email #1 • AIDA Hook',
    email1Timing: 'Day 1',
    email1Target: 'max 120 words',
    email2Badge: 'Email #2 • Follow-up & Case Study',
    email2Timing: 'Day 4 (+3 days)',
    email2Target: 'max 80 words',
    subjectLabel: 'Subject Line:',
    copySubjectBtn: 'Copy Subject',
    bodyLabel: 'Email Body:',
    readingTime1: '~30 sec read',
    readingTime2: '~20 sec read',
    openMailto: 'Open email draft',
    copyTextBtn: 'Copy text',
    textCopiedBtn: 'Copied!',
    exportMarkdownBtn: 'Export Sequence (.md)',
    
    drawerTitle: 'B2B Sessions Archive',
    drawerSub: (count) => `${count} ${count === 1 ? 'campaign saved' : 'campaigns saved'} locally`,
    searchPlaceholder: 'Search by company, core business, subject...',
    onlyFavorites: 'Favorites Only',
    noSessions: 'No saved sessions found',
    noSessionsSub: 'Generate a new campaign to see it automatically archived here.',
    activeBadge: 'Active',
    securityNotice: 'Data Privacy & Local Storage: Zero customer data transmitted to 3rd-party servers.',
    exportJson: 'JSON',
    exportCsv: 'CSV',
    clearArchive: 'Clear Archive',
    confirmBtn: 'Confirm',
    cancelBtn: 'Cancel',
    
    settingsTitle: 'Sender Profile & Outbound Strategy',
    settingsSubtitle: 'Customize prompt variables and user experience preferences',
    senderSection: '1. Sender Identity (You & Your Company)',
    senderName: 'Your Full Name',
    senderCompany: 'Your Company / Offering',
    strategySection: '2. Outbound Strategy & Buyer Persona',
    targetRole: 'Default Target Role',
    copyTone: 'Copywriting Tone',
    ctaStyle: 'Call To Action (CTA) Style',
    outputLang: 'Desired Output Language',
    appearanceSection: '3. Customizable Visual Theme & Audio',
    soundFeedback: 'Web Audio API synthesized chimes on copy & complete',
    saveBtn: 'Save Settings',
    resetBtn: 'Reset Defaults',
    
    completedStatus: 'Request Completed Successfully',
    latencyLabel: 'Latency:',
    savedLocal: '✓ Saved Locally',
    offlineNotice: 'Offline Mode: Network unavailable. Cached sessions remain accessible locally.',
  },
  
  fr: {
    appTitle: 'LeadPulse B2B',
    appSubtitle: 'Sales Intelligence B2B & Séquences d’E-mails Outbound à Haute Conversion',
    badgeAi: 'Moteur de Sales Intelligence B2B',
    heroTitle: 'Générez des Séquences d’E-mails Outbound Ultra-Personnalisées',
    heroDesc: 'Collez le texte ou la page de présentation d’une entreprise cible. LeadPulse analyse son modèle économique, isole ses points de friction critiques et rédige une séquence en 2 étapes (Accroche AIDA + Relance à 3j) axée sur le ROI.',
    candidateBadge: 'Projet Portfolio • Christian Battistoni — Senior Full-Stack Engineer',
    recruiterBtn: 'Profil Candidat / RH',
    engineStatus: 'Moteur: Gemini 3.8 Flash',
    sessionsBtn: 'Sessions',
    settingsBtn: 'Paramètres & Profil',
    soundOn: 'Désactiver le son',
    soundOff: 'Activer le son',
    themeToggle: 'Changer le thème visuel',
    
    inputTitle: 'Informations sur l’Entreprise Cible',
    inputSubtitle: '(Collez le texte du site web, page "À propos", ou présentation produit)',
    inputPlaceholder: 'Exemple : Collez ici le texte du site cible, sa proposition de valeur, ses offres de services ou son résumé SaaS...',
    presetsLabel: 'Exemples prêts :',
    wordsLabel: 'mots',
    charsLabel: 'caractères',
    minCharsWarning: 'Au moins 20 caractères recommandés pour une analyse approfondie',
    clearBtn: 'Effacer',
    generateBtn: 'Générer la Campagne',
    generatingBtn: 'Analyse & Génération en cours...',
    targetRoleLabel: 'Profil Cible :',
    toneLabel: 'Ton :',
    ctaLabel: 'CTA :',
    
    progressStages: [
      'Analyse du Modèle d’Affaires & Segmentation Marché',
      'Identification de la Proposition de Valeur & ICP',
      'Détection des Points de Friction & Goulots Opérationnels',
      'Rédaction de la Séquence AIDA & Relance à J+3',
    ],
    
    analysisTitle: 'Analyse de Sales Intelligence',
    analysisSubtitle: 'Profilage stratégique et détection des points de douleur',
    copyAnalysisBtn: 'Copier l’Analyse',
    copiedBtn: 'Copié',
    coreBusinessLabel: '1. Cœur de Métier (Core Business)',
    valuePropLabel: '2. Proposition de Valeur',
    detectedPainsLabel: '3. Points de Friction Détectés',
    detectedPainsSub: 'Blocages opérationnels majeurs',
    strategyTitle: 'Stratégie Outbound :',
    strategyDesc: 'Les points de douleur identifiés sont directement traités dans les 2 e-mails grâce à l’approche AIDA et une relance basée sur les preuves.',
    
    sequenceTitle: 'Séquence Outbound à Haute Conversion',
    sequenceSubtitle: '2 e-mails ultra-personnalisés prêts à l’envoi',
    previewToggle: 'Aperçu Réel',
    variablesToggle: 'Variables',
    copyBothBtn: 'Copier les 2 E-mails',
    bothCopiedBtn: 'Séquence Copiée !',
    email1Badge: 'E-mail #1 • Accroche AIDA',
    email1Timing: 'Jour 1',
    email1Target: 'max 120 mots',
    email2Badge: 'E-mail #2 • Relance & Cas Client',
    email2Timing: 'Jour 4 (+3 jours)',
    email2Target: 'max 80 mots',
    subjectLabel: 'Objet :',
    copySubjectBtn: 'Copier l’Objet',
    bodyLabel: 'Corps du message :',
    readingTime1: '~30 sec de lecture',
    readingTime2: '~20 sec de lecture',
    openMailto: 'Ouvrir brouillon e-mail',
    copyTextBtn: 'Copier le texte',
    textCopiedBtn: 'Copié !',
    exportMarkdownBtn: 'Exporter la Séquence (.md)',
    
    drawerTitle: 'Historique des Sessions B2B',
    drawerSub: (count) => `${count} ${count === 1 ? 'campagne enregistrée' : 'campagnes enregistrées'} localement`,
    searchPlaceholder: 'Rechercher par entreprise, activité, objet...',
    onlyFavorites: 'Favoris Uniquement',
    noSessions: 'Aucune session enregistrée',
    noSessionsSub: 'Générez une nouvelle campagne pour la voir sauvegardée ici automatiquement.',
    activeBadge: 'Active',
    securityNotice: 'Confidentialité & Stockage Local : Aucune donnée client transmise à des tiers.',
    exportJson: 'JSON',
    exportCsv: 'CSV',
    clearArchive: 'Vider l’Historique',
    confirmBtn: 'Confirmer',
    cancelBtn: 'Annuler',
    
    settingsTitle: 'Profil Expéditeur & Stratégie Outbound',
    settingsSubtitle: 'Personnalisez les variables de génération et l’expérience utilisateur',
    senderSection: '1. Identité de l’Expéditeur (Vous & Votre Entreprise)',
    senderName: 'Votre Nom Complet',
    senderCompany: 'Votre Entreprise / Solution',
    strategySection: '2. Stratégie Outbound & Persona Ciblé',
    targetRole: 'Rôle Cible par Défaut',
    copyTone: 'Tonalité Rédactionnelle',
    ctaStyle: 'Style du Call-to-Action (CTA)',
    outputLang: 'Langue de Sortie Souhaitée',
    appearanceSection: '3. Thème Visuel Personnalisable & Audio',
    soundFeedback: 'Sons de confirmation synthétisés via Web Audio API',
    saveBtn: 'Enregistrer',
    resetBtn: 'Valeurs par Défaut',
    
    completedStatus: 'Demande Traitée avec Succès',
    latencyLabel: 'Latence :',
    savedLocal: '✓ Sauvegardé en Local',
    offlineNotice: 'Mode Hors-Ligne : Réseau indisponible. Vos sessions restent consultables en local.',
  },
};
