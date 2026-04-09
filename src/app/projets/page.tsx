import type { Metadata } from 'next';
import Link from 'next/link';
import { projets } from '@/data/projets';
import HaloImage from '@/components/HaloImage/HaloImage';
import styles from './projets.module.scss';

export const metadata: Metadata = {
  title: "Projets — Just'un Dev",
  description: 'Études de cas — projets fullstack réels : e-commerce, SaaS, outils IA.',
};

export default function ProjetsPage() {
  return (
    <main>
      <section className={styles.section}>
        <div className={styles.glow} aria-hidden />
        <div className={styles.inner}>

          <header className={styles.header}>
            <span className={styles.label}>Études de cas</span>
            <h1 className={styles.title}>Projets</h1>
            <p className={styles.desc}>
              Des projets concrets, du code en production, des choix techniques assumés.
            </p>
          </header>

          <ul className={styles.grid} role="list">
            {projets.map((projet) => (
              <li key={projet.slug}>
                <Link href={`/projets/${projet.slug}`} className={styles.card}>
                  {projet.image && (
                    <HaloImage src={projet.image} alt={`Logo ${projet.titre}`} />
                  )}
                  <div className={styles.cardTop}>
                    <span className={`${styles.statut} ${styles[`statut_${projet.statut.replace(' ', '_')}`]}`}>
                      {projet.statut}
                    </span>
                    <span className={styles.arrow} aria-hidden>→</span>
                  </div>
                  <h2 className={styles.cardTitle}>{projet.titre}</h2>
                  <p className={styles.cardTagline}>{projet.tagline}</p>
                  <ul className={styles.stackList} role="list" aria-label="Stack technique">
                    {projet.stack.map((tech) => (
                      <li key={tech} className={styles.stackBadge}>{tech}</li>
                    ))}
                  </ul>
                </Link>
              </li>
            ))}
          </ul>

        </div>
      </section>
    </main>
  );
}
