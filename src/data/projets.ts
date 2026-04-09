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
    tagline: 'E-commerce de spiritueux avec moteur de recommandations IA',
    stack:   ['Next.js', 'Node.js', 'MySQL', 'Medusa v2', 'Resend', 'Groq llama-3.1-8b'],
    statut:  'En dev',
    lienDemo: undefined,  // [PLACEHOLDER] ajouter URL démo quand disponible
    lienRepo: undefined,  // [PLACEHOLDER] ajouter URL repo si public

    sections: [
      {
        titre:   'Contexte',
        contenu: '[PLACEHOLDER] Décrire le contexte du projet CaskShop : client, objectif, marché ciblé (ex. cavistes indépendants, collectionneurs de whisky…).',
      },
      {
        titre:   'Problème',
        contenu: '[PLACEHOLDER] Quel problème concret le projet résout-il ? Ex. : les clients peinent à trouver un spiritueux adapté à leurs goûts parmi un catalogue de 500+ références.',
      },
      {
        titre:   'Solution',
        contenu: 'Plateforme e-commerce fullstack construite sur Medusa v2 (headless commerce) avec un moteur de recommandations piloté par Groq llama-3.1-8b. Les emails transactionnels sont gérés via Resend. Le frontend Next.js consomme les APIs Medusa et expose une interface de recherche enrichie.',
      },
      {
        titre:   'Stack technique',
        contenu: 'Next.js (frontend + SSR) · Node.js (services custom) · MySQL sur port 5433 · Medusa v2 (catalogue, panier, commandes) · Resend (emails transactionnels) · Groq API avec llama-3.1-8b (génération de descriptions SEO et recommandations produit).',
      },
      {
        titre:   'Résultats',
        contenu: '[PLACEHOLDER] Ajouter des métriques ou résultats mesurables : ex. temps de génération des descriptions produit, taux de conversion, nombre de SKU gérés, retours client…',
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
