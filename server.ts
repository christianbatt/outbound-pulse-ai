import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

// Health endpoint returning status and active provider configurations
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    providers: {
      gemini: Boolean(process.env.GEMINI_API_KEY),
      cerebras: Boolean(process.env.CEREBRAS_API_KEY),
      grok: Boolean(process.env.GROK_API_KEY || process.env.XAI_API_KEY),
    },
    demoUrl: 'https://outboundpulse.ai.studio',
    timestamp: new Date().toISOString(),
  });
});

// Key verification endpoint for testing Cerebras or Grok keys live from settings
app.post('/api/verify-key', async (req, res) => {
  const { provider, apiKey } = req.body;
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length < 5) {
    return res.status(400).json({ valid: false, error: 'Chiave API non valida o troppo corta.' });
  }

  try {
    if (provider === 'cerebras') {
      const resp = await fetch('https://api.cerebras.ai/v1/models', {
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
      });
      if (resp.ok) {
        return res.json({ valid: true, provider: 'cerebras', message: 'Chiave Cerebras verificata con successo (Llama 3.3 70B attivo).' });
      }
      return res.status(resp.status).json({ valid: false, error: `Cerebras Cloud ha risposto con codice ${resp.status}: chiave non autorizzata.` });
    }

    if (provider === 'grok') {
      const resp = await fetch('https://api.x.ai/v1/models', {
        headers: { Authorization: `Bearer ${apiKey.trim()}` },
      });
      if (resp.ok) {
        return res.json({ valid: true, provider: 'grok', message: 'Chiave xAI Grok verificata con successo (grok-2 attivo).' });
      }
      return res.status(resp.status).json({ valid: false, error: `xAI Grok ha risposto con codice ${resp.status}: chiave non autorizzata.` });
    }

    return res.status(400).json({ valid: false, error: 'Provider non supportato.' });
  } catch (err: any) {
    return res.status(500).json({ valid: false, error: err.message || 'Errore di connessione durante la verifica della chiave.' });
  }
});

// Safe Web Scraping endpoint for extracting clean company intelligence from URL
app.post('/api/scrape-company', async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'URL del sito aziendale obbligatorio.' });
  }

  let formattedUrl = url.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = `https://${formattedUrl}`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(formattedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 LeadPulseBot/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'it,en;q=0.9',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Impossibile raggiungere il sito web (${response.status} ${response.statusText}). Verifica che l'indirizzo sia corretto.`,
      });
    }

    const html = await response.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract meta description
    const descMatch = html.match(/<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["'](?:description|og:description)["']/i);
    const metaDescription = descMatch ? descMatch[1].trim() : '';

    // Extract OpenGraph Site Name or Title
    const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
    const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : '';

    // Remove scripts, styles, SVG, noscript, comments, and navigations
    let cleanHtml = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ')
      .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, ' ')
      .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, ' ')
      .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, ' ');

    // Extract visible textual paragraphs and headings
    const tagMatches = cleanHtml.match(/<(?:h1|h2|h3|p|li)[^>]*>([^<]+)<\/(?:h1|h2|h3|p|li)>/gi) || [];
    const extractedSnippets = tagMatches
      .map(tag => tag.replace(/<[^>]+>/g, '').trim())
      .filter(txt => txt.length > 25 && !/cookie|privacy|accetta|cookie policy|terms of service|tutti i diritti/i.test(txt))
      .slice(0, 18);

    // Fallback if specific tags are scarce
    let bodyText = extractedSnippets.join('\n');
    if (bodyText.length < 150) {
      const stripped = cleanHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      bodyText = stripped.slice(0, 2500);
    } else if (bodyText.length > 3000) {
      bodyText = bodyText.slice(0, 3000);
    }

    const hostName = new URL(formattedUrl).hostname.replace(/^www\./, '');
    const siteHeadline = ogTitle || title || hostName;

    const synthesizedContext = `Azienda: ${siteHeadline} (${formattedUrl})\n` +
      (metaDescription ? `Descrizione / Tagline: ${metaDescription}\n` : '') +
      `Contenuto e offerte rilevate dal sito:\n${bodyText}`;

    return res.json({
      success: true,
      url: formattedUrl,
      title: siteHeadline,
      metaDescription,
      text: synthesizedContext,
      previewSnippets: extractedSnippets.slice(0, 5),
    });
  } catch (err: any) {
    console.error('Scraping error:', err);
    return res.status(500).json({
      error: err.name === 'AbortError'
        ? 'Timeout: il sito ha impiegato più di 8 secondi a rispondere.'
        : `Errore durante l'accesso al sito: ${err.message || 'Host irraggiungibile'}`,
    });
  }
});

