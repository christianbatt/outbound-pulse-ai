# 🎯 Piano di Implementazione: Real B2B Company Intelligence & Deep Pain Points Engine

L'obiettivo è trasformare l'attuale generatore di email outbound in un **motore reale di Business Intelligence B2B**, eliminando punti di dolore generici o ripetitivi. Lo strumento analizzerà le peculiarità di ciascuna azienda target combinando **Web Scraping diretto del sito web**, **Google Search Grounding (Gemini)** per reperire notizie e contesto di mercato aggiornati, e un'analisi analitica approfondita dei colli di bottiglia (4-5 punti mirati per reparto).

---

### Verifiche Preliminari & Scelte Confermate (Fase 1)

> [!IMPORTANT]
> Decisioni confermate nella fase di chiarimento:
> - **Acquisizione Dati**: Web Scraping del sito target + Google Search Grounding con Gemini (`{ googleSearch: {} }`).
> - **Interfaccia Utente**: Campo dedicato URL dell'azienda con pulsante di estrazione e scraping istantaneo (con anteprima del testo estratto e badge delle fonti trovate).
> - **Diagnosi Punti Deboli**: Analisi B2B approfondita con 4-5 punti mirati, categorizzati per impatto operativo, scalabilità, tecnologia e mercato (SWOT-oriented).

---

## 1. Panoramica & Concetto di Business Analysis

L'utente (Sales Manager, Business Developer, Recruiter o SDR) non deve più affidarsi a template statici. 
Inserendo il sito web o la descrizione di un'azienda:
1. **Estrazione Real-Time**: Il server interroga il sito web della target company, estrae title, meta description, heading e sezioni di testo chiave (prodotti, casi d'uso, pricing, chi siamo).
2. **Grounding & Arricchimento**: Gemini analizza l'azienda con Google Search attivo per reperire annunci recenti, clienti tipici, stack tecnologico dichiarato e concorrenti diretti.
3. **Diagnosi Chirurgica dei Pain Points**: Invece delle solite 3 frasi standard ("silos di dati", "processi manuali"), l'output individua 4-5 criticità specifiche collegate all'offerta e al modello di business dell'azienda (es. complessità di compliance PSD2 per fintech, ritardi di dispatching per logistica, attrito di conversione PLG per SaaS developer-first).
4. **Sequenza Outbound Convertente**: Le email AIDA (Hook e Follow-up) agganciano direttamente le criticità e il valore estratto, citando metriche coerenti.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ARCHITETTURA DATI & ANALISI                     │
└────────────────────────────────────────────────────────────────────────┘

  [ Utente: Inserisce URL / Nome Azienda ]
                    │
                    ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  POST /api/scrape-company (Server Scraper)                  │
  │  - Fetch HTML + Parsing semantico pulito (meta, h1, body)   │
  │  - Rileva Industry, Value Proposition e Claim principali    │
  └────────────────────────┬────────────────────────────────────┘
                           │ Testo arricchito
                           ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  POST /api/generate (Business Analyst Engine)               │
  │                                                             │
  │  1. Google Gemini 3.8 Flash + Google Search Grounding       │
  │     - Query online su competitor, criticità e trend         │
  │     - Generazione JSON strutturato                          │
  │                                                             │
  │  2. Failover: Cerebras Cloud (Llama 3.3 70B)                │
  │  3. Failover: xAI Grok (grok-2)                             │
  │  4. Failover Euristico contestuale B2B                      │
  └────────────────────────┬────────────────────────────────────┘
                           │
                           ▼
  ┌─────────────────────────────────────────────────────────────┐
  │  UI Dashboard:                                              │
  │  - Scheda Business Intelligence (Core Business, Valore,     │
  │    4-5 Punti di Dolore specifici con etichette di reparto)  │
  │  - Fonti e URL analizzati in tempo reale                    │
  │  - Sequenza Email personalizzata (Hook + Follow-up)         │
  └─────────────────────────────────────────────────────────────┘
```

---

## 2. Esperienza Utente & Visual Design

1. **Nuovo Modulo "Target Company Intelligence"**:
   - Campo input URL ben visibile (`https://azienda.com`) con bottone dinamico `Estrai Dati Sito`.
   - Micro-stato di caricamento (`Scraping in corso...`).
   - Opzione per combinare o integrare il testo estratto con note manuali o requisiti custom.
2. **Badge Fonti Grounding**:
   - Visualizzazione chiara delle fonti web consultate o del dominio analizzato.
3. **Visualizzazione Punti di Dolore Iper-Specifici**:
   - Ogni pain point presenta:
     - Ambito di impatto (es. `Operazioni & Scalabilità`, `GTM & Commerciale`, `Integrazione Tech`, `Compliance & Riconciliazione`).
     - Spiegazione concreta del collo di bottiglia con il "perché" relativo all'azienda target.
     - Indicatore di urgenza/opportunità per l'Outbound.
4. **Coerenza con il Branding di Christian Battistoni**:
   - Rimane intatto il focus professionale: Sales Manager, Business Developer, Project Manager & AI Orchestrator.
   - Preservata la navigazione verso il demo live (`https://outboundpulse.ai.studio`) e il Recruiter Showcase.

---

## 3. Decisioni di Prodotto & Strategia Tecnica

- **Scraping server-side sicuro**:
  - Implementazione di un endpoint `/api/scrape-company` in `server.ts` con timeout rigoroso (7 secondi), sanitize dell'HTML (rimozione script, style, SVG, cookie banner), estrazione di meta tag OpenGraph e sezioni testuali rilevanti (fino a 4.000 caratteri puliti).
- **Integrazione Google Search Grounding**:
  - In `server.ts`, abilitazione del tool `{ googleSearch: {} }` nella chiamata `ai.models.generateContent` con modello `gemini-3.8-flash`.
  - Prompt di sistema arricchito con istruzioni da Senior Business Analyst: divieto assoluto di risposte generiche, obbligo di citare elementi distintivi dell'azienda e 4-5 punti di dolore categorizzati.
- **Resilienza Multi-Provider**:
  - Se Gemini ha limitazioni di quota, l'input arricchito dal web scraper passa ai provider di fallback (Cerebras Cloud Llama 3.3 70B o xAI Grok), garantendo che l'analisi rimanga iper-specifica anche in fallback perché nutrita dai dati reali del sito.

---

## 4. Fasi di Esecuzione del Piano

1. **Server (`server.ts`)**:
   - Aggiunta endpoint `/api/scrape-company` per estrazione sicura e pulizia testi da siti aziendali.
   - Integrazione di Google Search Grounding su Gemini 3.8 Flash per arricchimento contestuale.
   - Riprogettazione del system prompt analitico con richiesta di 4-5 punti di dolore specifici, categorie di reparto e contesto SWOT.
2. **Client Components**:
   - Aggiornamento di `CompanyInput.tsx`: inserimento del campo URL, pulsante di estrazione diretta con animazione di loading, stato di successo/errore e anteprima.
   - Aggiornamento di `types/index.ts`: supporto per 4-5 punti di dolore con metadati di categoria e fonti analizzate.
   - Aggiornamento di `AnalysisCard.tsx`: render visivo elegante delle categorie di dolore, impatto aziendale e fonti web utilizzate.
   - Aggiornamento di `i18n.ts`: traduzioni multilingua per il nuovo flusso URL/Scraper.
3. **Verifica & Compilazione**:
   - Test di compilazione con `compile_applet`.
   - Verifica di conformità TypeScript e build finale.
