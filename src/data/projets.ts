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
  statut:      'En ligne' | 'En dev' | 'Archivé';
  image?:      string;
  lienDemo?:   string;
  lienRepo?:   string;
  sections:    ProjetSection[];
}

export const projets: Projet[] = [
  {
    slug:    'gardiens-arcana',
    titre:   "Gardiens d'Arcana",
    tagline: "Jeu de cartes roguelite desktop — battissez votre deck, affrontez les épreuves.",
    stack:   ['Tauri', 'React', 'TypeScript', 'SQLite', 'Rust'],
    statut:  'En dev',
    image:   '/projets/gardiens-arcana.png',
    lienDemo: undefined,
    lienRepo: undefined,

    sections: [
      {
        titre:   'Contexte',
        contenu: "Gardiens d'Arcana est un jeu de cartes roguelite solo développé en totale autonomie pour desktop (Windows, macOS, Linux). Chaque run est unique : le joueur bâtit son deck au fil de ses victoires, acquiert des reliques et découvre des synergies de cartes inédites. L'objectif est une sortie sur itch.io puis Steam. Actuellement en Phase 6 — moteur de combat.",
      },
      {
        titre:   'Architecture',
        contenu: "Le projet s'appuie sur Tauri pour packager une application desktop cross-platform à partir d'un backend Rust et d'un frontend React/TypeScript. Le backend Rust expose les Tauri Commands : résolution des effets de cartes, IA adverse, gestion des états de combat. SQLite embarqué assure la persistance locale des decks, sauvegardes de run et progression du joueur. Le frontend React orchestre les vues (lobby, deck builder, écran de combat) via des composants TypeScript fortement typés.",
      },
      {
        titre:   'Gameplay',
        contenu: "Roguelite au tour par tour : chaque partie démarre avec un deck de base, s'enrichit de nouvelles cartes après chaque victoire et se termine à la mort du personnage. Le deck builder permet de construire et filtrer ses cartes par type et élément. Le système d'effets chainés (on-play, on-death, on-draw) permet des combos et synergies puissantes entre cartes. L'IA adverse adapte ses choix selon l'état du plateau.",
      },
      {
        titre:   'Stack technique',
        contenu: "Rust — moteur de jeu, logique de combat, IA, persistance SQLite. React + TypeScript — interface utilisateur : lobby, deck builder, écran de combat. Tauri — wrapper desktop natif (bundler cross-platform, bridge Rust ↔ JS). SQLite — base de données locale embarquée pour les decks, sauvegardes et progression. Le tout compilé en un seul binaire natif par OS.",
      },
      {
        titre:   'Statut',
        contenu: "Phases 1 à 5 terminées (fondations, système de cartes, deck builder MVP, persistance SQLite, lobby et navigation). Phase 6 en cours : moteur de combat. Phases suivantes : IA adverse, roguelite loop complète, polishing animations, release itch.io. Avancement estimé : 55 %.",
      },
    ],
  },
  {
    slug:    'caskshop',
    titre:   'CaskShop',
    tagline: 'E-commerce vêtements neuf & occasion — headless Medusa v2, Stripe, Sendcloud, emails transactionnels.',
    stack:   ['TypeScript', 'Next.js 14', 'Medusa v2', 'PostgreSQL', 'Redis', 'Stripe', 'Sendcloud', 'Cloudinary', 'Resend'],
    statut:  'En dev',
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
    tagline: 'OS freelance local-first — planning, projets, facturation et Insight Engine IA intégré.',
    stack:   ['Tauri 2', 'Next.js 15', 'TypeScript', 'SCSS', 'SQLite', 'D3.js', 'Claude API', 'Resend'],
    statut:  'En dev',
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
        contenu: "Application desktop Tauri 2 : backend Rust léger + frontend Next.js 15 (App Router) packagé en natif. Persistance locale avec SQLite + better-sqlite3 — toutes les données restent sur la machine. L'Insight Engine tourne entièrement en local (5 analyzers : tâches, projets, business, temps/énergie, comportement). Claude API intervient uniquement pour le briefing matin et l'assistant IA — avec support BYOK (clé utilisateur chiffrée localement, coût zéro pour le produit). Dashboard D3.js pour les courbes CA/dépenses/bénéfice. Resend pour l'envoi automatique des factures PDF.",
      },
      {
        titre:   'Modules',
        contenu: "V1 : Daily Control Panel (NBA + score du jour + alertes), Planning semaine/mois (5 catégories colorées), Projets (fiches + % avancement + tâches liées), Quick Capture (ajout rapide accessible partout). V2 : Clients, Devis, Factures PDF auto (react-pdf + mentions légales FR), Dépenses avec OCR. V3 : Dashboard D3.js (CA, dépenses, bénéfice), IA Claude (briefing matin + assistant), BYOK settings (provider, modèle, clé chiffrée). V4 : automatisations Stripe/GitHub/URSSAF. V5 : SaaS multi-tenant, plans Free/Medium/Pro.",
      },
      {
        titre:   'Statut',
        contenu: "Projet en conception active — architecture et spécifications finalisées, phases planifiées jusqu'en 2027. Phase 0 (fondations : repo, DB, auth, Tauri) prévue pour juillet 2026. Le design s'appuie sur un logo 3D animé (gradient violet→bleu→argent) et un dashboard dark mode aux cards sombres avec halos violets.",
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
