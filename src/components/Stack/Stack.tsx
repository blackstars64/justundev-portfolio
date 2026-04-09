// =============================================================================
// Stack.tsx — Page /stack : technologies & outils
// =============================================================================

import TechIcon from './TechIcon';
import styles from './Stack.module.scss';

// ── Types ─────────────────────────────────────────────────────────────────────

type Level = 'Senior' | 'Pro' | 'Maîtrise';
type Category = 'Langages' | 'Frameworks & Librairies' | 'Outils & BDD';

interface Tech {
  name: string;
  level: Level;
  category: Category;
  color: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const TECHS: Tech[] = [
  // Langages
  { name: 'TypeScript', level: 'Senior',   category: 'Langages',                 color: '#3B82F6' },
  { name: 'HTML',       level: 'Senior',   category: 'Langages',                 color: '#F97316' },

  // Frameworks & Libs
  { name: 'React',      level: 'Senior',   category: 'Frameworks & Librairies',  color: '#38BDF8' },
  { name: 'Next.js',    level: 'Senior',   category: 'Frameworks & Librairies',  color: '#E2E8F0' },
  { name: 'Node.js',    level: 'Pro',      category: 'Frameworks & Librairies',  color: '#4ADE80' },
  { name: 'D3.js',      level: 'Pro',      category: 'Frameworks & Librairies',  color: '#FB923C' },
  { name: 'SCSS',       level: 'Senior',   category: 'Frameworks & Librairies',  color: '#E879A0' },
  { name: 'Apollo',     level: 'Pro',      category: 'Frameworks & Librairies',  color: '#A78BFA' },

  // Outils & BDD
  { name: 'SQLite',     level: 'Pro',      category: 'Outils & BDD',            color: '#38BDF8' },
  { name: 'MySQL',      level: 'Pro',      category: 'Outils & BDD',            color: '#22D3EE' },
  { name: 'Git',        level: 'Senior',   category: 'Outils & BDD',            color: '#F87171' },
  { name: 'Figma',      level: 'Maîtrise', category: 'Outils & BDD',            color: '#C084FC' },
];

const CATEGORIES: Category[] = [
  'Langages',
  'Frameworks & Librairies',
  'Outils & BDD',
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Stack() {
  return (
    <section className={styles.stack}>
      {/* Decorative glows */}
      <div className={styles.glowLeft}  aria-hidden="true" />
      <div className={styles.glowRight} aria-hidden="true" />

      <div className={styles.inner}>

        {/* ── Header ── */}
        <header className={styles.header}>
          <span className={styles.eyebrow}>Technologies</span>
          <h1 className={styles.title}>
            Ma <span className={styles.titleAccent}>Stack</span>
          </h1>
          <p className={styles.subtitle}>
            Les outils avec lesquels je construis — du back-end au rendu de données,
            en passant par le design et les pipelines de déploiement.
          </p>
        </header>

        {/* ── Categories ── */}
        {CATEGORIES.map((cat) => {
          const techs = TECHS.filter((t) => t.category === cat);
          return (
            <div key={cat} className={styles.category}>
              <h2 className={styles.catTitle}>{cat}</h2>

              <ul className={styles.grid} role="list">
                {techs.map((tech, i) => (
                  <li
                    key={tech.name}
                    className={styles.card}
                    style={{ '--delay': `${i * 0.07}s` } as React.CSSProperties}
                  >
                    {/* Icon container */}
                    <div
                      className={styles.iconWrap}
                      style={{ '--tech-color': tech.color } as React.CSSProperties}
                    >
                      <TechIcon name={tech.name} color={tech.color} />
                    </div>

                    {/* Name */}
                    <span className={styles.techName}>{tech.name}</span>

                    {/* Level badge */}
                    <span className={`${styles.level} ${styles[`level${tech.level}`]}`}>
                      {tech.level}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
