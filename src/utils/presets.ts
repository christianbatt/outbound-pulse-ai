import { PresetCompany } from '../types';

export const PRESET_COMPANIES: PresetCompany[] = [
  {
    id: 'fintech-saas',
    title: 'PayMetrics Cloud',
    category: 'Fintech SaaS B2B',
    shortDesc: 'Piattaforma di riconciliazione pagamenti e cash-flow automation per scaleup europee.',
    content: `PayMetrics Cloud è una piattaforma fintech B2B per CFO e team finance che automatizza la riconciliazione bancaria multilivello e le previsioni di cassa in tempo reale.
Connettiamo oltre 150 banche europee e gateway come Stripe, Adyen e PayPal direttamente a NetSuite e SAP.
I CFO e Finance Manager risparmiano oltre 20 ore a settimana nei periodi di chiusura mensile, eliminando gli errori manuali su fogli Excel. Tuttavia, molte aziende hanno ancora processi frammentati, ritardi nei solleciti di pagamento (DSO elevato) e difficoltà a scalare le operazioni contabili cross-border senza raddoppiare l'headcount amministrativo.`,
  },
  {
    id: 'logistics-iot',
    title: 'FleetPulse AI',
    category: 'Logistica & IoT',
    shortDesc: 'Ottimizzazione telematica e percorsi per flotte di trasporto merci B2B.',
    content: `FleetPulse AI fornisce soluzioni telematiche avanzate e algoritmi predittivi di routing per aziende di logistica e distribuzione merci su gomma.
Il software monitora in tempo reale consumi di carburante, manutenzione predittiva dei veicoli e tempi di sosta degli autisti tramite sensori IoT integrati.
Aiutiamo le flotte a ridurre i costi operativi del 14% e a rispettare le stringenti normative ESG sulle emissioni CO2. Le aziende del settore spesso faticano ad armonizzare i dati dei camion con i software ERP, affrontano rincari continui del carburante e perdono commesse a causa di mancati alert sui ritardi di consegna ai magazzini centrali.`,
  },
  {
    id: 'hr-talent-tech',
    title: 'SkillSphere B2B',
    category: 'HR Tech & Upskilling',
    shortDesc: 'Piattaforma AI per talent mapping e internal mobility per grandi aziende tecnologiche.',
    content: `SkillSphere è una piattaforma enterprise SaaS che aiuta i Chief People Officer e HR Director a mappare le competenze interne della forza lavoro e creare piani di mobilità interna automatizzati.
Utilizziamo grafi di conoscenza per identificare gap formativi prima che impattino la roadmap dei progetti software.
I nostri clienti riducono il turnover volontario del 18% e tagliano i costi di recruiting esterno. Tuttavia, gli HR Director lamentano che il 60% dei programmi di formazione aziendale tradizionali viene abbandonato, i dati sulle skill nei dipartimenti R&D rimangono a silos e la retention dei talenti senior è sempre più precaria.`,
  },
  {
    id: 'cybersec-cloud',
    title: 'SentinelGuard Zero-Trust',
    category: 'Cybersecurity Cloud',
    shortDesc: 'Protezione degli accessi privilegiati (PAM) e conformità NIS2 per PMI e medie imprese.',
    content: `SentinelGuard è una soluzione SaaS di Identity & Access Management (IAM) con architettura Zero-Trust concepita specificamente per aziende manifatturiere e tech del mercato europeo.
Garantiamo auditing continuo degli accessi a server, database e ambienti cloud AWS/Azure, assicurando piena conformità con le direttive europee NIS2 e GDPR.
Molti IT Manager e CISO hanno visibilità limitata sulle utenze temporanee concesse a fornitori esterni e temono multe pesanti e blocchi operativi in caso di ransomware originato da credenziali compromesse.`,
  },
];
