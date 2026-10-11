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
    if (!rawText) {
      throw new Error('Nessuna risposta testuale generata dal modello Gemini.');
    }

    let parsedData;
    try {
      parsedData = JSON.parse(rawText.trim());
    } catch {
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
    console.error('Gemini API Error:', error);
    const durationMs = Date.now() - startTime;

    const errorMsg = String(error?.message || '');
    let userFriendlyError = 'Si è verificato un errore durante la chiamata a Gemini API.';
    let errorCode = error?.status || 'API_ERROR';

    if (errorMsg.includes('402') || errorMsg.includes('prepayment') || error?.status === 'RESOURCE_EXHAUSTED') {
      errorCode = 'CREDITS_EXHAUSTED';
      userFriendlyError = 'Crediti di pre-pagamento API Gemini esauriti per questo progetto. Ricarica i crediti o gestisci la fatturazione su Google AI Studio (https://ai.studio/projects).';
    } else if (errorMsg.includes('429') || errorMsg.includes('quota') || errorMsg.includes('RATE_LIMIT')) {
      errorCode = 'RATE_LIMITED';
      userFriendlyError = 'Limite di richieste (rate-limit) raggiunto. Attendi qualche istante e riprova.';
    } else if (errorMsg.includes('401') || errorMsg.includes('API_KEY_INVALID')) {
      errorCode = 'INVALID_API_KEY';
      userFriendlyError = 'Chiave API Gemini non valida o scaduta.';
    } else if (errorMsg) {
      userFriendlyError = errorMsg;
    }

    return res.status(500).json({
      success: false,
      error: userFriendlyError,
      errorCode,
      metrics: {
        latencyMs: durationMs,
      },
    });
  }
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
