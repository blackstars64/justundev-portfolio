// =============================================================================
// projets.ts — Données des études de cas
// =============================================================================

export interface ProjetSection {
  titre: string;
  contenu: string;
}

export interface Projet {
  slug:        string;
  titre:       string;
  tagline:     string;
  stack:       string[];
  statut:      'En ligne' | 'En dev' | 'En pause' | 'Archivé';
  image?:      string;
  logo?:       string;
  lienDemo?:   string;
  lienRepo?:   string;
  sections:    ProjetSection[];
}

export const projets: Projet[] = [
  {
    slug:    'blacktcg',
    titre:   'BlackTCG',
    tagline: "Marketplace de cartes TCG Pokémon — concurrent Cardmarket avec une meilleure UX et un système de paiement intégré.",
    stack:   ['Next.js 16', 'TypeScript', 'Apollo Server 4', 'SCSS', 'GSAP', 'Express 5', 'Prisma 7', 'PostgreSQL', 'Stripe Connect', 'NextAuth v5'],
    statut:  'En dev',
    logo:    '/projets/blacktcg-logo.svg',
    lienDemo: undefined,
    lienRepo: undefined,

    sections: [
      {
        titre:   'Contexte',
        contenu: "BlackTCG est une marketplace de cartes Pokémon TCG développée en autonomie complète. L'idée : proposer une alternative à Cardmarket avec une expérience utilisateur supérieure — navigation fluide, catalogue visuel riche et un système de paiement intégré via wallet. Le projet vise à couvrir tout le cycle : dépôt d'annonces, catalogue filtrée, panier, checkout sécurisé et gestion des expéditions.",
      },
      {
        titre:   'Architecture',
        contenu: "Architecture full-stack découplée : frontend Next.js 16 (App Router, SSR/SSG hybride) + backend Express 5 avec Apollo Server 4 en GraphQL. La base PostgreSQL est gérée via Prisma 7 et hébergée sur Neon (serverless). L'authentification est assurée par NextAuth v5 côté client et JWT côté API GraphQL. Le wallet vendeur est connecté à Stripe Connect via webhooks sécurisés. Les animations visuelles sont orchestrées par GSAP — header, hero, cartes catalogue avec effets 3D.",
      },
      {
        titre:   'Fonctionnalités livrées',
        contenu: "M1 setup : monorepo Next.js + Express, SCSS design system, stores Zustand. M2 schema : 25 tables PostgreSQL + seed (102 cartes Base Set). M3 auth : JWT backend + NextAuth v5 frontend, guards GraphQL. M4 wallet : wallet service + Stripe Connect + webhook queue worker. M5 catalogue : pages /cartes et /cartes/[slug] — grille 5 colonnes, filtres multi-sélect, tri, vue liste/compact, ActiveFiltersBar, mode mobile complet. Interface premium : header transparent→opaque au scroll, BandeauCreateurs, TrendingSection, HomeHero GSAP.",
      },
      {
        titre:   'En cours',
        contenu: "M6 marketplace : module order/ (checkout wallet atomique, confirmShipment, confirmReception, cron HOLD J+7), listing CRUD complet, pages /panier · /checkout · /mes-achats · /mes-ventes · /vendre. Prochaine étape : merger M6 → dev, tester le cycle d'achat complet en conditions réelles.",
      },
    ],
  },
  {
    slug:    'gardiens-arcana',
    titre:   "Gardiens d'Arcana",
    tagline: "Jeu de cartes multijoueur en ligne — construisez votre deck, défiez d'autres joueurs en temps réel.",
    stack:   ['Node.js', 'TypeScript', 'WebSocket', 'SQLite', 'JWT', 'Godot 4'],
    statut:  'En dev',
    image:   '/projets/gardiens-arcana.png',
    lienDemo: undefined,
    lienRepo: undefined,

    sections: [
      {
        titre:   'Contexte',
        contenu: "Gardiens d'Arcana est un jeu de cartes multijoueur en ligne développé en autonomie complète. V2 du projet : après une première version solo en Godot, la refonte introduit un serveur autoritaire Node.js qui centralise toute la logique de jeu — règles, effets de cartes, matchmaking — pour garantir la cohérence d'état entre les deux joueurs connectés en temps réel. Cible : itch.io puis Steam.",
      },
      {
        titre:   'Architecture',
        contenu: "Serveur Node.js TypeScript autoritaire : le GameEngine valide chaque action, résout les effets de cartes (on-play, on-death, on-draw, player_choice) et synchronise l'état de partie via WebSocket. RoomManager en file FIFO pour le matchmaking. AuthService JWT + bcrypt avec base SQLite. Le client Godot 4 ne contient aucune logique de jeu — il affiche l'état reçu du serveur et envoie les intentions du joueur. Architecture en couches : types → GameState → CombatResolver → ActionValidator → EffectSystem.",
      },
      {
        titre:   'Avancement',
        contenu: "6 phases sur 10 terminées. Phase 0 : fondations TypeScript, config prod/preprod/dev. Phase 1 : GameEngine — 55 tests, 23 effets de cartes validés. Phase 2 : WebSocket — CardDatabase, RoomManager, serveur WS. Phase 3 : Auth — AuthService JWT + bcrypt, 66 tests. Phase 4 : rate limiting + sécurité réseau. Phase 5 : client Godot connecté (NetworkManager, GameStateCache, rendu cartes réelles). Phase 6 : decks persistants + profils + DeckBuilder Godot — 103 tests. Avancement : 60 %.",
      },
      {
        titre:   'Prochaines étapes',
        contenu: "Phase 7 : UX/UI — animations de combat, transitions, polishing interface Godot. Phase 8 : tests d'intégration + équilibrage des cartes. Phase 9 : déploiement VPS Hetzner + sortie itch.io sous Just'un Dev. Phase 10 : live service — ranked, saisons, gacha.",
      },
    ],
  },
  {
    slug:    'caskshop',
    titre:   'CaskShop',
    tagline: 'E-commerce vêtements neuf & occasion — headless Medusa v2, Stripe, Sendcloud, emails transactionnels.',
    stack:   ['TypeScript', 'Next.js 14', 'Medusa v2', 'PostgreSQL', 'Redis', 'Stripe', 'Sendcloud', 'Cloudinary', 'Resend'],
    statut:  'En pause',
    image:   '/projets/caskshop.png',
    lienDemo: undefined,
    lienRepo: undefined,

    sections: [
      {
        titre:   'Contexte',
        contenu: "CaskShop est un e-commerce full-stack dédié à la vente de vêtements (neuf & occasion), objets et jeux pour enfants, développé en autonomie complète. L'objectif : construire une boutique souveraine — sans dépendance à Shopify ou WooCommerce — avec un catalogue maîtrisé, un tunnel de paiement intégré et une gestion des expéditions directement connectée au transporteur. Le projet est structuré en monorepo Turborepo (storefront, admin, backend) et déployé en production sur VPS Hetzner.",
      },
      {
        titre:   'Problème',
        contenu: "Les solutions e-commerce packagées imposent leurs contraintes : commissions, limites d'extension, architecture fermée. L'enjeu était de construire une plateforme headless complète : découpler le storefront Next.js 14 du backend commerce (Medusa v2), intégrer Stripe pour le paiement sécurisé, Sendcloud pour les flux d'expédition et Resend pour les emails transactionnels (confirmation, expédition, remboursement) — le tout en TypeScript strict.",
      },
      {
        titre:   'Résultats',
        contenu: "Architecture headless opérationnelle : Medusa v2 gère catalogue, panier et commandes via API REST ; Next.js 14 consomme les endpoints côté storefront. Paiement Stripe intégré avec webhooks (confirmation commande, remboursement). Expédition automatisée via Sendcloud : génération d'étiquettes, numéro de suivi injecté dans l'email client. Emails transactionnels Resend sur trois événements : commande placée, colis expédié, remboursement. Images produits hébergées sur Cloudinary. CI/CD GitHub Actions avec environnement preprod sur Railway.",
      },
    ],
  },
  {
    slug:    'digigame',
    titre:   'DigiGame',
    tagline: 'Jeu de collection Digimon — gratter, découvrir, collecter. Projet d\'examen Wild Code School.',
    stack:   ['React', 'Redux', 'Node.js', 'Express', 'MySQL', 'JWT', 'Sass', 'Docker'],
    statut:  'Archivé',
    lienRepo: 'https://github.com/blackstars64/DigiGame',

    sections: [
      {
        titre:   'Contexte',
        contenu: "DigiGame est mon projet d'examen de fin de formation à la Wild Code School — titre Concepteur Développeur d'Applications (Bac+3). Réalisé en équipe dans un délai contraint, c'est mon premier projet fullstack complet : de l'authentification à la base de données, en passant par un panel admin et un chat temps réel. Le niveau de l'époque n'est pas celui d'aujourd'hui, mais c'est ce projet qui a posé les bases de tout ce qui a suivi.",
      },
      {
        titre:   'Stack technique',
        contenu: "React + Redux (frontend SPA) · Node.js + Express (API REST) · MySQL (persistance) · JWT (authentification stateless) · Sass (styles) · Docker (containerisation et déploiement). Un stack classique mais complet pour un premier projet fullstack — chaque brique a été découverte et intégrée dans le cadre de la formation.",
      },
      {
        titre:   'Fonctionnalités',
        contenu: "Système de grattage de cartes : l'utilisateur révèle aléatoirement un Digimon caché et l'ajoute à sa collection. Économie virtuelle : des DigiPoints sont gagnés à chaque découverte et peuvent être réinvestis pour obtenir de nouvelles cartes. Gestion de collection : visualisation de toutes les cartes obtenues, progression vers le Pokédex complet. Auth JWT : inscription, connexion, sessions persistantes. Panel admin : gestion des cartes, des utilisateurs et des stocks. Chat temps réel : les joueurs peuvent échanger pendant leurs sessions.",
      },
      {
        titre:   'Ce que ça m\'a appris',
        contenu: "C'est avec DigiGame que j'ai vraiment compris ce que signifie construire une application de bout en bout. Connecter un frontend React à une API Express, sécuriser des routes avec JWT, modéliser une base MySQL, écrire des migrations — tout ça en équipe et sous contrainte de temps. Ce projet m'a aussi appris que le code d'examen a ses limites : depuis, j'ai progressé sur la qualité du code, l'architecture, les tests et les outils (TypeScript, Docker avancé, Tauri…). DigiGame reste l'artefact honnête du début du parcours.",
      },
    ],
  },
  {
    slug:    'blackdesk',
    titre:   'BlackDesk',
    tagline: 'OS freelance local-first — planning, projets, Insight Engine IA et Daily Control Panel.',
    stack:   ['Tauri 2', 'Next.js 16', 'TypeScript', 'SCSS', 'SQLite', 'Vitest', 'Claude API', 'Resend'],
    statut:  'En pause',
    image:   '/projets/blackdesk.png',
    lienDemo: undefined,
    lienRepo: undefined,

    sections: [
      {
        titre:   'Contexte',
        contenu: "BlackDesk est un système d'exécution et de décision conçu pour les développeurs freelances. L'idée centrale : ne plus se demander quoi faire. L'outil agrège planning, projets, tâches, clients et données business dans une application desktop native (Tauri 2), analyse le tout en local et produit en permanence une Next Best Action — la chose la plus importante à faire maintenant. Objectif à moyen terme : transformer la version personnelle en SaaS pour freelances FR.",
      },
      {
        titre:   'Problème résolu',
        contenu: "Un freelance jongle en permanence entre plusieurs contextes : missions client, admin, prospection, contenu. Les outils classiques (Notion, Trello, Excel) stockent l'information mais n'aident pas à décider. BlackDesk résout ça avec un Insight Engine local : scoring des tâches (impact × 0.4 + urgence × 0.4 + risque × 0.2), détection automatique des problèmes (projet inactif, dépendance client, surcharge) et génération de recommandations actionnables — sans cloud, sans abonnement, sans latence.",
      },
      {
        titre:   'Architecture',
        contenu: "Application desktop Tauri 2 : backend Rust léger + frontend Next.js 16 (App Router) packagé en natif. Persistance locale via tauri-plugin-sql (SQLite) — toutes les données restent sur la machine. Architecture Repository Pattern : domain (entités Zod), infra (repos SQLite), application (use cases). L'Insight Engine tourne entièrement en local (5 analyzers : tâches, projets, business, temps/énergie, comportement). Claude API uniquement pour le briefing matin et l'assistant IA — support BYOK (clé chiffrée localement). 189 tests Vitest, CI/CD GitHub Actions, branches main / preprod / develop.",
      },
      {
        titre:   'Ce qui est livré',
        contenu: "Phase 0 complète : auth locale (bcryptjs + React Context), schéma SQLite 9 tables, backup automatique Tauri (24h, rétention 7j), CI/CD. Phase 1 en cours : Daily Control Panel (NBA toujours visible, score du jour, alertes, KPI cards), Planning semaine avec 5 catégories colorées et tâches flottantes, Fiches projets (% avancement, deadline, création/suppression), Quick Capture global (Ctrl+K). Design dark mode — logo 3D gradient violet→bleu→argent, cards sombres, halos violets.",
      },
      {
        titre:   'Prochaines étapes',
        contenu: "Phase 1 fin : vue mois, tâches récurrentes, lien tâche→projet. Phase 2 : Clients, Devis, Factures PDF (react-pdf, mentions légales FR), Dépenses avec OCR. Phase 3 : Dashboard D3.js (CA, dépenses, bénéfice), IA Claude (briefing matin + assistant), BYOK settings. Phase 4 : automatisations Stripe/GitHub/URSSAF. Phase 5 (2027) : SaaS multi-tenant, plans Free/Medium/Pro, RGPD complet.",
      },
    ],
  },
  {
    slug:    'tiktok-live-game',
    titre:   'TikTok Live Game',
    tagline: 'Jeu interactif où les spectateurs d\'un live TikTok influencent la partie en temps réel.',
    stack:   ['Node.js', 'JavaScript', 'TikTok Live Connector', 'Flask', 'WebSocket'],
    statut:  'Archivé',
    lienDemo: undefined,
    lienRepo: undefined,

    sections: [
      {
        titre:   'Contexte',
        contenu: "TikTok Live Game est un projet expérimental personnel imaginé pour transformer un live TikTok en expérience de jeu collective. L'idée : les spectateurs ne regardent plus passivement — ils votent, offrent des cadeaux et déclenchent des événements qui modifient la partie en cours. Le projet explore l'intersection entre streaming en direct et gamedesign participatif.",
      },
      {
        titre:   'Problème résolu',
        contenu: "L'API TikTok Live est peu documentée et ne fournit pas de SDK officiel pour les événements temps réel (votes, cadeaux, commentaires). Le défi technique était de capturer ces événements de façon fiable, les interpréter rapidement et les injecter dans la logique de jeu sans introduire de latence perceptible pour les spectateurs. Il fallait également gérer les pics d'engagement (rush de cadeaux simultanés) sans saturer le système.",
      },
      {
        titre:   'Architecture technique',
        contenu: "Le projet s'articule en deux couches communicantes via WebSocket. Un service Node.js embarque TikTok Live Connector pour s'abonner aux événements du live (commentaires, likes, cadeaux). Il normalise les données et les transmet en temps réel à un bridge Flask (Python) qui héberge la logique de jeu. Flask reçoit chaque événement, applique les règles (cooldowns par type de cadeau, système de combos, compteurs cumulatifs) et renvoie l'état de jeu mis à jour au client. Ce découplage Node ↔ Flask permet d'itérer sur la logique de jeu indépendamment du connecteur TikTok.",
      },
      {
        titre:   'Ce que j\'ai appris',
        contenu: "Ce projet m'a confronté à l'event-driven programming dans un contexte où la source d'événements est externe et non maîtrisée (API non officielle, volumes variables). J'ai appris à concevoir un système résilient face aux pics d'engagement : debounce, cooldowns, file d'attente d'événements. La communication bidirectionnelle Node↔Flask via WebSocket m'a aussi donné une vision concrète des architectures multi-process et des contraintes de synchronisation d'état entre deux runtimes différents.",
      },
    ],
  },
];

export function getProjet(slug: string): Projet | undefined {
  return projets.find(p => p.slug === slug);
}
