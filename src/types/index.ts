export interface PainPointItem {
  pain: string;
  category?: 'operations' | 'technology' | 'commercial' | 'compliance' | 'scalability' | string;
  impact?: string;
}

export interface CompanyAnalysis {
  core_business: string;
  value_proposition: string;
  detected_pains: string[];
  detailed_pains?: PainPointItem[];
  target_url?: string;
  web_sources?: string[];
  swot_highlights?: {
    strengths?: string;
    vulnerabilities?: string;
  };
}

export interface EmailHook {
  subject: string;
  body: string;
}

export interface EmailFollowup {
  subject: string;
  body: string;
}

export interface EmailCampaign {
  email_1_hook: EmailHook;
  email_2_followup: EmailFollowup;
}

export interface GeneratedCampaignData {
  company_analysis: CompanyAnalysis;
  email_campaign: EmailCampaign;
}

export interface GenerationMetrics {
  latencyMs: number;
  model: string;
  completedAt: string;
  provider?: 'gemini' | 'cerebras' | 'grok';
  fallbackUsed?: boolean;
  fallbackNotice?: string;
}

export interface SessionRecord {
  id: string;
  companyName: string;
  inputText: string;
  data: GeneratedCampaignData;
  metrics: GenerationMetrics;
  createdAt: number;
  isFavorite?: boolean;
  tags?: string[];
}

export interface UserSettings {
  senderName: string;
  senderCompany: string;
  targetRole: string;
  tone: string;
  ctaStyle: string;
  language: string;
  locale: 'it' | 'en' | 'fr';
  theme: 'dark' | 'midnight' | 'obsidian' | 'light';
  soundEnabled: boolean;
  autoSave: boolean;
  recipientName: string;
  preferredProvider?: 'auto' | 'gemini' | 'cerebras' | 'grok';
  cerebrasApiKey?: string;
  grokApiKey?: string;
}

export interface PresetCompany {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  content: string;
}