// Helper to call Cerebras Cloud (Ultra-Fast Llama 3.3 70B)
async function callCerebras(params: {
  prompt: string;
  systemInstruction: string;
  apiKey: string;
}): Promise<any> {
  const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b',
      messages: [
        { role: 'system', content: params.systemInstruction },
        { role: 'user', content: params.prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Cerebras API Error (${response.status}): ${errorBody}`);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content || '';
  let parsed;
  try {
    parsed = JSON.parse(content.trim());
  } catch {
    const cleaned = content.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleaned);
  }
  return parsed;
}

// Helper to call xAI Grok (grok-2-latest)
async function callGrok(params: {
  prompt: string;
  systemInstruction: string;
  apiKey: string;
}): Promise<any> {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: 'grok-2-latest',
      messages: [
        { role: 'system', content: params.systemInstruction },
        { role: 'user', content: params.prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Grok (xAI) API Error (${response.status}): ${errorBody}`);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content || '';
  let parsed;
  try {
    parsed = JSON.parse(content.trim());
  } catch {
    const cleaned = content.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    parsed = JSON.parse(cleaned);
  }
  return parsed;
}

// Resilient heuristic B2B NLP analysis generator tailored to the specific text and domain
function generateFallbackCampaign(params: {
  companyText: string;
  senderName?: string;
  senderCompany?: string;
  targetRole?: string;
  tone?: string;
  ctaStyle?: string;
  language?: string;
}): any {
  const text = params.companyText.trim();
  const lower = text.toLowerCase();

  const firstSentence = text.split(/[.\n]/)[0] || '';
  const nameMatch = firstSentence.match(/^(?:Azienda:\s*)?([A-Za-z0-9\s\-]+?)(?:\s+(?:è|is|est|offre|helps|provides|un'azienda|a company|une entreprise|\())/i);
  const companyName = nameMatch ? nameMatch[1].trim() : (firstSentence.replace(/^(?:Azienda:\s*)/i, '').slice(0, 35).trim() || 'Azienda Target');

  // Deep domain and activity extraction
  let domain = 'B2B Tech & Enterprise Services';
  let specificActivity = 'soluzioni digitali B2B';

  if (lower.includes('fintech') || lower.includes('pagament') || lower.includes('bancari') || lower.includes('fattur') || lower.includes('payment') || lower.includes('reconciliation') || lower.includes('treasury')) {
    domain = 'Fintech B2B & Financial Infrastructure';
    specificActivity = 'automazione dei flussi finanziari e riconciliazione contabile';
  } else if (lower.includes('logist') || lower.includes('fleet') || lower.includes('trasport') || lower.includes('supply chain') || lower.includes('routing') || lower.includes('magazzin')) {
    domain = 'Supply Chain, Fleet & Logistics Tech';
    specificActivity = 'gestione della flotta, telematica e pianificazione consegne';
  } else if (lower.includes('hr') || lower.includes('talent') || lower.includes('assunzion') || lower.includes('payroll') || lower.includes('recruiting') || lower.includes('skills') || lower.includes('turnover')) {
    domain = 'HR Tech & People Operations';
    specificActivity = 'mappatura competenze, mobilità interna e retention dei talenti';
  } else if (lower.includes('cyber') || lower.includes('secur') || lower.includes('sicurezza') || lower.includes('compliance') || lower.includes('zero-trust') || lower.includes('nis2')) {
    domain = 'Cybersecurity, IAM & Cloud Compliance';
    specificActivity = 'gestione accessi privilegiati e conformità alle direttive di sicurezza';
  } else if (lower.includes('e-commerce') || lower.includes('marketplace') || lower.includes('checkout') || lower.includes('retail')) {
    domain = 'Digital Commerce & Omnichannel Retail';
    specificActivity = 'conversione del carrello, logistica dell\'ultimo miglio e fidelizzazione clienti';
  } else if (lower.includes('marketing') || lower.includes('crm') || lower.includes('sales') || lower.includes('funnel') || lower.includes('pipeline')) {
    domain = 'RevOps & MarTech Infrastructure';
    specificActivity = 'qualificazione dei lead e visibilità sul ciclo di vendita aziendale';
  } else if (lower.includes('manifattur') || lower.includes('industr') || lower.includes('fabbrica') || lower.includes('produzione') || lower.includes('iot')) {
    domain = 'Industry 4.0 & Smart Manufacturing';
    specificActivity = 'monitoraggio continuo delle linee produttive e riduzione dei tempi morti';
  }

  const isIt = params.language === 'Italiano' || (!params.language && (lower.includes(' è ') || lower.includes(' per ') || lower.includes(' che ') || lower.includes(' della ') || lower.includes(' una ') || lower.includes(' piattaforma ')));
  const isEn = params.language === 'English' || (!params.language && !isIt && (lower.includes(' the ') || lower.includes(' platform ') || lower.includes(' helps ') || lower.includes(' with ')));
  const isFr = params.language === 'Français' || (!params.language && !isIt && (lower.includes(' est une ') || lower.includes(' pour ') || lower.includes(' dans ') || lower.includes(' avec ') || lower.includes(' plateforme ')));

  const sender = params.senderName || (isEn ? 'Alex Morgan' : isFr ? 'Alexandre Dubois' : 'Marco Rossi');
  const senderComp = params.senderCompany || (isEn ? 'GrowthMatrix Solutions' : isFr ? 'Solutions GrowthMatrix' : 'GrowthMatrix Solutions');
  const cta = params.ctaStyle || (isEn ? '10-minute discovery call' : isFr ? 'échange de 10 minutes' : 'breve confronto di 10 minuti');

  // Extract tailored points from sentences inside the provided companyText
  const sentences = text.split(/[.\n]/).map(s => s.trim()).filter(s => s.length > 25);
  const coreHighlight = sentences[0] || `${companyName} innovates within ${domain}`;

  if (isEn) {
    const pains = [
      `Operational Bottlenecks: Disconnect between ${specificActivity} and enterprise legacy systems creating friction during scale.`,
      `Headcount & Overhead Scaling: Volume expansion requires proportional back-office personnel instead of automated straight-through processing.`,
      `Visibility & Real-Time Reporting: Decision-makers lack predictive dashboards to intercept drop-offs or process delays before customer impact.`,
      `Siloed Cross-Department Data: Critical metrics remain locked in fragmented tools, preventing cohesive alignment between operations and growth teams.`,
    ];
    return {
      company_analysis: {
        core_business: `${companyName} operates as a specialized player in ${domain}, delivering dedicated solutions for ${specificActivity}.`,
        value_proposition: `Streamlines mission-critical workflows in ${domain}, eliminating manual processing overhead and accelerating measurable ROI.`,
        detected_pains: pains,
        detailed_pains: [
          { pain: pains[0], category: 'operations', impact: 'High: direct impediment to daily operational velocity' },
          { pain: pains[1], category: 'scalability', impact: 'Critical: margins decrease as transaction volume grows' },
          { pain: pains[2], category: 'technology', impact: 'Medium-High: lack of predictive real-time telemetry' },
          { pain: pains[3], category: 'commercial', impact: 'High: cross-functional silos hinder client retention' },
        ],
      },
      email_campaign: {
        email_1_hook: {
          subject: `${companyName}: Eliminating operational friction?`,
          body: `Hi {{Recipient}},\n\nI was analyzing ${companyName}'s approach to ${domain} and was impressed by your value proposition in ${specificActivity}.\n\nWhen scaling transaction volume, operations leaders often hit hidden bottlenecks in legacy system integration and manual overhead.\n\nAt ${senderComp}, we helped peer enterprises streamline their core workflows, boosting processing velocity by 34%.\n\nOpen to a ${cta} next Tuesday to compare blueprints?\n\nBest,\n${sender}\n${senderComp}`,
        },
        email_2_followup: {
          subject: `Re: ${companyName}: Case benchmark (+34% velocity)`,
          body: `Hi {{Recipient}},\n\nFollowing up on my previous note. A quick benchmark: an operations director facing fragmented workflow friction at your scale automated their processes and cut cycle turnaround by 35% within 30 days.\n\nWould you have 10 minutes this Thursday for a brief walkthrough?\n\nBest,\n${sender}`,
        },
      },
    };
  }

  if (isFr) {
    const pains = [
      `Friction Opérationnelle : Désalignement entre les outils de ${specificActivity} et les systèmes ERP centraux.`,
      `Coûts d'Échelle Administratifs : L'augmentation des volumes contraint à embaucher plutôt qu'à automatiser de bout en bout.`,
      `Manque de Visibilité Prédictive : Absence de métriques consolidées en temps réel pour anticiper les blocages d'exécution.`,
      `Silos Métiers : Déconnexion persistante entre les équipes d'exploitation et les départements stratégiques.`,
    ];
    return {
      company_analysis: {
        core_business: `${companyName} se positionne comme un acteur clé dans le secteur ${domain}, optimisant ${specificActivity}.`,
        value_proposition: `Accélère la transformation opérationnelle et supprime la friction manuelle dans ${domain} pour les décideurs métiers.`,
        detected_pains: pains,
        detailed_pains: [
          { pain: pains[0], category: 'operations', impact: 'Élevé : ralentissement direct des cycles métiers' },
          { pain: pains[1], category: 'scalability', impact: 'Critique : érosion des marges lors de la croissance' },
          { pain: pains[2], category: 'technology', impact: 'Moyen-Élevé : déficit d\'observabilité en temps réel' },
          { pain: pains[3], category: 'commercial', impact: 'Élevé : silos entravant la fidélisation client' },
        ],
      },
      email_campaign: {
        email_1_hook: {
          subject: `${companyName} : Optimisation des opérations B2B`,
          body: `Bonjour {{Recipient}},\n\nEn analysant l'approche de ${companyName} dans le secteur ${domain}, j'ai particulièrement noté votre valeur ajoutée dans ${specificActivity}.\n\nLors de phases d'accélération, la réconciliation manuelle et la fragmentation des données ralentissent souvent les équipes.\n\nChez ${senderComp}, nous avons permis à des structures comparables d'éliminer 40% des frictions de traitement opérationnel.\n\nSeriez-vous ouvert à un ${cta} mardi prochain pour faire le point ?\n\nBien à vous,\n${sender}\n${senderComp}`,
        },
        email_2_followup: {
          subject: `Re: ${companyName} : Cas client similaire (+35% vélocité)`,
          body: `Bonjour {{Recipient}},\n\nJe me permets de faire suite à mon message. Une entreprise confrontée au même défi d'alignement opérationnel a réduit ses délais de traitement de 35% en moins de 3 semaines grâce à notre approche ciblée.\n\nSeriez-vous disponible 10 minutes ce jeudi pour un rapide partage d'expérience ?\n\nCordialement,\n${sender}`,
        },
      },
    };
  }

  // Italian default
  const pains = [
    `Attrito nei Flussi Operativi: Disallineamento tra gli strumenti di ${specificActivity} e i software legacy/ERP dell'azienda.`,
    `Scalabilità Lineare Non Sostenibile: All'aumento del volume di business corrisponde una crescita forzata dell'headcount operativo anziché una piena automazione.`,
    `Mancanza di Visibilità Predittiva: I decision maker faticano a ottenere indicatori in tempo reale prima che i colli di bottiglia impattino i clienti o i partner.`,
    `Silos Informativi Interdipartimentali: Dati critici frammentati su strumenti diversi che rallentano la capacità di risposta commerciale e post-vendita.`,
  ];

  return {
    company_analysis: {
      core_business: `${companyName} è una realtà attiva nel mercato ${domain}, specializzata in ${specificActivity}.`,
      value_proposition: `Risolve la complessità operativa in ${domain}, velocizzando i tempi di rilascio ed eliminando colli di bottiglia manuali ad alto rischio di errore.`,
      detected_pains: pains,
      detailed_pains: [
        { pain: pains[0], category: 'operations', impact: 'Elevato: rallentamento diretto dei tempi di ciclo' },
        { pain: pains[1], category: 'scalability', impact: 'Critico: erosione marginalità con l\'aumento delle transazioni' },
        { pain: pains[2], category: 'technology', impact: 'Medio-Alto: assenza di telemetria e alert proattivi' },
        { pain: pains[3], category: 'commercial', impact: 'Elevato: ritardi nella customer experience' },
      ],
    },
    email_campaign: {
      email_1_hook: {
        subject: `${companyName}: Scalare le operazioni senza attriti?`,
        body: `Ciao {{Recipient}},\n\nAnalizzando il posizionamento di ${companyName} in ${domain}, ho apprezzato molto la vostra value proposition in ${specificActivity}.\n\nCon la crescita dei volumi, i responsabili operativi si trovano spesso a gestire colli di bottiglia nella riconciliazione e silos informativi tra reparti.\n\nIn ${senderComp} abbiamo supportato realtà analoghe a ridurre del 38% i tempi di elaborazione senza incrementare l'organico.\n\nSaresti aperto a un ${cta} martedì per confrontare i rispettivi approcci?\n\nUn cordiale saluto,\n${sender}\n${senderComp}`,
      },
      email_2_followup: {
        subject: `Re: ${companyName}: Benchmark operativo (+35% velocità)`,
        body: `Ciao {{Recipient}},\n\nFaccio seguito alla mia precedente email. Un caso concreto: un team analogo che affrontava la frammentazione dei flussi in ${domain} ha automatizzato la riconciliazione, riducendo i tempi di ciclo del 35% in meno di 30 giorni.\n\nAvresti 10 minuti giovedì per dare uno sguardo rapido alla soluzione adottata?\n\nA presto,\n${sender}`,
      },
    },
  };
}

// Generate campaign endpoint with Gemini and Cerebras + Grok fallbacks
app.post('/api/generate', async (req, res) => {
  const startTime = Date.now();
  const {
    companyText,
    senderName,
    senderCompany,
    targetRole,
    tone,
    ctaStyle,
    language,
    preferredProvider = 'auto',
    cerebrasApiKey: clientCerebrasKey,
    grokApiKey: clientGrokKey,
  } = req.body;

  if (!companyText || typeof companyText !== 'string' || companyText.trim().length === 0) {
    return res.status(400).json({ error: 'Il testo aziendale o URL della target company è obbligatorio.' });
  }

  const cerebrasKey = (clientCerebrasKey && clientCerebrasKey.trim()) || process.env.CEREBRAS_API_KEY;
  const grokKey = (clientGrokKey && clientGrokKey.trim()) || process.env.GROK_API_KEY || process.env.XAI_API_KEY;

  const systemInstruction = `Sei il motore logico e l'esperto di Copywriting B2B e Senior Business Analyst di un'applicazione SaaS avanzata di Sales Intelligence. Il tuo obiettivo è analizzare le informazioni testuali o il sito di un'azienda target forniti dall'utente (e arricchiti con dati di mercato reali) e generare una diagnosi strategica approfondita e sequenze di email di vendita outbound iper-personalizzate e ad alto tasso di conversione.

Il tuo output deve essere SEMPRE in formato JSON pulito, senza formattazione Markdown extra (niente \`\`\`json ... \`\`\`), in modo che l'applicazione possa leggerlo direttamente.

[PROCESSO DI ANALISI CRITICA - NO RISPOSTE GENERICHE]
1. Identifica il Core Business dell'azienda target in modo specifico (modello, mercato, settore e tipologia di clienti ideali B2B).
2. Individua la loro Value Proposition specifica (quale problema risolvono, in quale mercato e con quale differenziale competitivo).
3. Determina da 4 a 5 Pain Points (punti di debolezza / criticità operative, scalabilità, commerciali o tecnologiche) IPER-SPECIFICI per l'azienda analizzata e per la sua nicchia. NON generare frasi generiche o cliché (come 'gestione manuale' o 'mancanza di tempo'). Indica per ciascun pain point:
   - La descrizione chiara del collo di bottiglia specifico
   - La categoria di impatto: 'operations', 'scalability', 'technology', 'commercial', oppure 'compliance'
   - L'impatto aziendale stimato (es. 'Alto: rallenta il rilascio release', 'Critico: espansione ostacolata da costi back-office').
4. Aggiungi un rapido confronto SWOT (Punti di forza emersi e Vulnerabilità principali).

[STRUTTURA DELL'OUTPUT RICHIESTO]
Devi restituire un oggetto JSON con la seguente struttura:

{
  "company_analysis": {
    "core_business": "Descrizione approfondita e precisa del business aziendale",
    "value_proposition": "La proposta di valore distintiva individuata",
    "detected_pains": [
      "Criticità specifica 1 con dettaglio operativo",
      "Criticità specifica 2 su scalabilità o architettura",
      "Criticità specifica 3 su conformità o processi",
      "Criticità specifica 4 su disallineamento commerciale o dati"
    ],
    "detailed_pains": [
      { "pain": "Descrizione 1", "category": "operations", "impact": "Alto" },
      { "pain": "Descrizione 2", "category": "scalability", "impact": "Critico" },
      { "pain": "Descrizione 3", "category": "technology", "impact": "Medio-Alto" },
      { "pain": "Descrizione 4", "category": "commercial", "impact": "Alto" }
    ],
    "swot_highlights": {
      "strengths": "Punti di forza competitivi emersi",
      "vulnerabilities": "Vulnerabilità o gap operativi principali"
    }
  },
  "email_campaign": {
    "email_1_hook": {
      "subject": "Oggetto accattivante, breve (max 5 parole), focalizzato sul ROI o sul problema",
      "body": "Email basata sul framework AIDA (Attenzione, Interesse, Desiderio, Azione). Deve fare riferimento specifico alla loro value proposition e a uno dei pain point rilevati. Lunghezza max 120 parole. CTA chiara e a basso attrito."
    },
    "email_2_followup": {
      "subject": "Re: Oggetto precedente o variazione sul dolore principale",
      "body": "Email di follow-up a distanza di 3 giorni. Porta un caso d'uso o un esempio di come aziende simili hanno risolto uno dei 'detected_pains'. Massimo 80 parole."
    }
  }
}

[LINEE GUIDA DI STILE PER LE EMAIL]
- Tono: Professionale, assertivo, orientato ai dati, tipico del settore Tech/SaaS.${tone ? ` Adotta lo specifico tono: ${tone}.` : ''}
- Lingua: ${language && language !== 'auto' ? `Genera categoricamente l'output in lingua: ${language}.` : 'Genera l\'output nella stessa lingua del testo aziendale fornito in input (prediligi l\'Italiano o l\'Inglese o il Francese in base al contesto).'}
- Evita i cliché da venditore ("Spero che questa email vi trovi bene", "Siamo leader di mercato"). Vai dritto al punto aziendale.
${senderName ? `- Mittente: ${senderName}` : ''}
${senderCompany ? `- Azienda del mittente: ${senderCompany}` : ''}
${targetRole ? `- Ruolo o persona target: ${targetRole}` : ''}
${ctaStyle ? `- Stile Call To Action desiderato: ${ctaStyle}` : ''}`;

  const prompt = `Analizza la seguente azienda target ed esegui un'analisi approfondita di Sales Intelligence identificando 4-5 punti di dolore precisi e la sequenza di email outbound:\n\n---\n${companyText}\n---`;

  // 1. Explicit Cerebras selection
  if (preferredProvider === 'cerebras') {
    if (!cerebrasKey) {
      return res.status(400).json({ error: 'Cerebras API Key non configurata. Inserisci la chiave nelle Impostazioni o nel modulo Fallback.' });
    }
    try {
      const parsedData = await callCerebras({ prompt, systemInstruction, apiKey: cerebrasKey });
      return res.json({
        success: true,
        data: parsedData,
        metrics: {
          latencyMs: Date.now() - startTime,
          model: 'llama-3.3-70b (Cerebras Cloud)',
          provider: 'cerebras',
          completedAt: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      console.warn('Cerebras explicit run failed:', err?.message);
      // If Cerebras fails, attempt Grok or fallback
      if (grokKey) {
        try {
          const parsedData = await callGrok({ prompt, systemInstruction, apiKey: grokKey });
          return res.json({
            success: true,
            data: parsedData,
            metrics: {
              latencyMs: Date.now() - startTime,
              model: 'grok-2-latest (xAI)',
              provider: 'grok',
              completedAt: new Date().toISOString(),
              fallbackUsed: true,
              fallbackNotice: 'Cerebras non disponibile. Generato tramite fallback xAI Grok.',
            },
          });
        } catch {}
      }
      return res.status(500).json({ success: false, error: err.message, provider: 'cerebras' });
    }
  }

  // 2. Explicit Grok selection
  if (preferredProvider === 'grok') {
    if (!grokKey) {
      return res.status(400).json({ error: 'Grok API Key non configurata. Inserisci la chiave nelle Impostazioni o nel modulo Fallback.' });
    }
    try {
      const parsedData = await callGrok({ prompt, systemInstruction, apiKey: grokKey });
      return res.json({
        success: true,
        data: parsedData,
        metrics: {
          latencyMs: Date.now() - startTime,
          model: 'grok-2-latest (xAI)',
          provider: 'grok',
          completedAt: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      console.warn('Grok explicit run failed:', err?.message);
      if (cerebrasKey) {
        try {
          const parsedData = await callCerebras({ prompt, systemInstruction, apiKey: cerebrasKey });
          return res.json({
            success: true,
            data: parsedData,
            metrics: {
              latencyMs: Date.now() - startTime,
              model: 'llama-3.3-70b (Cerebras Cloud)',
              provider: 'cerebras',
              completedAt: new Date().toISOString(),
              fallbackUsed: true,
              fallbackNotice: 'Grok non disponibile. Generato tramite fallback Cerebras Cloud.',
            },
          });
        } catch {}
      }
      return res.status(500).json({ success: false, error: err.message, provider: 'grok' });
    }
  }

  // 3. Automatic Orchestration: Primary Path is Google Gemini 3.8 Flash with Google Search Grounding
  let geminiError: any = null;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (geminiApiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey: geminiApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.25,
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              company_analysis: {
                type: Type.OBJECT,
                properties: {
                  core_business: { type: Type.STRING },
                  value_proposition: { type: Type.STRING },
                  detected_pains: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  detailed_pains: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        pain: { type: Type.STRING },
                        category: { type: Type.STRING },
                        impact: { type: Type.STRING },
                      },
                      required: ['pain'],
                    },
                  },
                  swot_highlights: {
                    type: Type.OBJECT,
                    properties: {
                      strengths: { type: Type.STRING },
                      vulnerabilities: { type: Type.STRING },
                    },
                  },
                },
                required: ['core_business', 'value_proposition', 'detected_pains'],
              },
              email_campaign: {
                type: Type.OBJECT,
                properties: {
                  email_1_hook: {
                    type: Type.OBJECT,
                    properties: {
                      subject: { type: Type.STRING },
                      body: { type: Type.STRING },
                    },
                    required: ['subject', 'body'],
                  },
                  email_2_followup: {
                    type: Type.OBJECT,
                    properties: {
                      subject: { type: Type.STRING },
                      body: { type: Type.STRING },
                    },
                    required: ['subject', 'body'],
                  },
                },
                required: ['email_1_hook', 'email_2_followup'],
              },
            },
            required: ['company_analysis', 'email_campaign'],
          },
        },
      });

      const rawText = response.text || '';
      let parsedData;
      try {
        parsedData = JSON.parse(rawText.trim());
      } catch {
        const cleaned = rawText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      }

      // Extract web sources from grounding metadata if available
      const webSources: string[] = [];
      const searchChunks = (response.candidates?.[0] as any)?.groundingMetadata?.groundingChunks;
      if (Array.isArray(searchChunks)) {
        for (const chunk of searchChunks) {
          if (chunk?.web?.uri && !webSources.includes(chunk.web.uri)) {
            webSources.push(chunk.web.uri);
          }
        }
      }

      if (parsedData?.company_analysis && webSources.length > 0) {
        parsedData.company_analysis.web_sources = webSources;
      }

      return res.json({
        success: true,
        data: parsedData,
        metrics: {
          latencyMs: Date.now() - startTime,
          model: 'gemini-3.8-flash (Google Search Grounded)',
          provider: 'gemini',
          completedAt: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      console.warn('Gemini attempt failed, activating Cerebras / Grok / Heuristic fallback:', err?.message);
      geminiError = err;
    }
  } else {
    geminiError = new Error('Chiave GEMINI_API_KEY non configurata sul server.');
  }

  // --- AUTOMATIC FALLBACK STAGE 1: Cerebras Cloud (Llama 3.3 70B) ---
  if (cerebrasKey) {
    try {
      console.log('Attivazione fallback automatico: Cerebras Cloud (Llama 3.3 70B)...');
      const parsedData = await callCerebras({ prompt, systemInstruction, apiKey: cerebrasKey });
      return res.json({
        success: true,
        data: parsedData,
        metrics: {
          latencyMs: Date.now() - startTime,
          model: 'llama-3.3-70b (Cerebras Cloud)',
          provider: 'cerebras',
          completedAt: new Date().toISOString(),
          fallbackUsed: true,
          fallbackNotice: 'Generato con successo tramite Cerebras Cloud (Llama 3.3 70B - Fallback da Gemini)',
        },
      });
    } catch (cerebrasErr: any) {
      console.warn('Cerebras fallback failed:', cerebrasErr.message);
    }
  }

  // --- AUTOMATIC FALLBACK STAGE 2: xAI Grok (grok-2-latest) ---
  if (grokKey) {
    try {
      console.log('Attivazione fallback automatico: Grok xAI (grok-2-latest)...');
      const parsedData = await callGrok({ prompt, systemInstruction, apiKey: grokKey });
      return res.json({
        success: true,
        data: parsedData,
        metrics: {
          latencyMs: Date.now() - startTime,
          model: 'grok-2-latest (xAI)',
          provider: 'grok',
          completedAt: new Date().toISOString(),
          fallbackUsed: true,
          fallbackNotice: 'Generato con successo tramite xAI Grok (grok-2 - Fallback da Gemini)',
        },
      });
    } catch (grokErr: any) {
      console.warn('Grok fallback failed:', grokErr.message);
    }
  }

  // --- AUTOMATIC FALLBACK STAGE 3: Resilient B2B Heuristic Intelligence Engine ---
  // When Gemini has depleted prepaid credits / 402 / 429 and neither Cerebras nor Grok keys are supplied,
  // we generate the campaign via deterministic NLP heuristics so the user and recruiters can ALWAYS test the app!
  console.log('Attivazione fallback euristico resiliente B2B (crediti Gemini esauriti o nessuna chiave esterna)...');
  const fallbackData = generateFallbackCampaign({
    companyText,
    senderName,
    senderCompany,
    targetRole,
    tone,
    ctaStyle,
    language,
  });

  const isQuotaDepleted = String(geminiError?.message || '').includes('402') ||
    String(geminiError?.message || '').includes('prepayment') ||
    geminiError?.status === 'RESOURCE_EXHAUSTED';

  return res.json({
    success: true,
    data: fallbackData,
    metrics: {
      latencyMs: Date.now() - startTime,
      model: 'B2B Sales Engine (Resilient Fallback)',
      provider: 'gemini',
      completedAt: new Date().toISOString(),
      fallbackUsed: true,
      fallbackNotice: isQuotaDepleted
        ? 'Crediti prepagati Gemini esauriti per questo ambiente. Campagna generata con il motore euristico di Sales Intelligence. Puoi inserire una chiave API di Cerebras (Llama 3.3) o Grok (xAI) nelle Impostazioni per inferenza LLM completa.'
        : 'Generato con il motore euristico di Sales Intelligence (Gemini non ha risposto). Inserisci le chiavi Cerebras o Grok come fallback avanzato.',
    },
  });
});

// Start Express server and connect Vite in development
async function startServer() {
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
