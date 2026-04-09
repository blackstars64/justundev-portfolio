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
];

export function getProjet(slug: string): Projet | undefined {
  return projets.find(p => p.slug === slug);
}
