import { PresetCompany } from '../types';
import { Locale } from './i18n';

export const PRESET_COMPANIES_BY_LOCALE: Record<Locale, PresetCompany[]> = {
  it: [
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
  ],

  en: [
    {
      id: 'fintech-saas',
      title: 'PayMetrics Cloud',
      category: 'Fintech SaaS B2B',
      shortDesc: 'Multi-entity reconciliation and automated cash forecasting for European tech scaleups.',
      content: `PayMetrics Cloud is an enterprise B2B fintech platform designed for CFOs and finance teams to automate multi-entity bank reconciliations and real-time treasury cash flow forecasting.
We connect 150+ European banks and payment gateways (Stripe, Adyen, PayPal) directly into NetSuite and SAP.
Finance Directors save over 20 hours per week during month-end closes while eliminating spreadsheet human errors. However, mid-market CFOs still struggle with fragmented billing data, elevated Days Sales Outstanding (DSO), and the operational bottleneck of scaling international ledger entries without linearly doubling back-office headcount.`,
    },
    {
      id: 'logistics-iot',
      title: 'FleetPulse AI',
      category: 'Logistics & IoT',
      shortDesc: 'Predictive routing and IoT telemetry for commercial fleet dispatchers.',
      content: `FleetPulse AI delivers cutting-edge telematics and dynamic route optimization software for B2B road freight carriers and logistics distributors.
Using IoT vehicle sensors, our platform monitors live fuel burn, predictive engine maintenance, and driver rest intervals in real time.
We help fleet directors reduce operational expenditures by 14% while ensuring ESG carbon compliance. Common industry pain points include legacy disconnects between truck telematics and core ERP systems, uncontrollable diesel volatility, and severe penalties caused by late dock delivery notifications.`,
    },
    {
      id: 'hr-talent-tech',
      title: 'SkillSphere Enterprise',
      category: 'HR Tech & AI Mobility',
      shortDesc: 'AI-driven workforce skills ontology and internal career mobility for tech leaders.',
      content: `SkillSphere is an enterprise talent intelligence platform that empowers Chief People Officers and Engineering VPs to dynamically map technical competencies and build automated internal mobility tracks.
Our knowledge graph pinpoints critical engineering capability gaps before they stall product delivery.
Clients decrease voluntary attrition by 18% and slash agency recruitment spend. Still, HR leaders face the chronic challenge that 60% of traditional corporate L&D initiatives are abandoned, skill data remains locked inside isolated spreadsheets, and senior developer retention is increasingly volatile.`,
    },
    {
      id: 'cybersec-cloud',
      title: 'SentinelGuard Zero-Trust',
      category: 'Cybersecurity SaaS',
      shortDesc: 'Privileged Access Management (PAM) and automated NIS2 compliance for mid-market IT.',
      content: `SentinelGuard provides cloud-native Identity & Access Management (IAM) and Privileged Access Management (PAM) built for mid-sized European industrial and tech enterprises.
We enforce automated Zero-Trust just-in-time access auditing across hybrid AWS/Azure servers and production databases, guaranteeing compliance with EU NIS2 and GDPR frameworks.
CISO and IT Operations leaders are overwhelmed by manual credential audits, shadow IT contractor accounts, and the lingering threat of operational shutdowns from ransomware originating from dormant credentials.`,
    },
  ],

  fr: [
    {
      id: 'fintech-saas',
      title: 'PayMetrics Cloud',
      category: 'Fintech SaaS B2B',
      shortDesc: 'Réconciliation bancaire automatisée et prévisions de trésorerie pour scale-ups.',
      content: `PayMetrics Cloud est une solution SaaS B2B conçue pour les directeurs financiers (DAF) et les équipes comptables afin d’automatiser la réconciliation multi-bancaire et les prévisions de trésorerie en temps réel.
Nous connectons plus de 150 banques européennes et passerelles comme Stripe, Adyen et PayPal directement à NetSuite et SAP.
Les équipes financières économisent plus de 20 heures par semaine lors des clôtures mensuelles. Néanmoins, beaucoup d'entreprises souffrent encore de processus manuels sur Excel, d'un délai moyen de paiement (DSO) trop élevé et de difficultés à gérer leurs flux internationaux sans doubler leurs effectifs comptables.`,
    },
    {
      id: 'logistics-iot',
      title: 'FleetPulse AI',
      category: 'Logistique & IoT',
      shortDesc: 'Optimisation télématique des tournées et réduction des coûts de flotte.',
      content: `FleetPulse AI propose une solution télématique avancée et des algorithmes prédictifs de routage pour les transporteurs routiers et les distributeurs de fret B2B.
La plateforme surveille en temps réel la consommation de carburant, la maintenance prédictive et les temps de conduite des chauffeurs grâce à des capteurs IoT connectés.
Nous permettons aux exploitants de flotte de réduire leurs charges d'exploitation de 14 % tout en respectant les normes d'émissions CO2. Les défis majeurs restent la déconnexion entre les données télématiques et l'ERP central, ainsi que les pénalités contractuelles liées aux retards de livraison imprévus.`,
    },
    {
      id: 'hr-talent-tech',
      title: 'SkillSphere Entreprise',
      category: 'HR Tech & Mobilité Interne',
      shortDesc: 'Cartographie des compétences et mobilité interne assistée par IA.',
      content: `SkillSphere est une plateforme SaaS d'intelligence RH qui aide les Directeurs des Ressources Humaines (DRH) à cartographier les compétences des équipes techniques et à structurer des plans de mobilité interne automatisés.
Notre graphe de connaissances détecte les manques de compétences avant qu'ils ne ralentissent la livraison des projets informatiques.
Nos clients réduisent le turnover volontaire de 18 % et diminuent leurs dépenses de recrutement externe. Pourtant, les DRH constatent souvent que 60 % des formations classiques sont abandonnées et que la rétention des profils seniors demeure un défi complexe.`,
    },
    {
      id: 'cybersec-cloud',
      title: 'SentinelGuard Zero-Trust',
      category: 'Cybersécurité Cloud',
      shortDesc: 'Gestion des accès à privilèges (PAM) et conformité NIS2 pour ETI et PME européennes.',
      content: `SentinelGuard est une solution SaaS de gestion des identités et des accès (IAM) reposant sur une architecture Zero-Trust, spécifiquement pensée pour les ETI européennes.
Nous assurons un audit continu des accès aux serveurs cloud AWS/Azure et bases de données, garantissant la conformité stricte avec les directives européennes NIS2 et le RGPD.
Les RSSI et DSI manquent souvent de visibilité sur les accès accordés aux prestataires externes et craignent des arrêts d'activité critiques provoqués par des ransomwares exploitant des comptes dormants.`,
    },
  ],
};

export const PRESET_COMPANIES = PRESET_COMPANIES_BY_LOCALE.it;
