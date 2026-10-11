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

// Health endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Generate campaign endpoint
app.post('/api/generate', async (req, res) => {
  const startTime = Date.now();
  try {
    const {
      companyText,
      senderName,
      senderCompany,
      targetRole,
      tone,
      ctaStyle,
      language,
    } = req.body;

    if (!companyText || typeof companyText !== 'string' || companyText.trim().length === 0) {
      return res.status(400).json({ error: 'Il testo aziendale o URL della target company è obbligatorio.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Chiave GEMINI_API_KEY non configurata sul server. Configura la chiave in Impostazioni > Segreti.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `Sei il motore logico e l'esperto di Copywriting B2B di un'applicazione SaaS avanzata di Sales Intelligence. Il tuo obiettivo è analizzare le informazioni testuali di un'azienda target forniti dall'utente e generare sequenze di email di vendita outbound iper-personalizzate e ad alto tasso di conversione.

Il tuo output deve essere SEMPRE in formato JSON pulito, senza formattazione Markdown extra (niente \`\`\`json ... \`\`\`), in modo che l'applicazione possa leggerlo facilmente.

[PROCESSO DI ANALISI]
1. Identifica il Core Business dell'azienda target (B2B, B2C, SaaS, Marketplace, ecc.).
2. Individua la loro Value Proposition (Quale problema risolvono e per chi).
3. Determina i potenziali Pain Points (punti di dolore operativi o di business) che un Lead Growth o un Operations Manager potrebbe risolvere per loro.

[STRUTTURA DELL'OUTPUT RICHIESTO]
Devi restituire un oggetto JSON con la seguente struttura esatta:

{
  "company_analysis": {
    "core_business": "Breve descrizione del business dell'azienda",
    "value_proposition": "La proposta di valore individuata",
    "detected_pains": ["Pain point 1", "Pain point 2", "Pain point 3"]
  },
  "email_campaign": {
    "email_1_hook": {
      "subject": "Oggetto accattivante, breve (max 5 parole), focalizzato sul ROI o sul problema",
      "body": "Email basata sul framework AIDA (Attenzione, Interesse, Desiderio, Azione). Deve fare riferimento specifico alla loro value proposition. Lunghezza max 120 parole. CTA chiara e a basso attrito."
    },
    "email_2_followup": {
      "subject": "Re: Oggetto precedente o variazione sul dolore principale",
      "body": "Email di follow-up a distanza di 3 giorni. Porta un caso d'uso o un esempio di come aziende simili hanno risolto uno dei 'detected_pains'. Massimo 80 parole."
    }
  }
}

[LINEE GUIDA DI STILE PER LE EMAIL]
- Tono: Professionale, assertivo, orientato ai dati, tipico del settore Tech/SaaS.${tone ? ` Adotta lo specifico tono: ${tone}.` : ''}
- Lingua: ${language && language !== 'auto' ? `Genera categoricamente l'output in lingua: ${language}.` : 'Genera l\'output nella stessa lingua del testo aziendale fornito in input (prediligi l\'Italiano o l\'Inglese in base al contesto).'}
- Evita i cliché da venditore ("Spero che questa email vi trovi bene", "Siamo leader di mercato"). Vai dritto al punto aziendale.
${senderName ? `- Mittente: ${senderName}` : ''}
${senderCompany ? `- Azienda del mittente: ${senderCompany}` : ''}
${targetRole ? `- Ruolo o persona target: ${targetRole}` : ''}
${ctaStyle ? `- Stile Call To Action desiderato: ${ctaStyle}` : ''}`;

    const prompt = `Analizza il seguente testo aziendale target ed estrai la Sales Intelligence e la sequenza di email outbound:\n\n---\n${companyText}\n---`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            company_analysis: {
              type: Type.OBJECT,
              properties: {
                core_business: {
                  type: Type.STRING,
                  description: "Breve descrizione del business dell'azienda",
                },
                value_proposition: {
                  type: Type.STRING,
                  description: "La proposta di valore individuata",
                },
                detected_pains: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Elenco dei pain points operativi o di business rilevati",
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
                    subject: {
                      type: Type.STRING,
                      description: "Oggetto accattivante, breve (max 5 parole), focalizzato sul ROI o sul problema",
                    },
                    body: {
                      type: Type.STRING,
                      description: "Email basata sul framework AIDA. Max 120 parole. CTA a basso attrito.",
                    },
                  },
                  required: ['subject', 'body'],
                },
                email_2_followup: {
                  type: Type.OBJECT,
                  properties: {
                    subject: {
                      type: Type.STRING,
                      description: "Re: Oggetto precedente o variazione sul dolore principale",
                    },
                    body: {
                      type: Type.STRING,
                      description: "Email di follow-up a distanza di 3 giorni con caso d'uso o esempio concreto. Max 80 parole.",
                    },
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
      // Fallback cleaner if raw output contains markdown wrapping
      const cleaned = rawText.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    const durationMs = Date.now() - startTime;

    return res.json({
      success: true,
      data: parsedData,
      metrics: {
        latencyMs: durationMs,
        model: 'gemini-3.8-flash',
        completedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error generating campaign with Gemini API:', error);
    const durationMs = Date.now() - startTime;

    // Check if error is due to prepayment credits depleted (402), quota (429), or network
    const isCreditOrQuotaError =
      error?.status === 'RESOURCE_EXHAUSTED' ||
      String(error?.message || '').includes('402') ||
      String(error?.message || '').includes('prepayment') ||
      String(error?.message || '').includes('RESOURCE_EXHAUSTED') ||
      String(error?.message || '').includes('quota');

    if (isCreditOrQuotaError) {
      console.log('Utilizzo generatore euristico B2B fallback a causa di crediti/quota Gemini esauriti');
      const fallbackData = generateHeuristicB2BCampaign({
        companyText: req.body?.companyText || '',
        senderName: req.body?.senderName,
        senderCompany: req.body?.senderCompany,
        targetRole: req.body?.targetRole,
        tone: req.body?.tone,
        ctaStyle: req.body?.ctaStyle,
        language: req.body?.language,
      });

      return res.json({
        success: true,
        data: fallbackData,
        metrics: {
          latencyMs: durationMs,
          model: 'leadpulse-b2b-engine (Fallback Quota)',
          completedAt: new Date().toISOString(),
          quotaNotice: 'Crediti Gemini temporaneamente esauriti: analisi sintetizzata tramite motore euristico B2B integrato.',
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: error?.message || 'Si è verificato un errore durante la generazione della campagna.',
      metrics: {
        latencyMs: durationMs,
      },
    });
  }
});

// Heuristic B2B Sales Intelligence Generator
function generateHeuristicB2BCampaign(params: {
  companyText: string;
  senderName?: string;
  senderCompany?: string;
  targetRole?: string;
  tone?: string;
  ctaStyle?: string;
  language?: string;
}) {
  const { companyText, senderName = 'Marco Rossi', senderCompany = 'OmniGrowth B2B', targetRole = 'VP Operations', ctaStyle = 'breve confronto di 10 minuti' } = params;
  const lower = companyText.toLowerCase();

  let coreBusiness = 'Piattaforma Enterprise SaaS & Servizi Tecnologici B2B';
  let valueProp = 'Automazione dei processi operativi chiave e riduzione del carico manuale per massimizzare la scalabilità del team.';
  let pains = [
    'Frammentazione dei dati operativi e dipendenza da processi manuali soggetti a errore umano.',
    "Difficoltà di scalare il volume d'affari senza aumentare proporzionalmente l'headcount amministrativo.",
    'Mancanza di visibilità in tempo reale sui colli di bottiglia e metriche di produttività dei reparti.',
  ];

  if (lower.includes('fintech') || lower.includes('banca') || lower.includes('cassa') || lower.includes('cfo') || lower.includes('pagament')) {
    coreBusiness = 'SaaS FinTech B2B per automazione contabile, riconciliazione e gestione della liquidità';
    valueProp = 'Automatizza la riconciliazione bancaria multilivello e riduce i tempi di chiusura mensile per CFO e team finance.';
    pains = [
      'Tempi di chiusura finanziaria mensile prolungati con oltre 20 ore a settimana perse in riconciliazioni manuali.',
      'DSO (Days Sales Outstanding) elevato e ritardi nei flussi di cassa dovuti a solleciti di pagamento disorganizzati.',
      'Rischio di errori contabili e disallineamenti tra gateway di pagamento ed ERP aziendale.',
    ];
  } else if (lower.includes('logistic') || lower.includes('flott') || lower.includes('trasport') || lower.includes('iot') || lower.includes('camion')) {
    coreBusiness = 'Soluzioni telematiche IoT e software di ottimizzazione logistica per flotte di trasporto merci';
    valueProp = 'Ottimizza i percorsi di distribuzione e monitora consumi ed emissioni per ridurre i costi operativi della flotta.';
    pains = [
      'Costi di carburante e manutenzione non ottimizzati a causa di percorsi inefficienti e soste non pianificate.',
      'Mancanza di integrazione bidirezionale tra telematica di bordo e sistemi ERP / WMS centrali.',
      'Rischio di penali contrattuali e perdita di clienti per ritardi imprevisti nelle finestre di scarico.',
    ];
  } else if (lower.includes('hr') || lower.includes('talent') || lower.includes('risorse umane') || lower.includes('recruiting') || lower.includes('skill')) {
    coreBusiness = 'Enterprise HR Tech SaaS per talent mapping, internal mobility e upskilling';
    valueProp = 'Mappa le competenze interne della forza lavoro e riduce il turnover volontario attraverso percorsi di crescita guidati.';
    pains = [
      'Turnover elevato di figure tecniche senior causato da mancanza di visibilità sui percorsi di carriera interni.',
      'Silos informativi tra i dipartimenti aziendali con dispersione del know-how strategico.',
      'Basso tasso di adozione e completamento dei programmi di formazione aziendali tradizionali.',
    ];
  } else if (lower.includes('cyber') || lower.includes('sicurezza') || lower.includes('zero-trust') || lower.includes('gdpr') || lower.includes('nis2')) {
    coreBusiness = 'Soluzione SaaS di Identity & Access Management (IAM) e conformità normativa europea';
    valueProp = 'Protegge accessi privilegiati a server e cloud riducendo il rischio di data breach e garantendo conformità NIS2.';
    pains = [
      'Visibilità carente sulle credenziali privilegiate assegnate a collaboratori e fornitori terzi.',
      'Rischio di sanzioni severe per mancato adeguamento ai requisiti stringenti di NIS2 e GDPR.',
      'Tempi di risposta lunghi nella revoca degli accessi critici al termine delle collaborazioni.',
    ];
  }

  const subject1 = 'Ottimizzazione processi e ROI operativo';
  const body1 = `Ciao [Nome Lead],\n\nHo analizzato con interesse il modello operativo della vostra azienda e il modo in cui gestite la vostra value proposition nel settore.\n\nMolte realtà simili alla vostra riscontrano spesso una forte frizione legata a: "${pains[0]}".\n\nIn ${senderCompany} abbiamo strutturato un framework specifico per risolvere questo collo di bottiglia, consentendo ai team di tagliare i tempi morti operativi di oltre il 35% senza stravolgere i software già in uso.\n\nSaresti aperto a un ${ctaStyle} giovedì per valutare insieme se ha senso per la vostra roadmap?\n\nCordiali saluti,\n${senderName}`;

  const subject2 = 'Re: Ottimizzazione processi e ROI operativo';
  const body2 = `Ciao [Nome Lead],\n\nRiprendo brevemente la mia nota precedente.\n\nDi recente un'azienda comparabile alla vostra ha affrontato il problema di "${pains[1]}". Implementando il nostro approccio, hanno azzerato gli errori manuali e ottenuto un ritorno sull'investimento entro 45 giorni.\n\nPossiamo condividere un breve documento di benchmark operativo. Ha senso per te un rapido scambio di 5 minuti in settimana?\n\nUn saluto,\n${senderName}`;

  return {
    company_analysis: {
      core_business: coreBusiness,
      value_proposition: valueProp,
      detected_pains: pains,
    },
    email_campaign: {
      email_1_hook: {
        subject: subject1,
        body: body1,
      },
      email_2_followup: {
        subject: subject2,
        body: body2,
      },
    },
  };
}

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
