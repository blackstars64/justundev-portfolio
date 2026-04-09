import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projets, getProjet } from '@/data/projets';
import styles from './projet.module.scss';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projets.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const projet = getProjet(slug);
  if (!projet) return {};
  return {
    title: `${projet.titre} — Just'un Dev`,
    description: projet.tagline,
  };
}

export default async function ProjetPage({ params }: Props) {
  const { slug } = await params;
  const projet = getProjet(slug);
  if (!projet) notFound();

  return (
    <main>
      <article className={styles.page}>
        <div className={styles.glowTop} aria-hidden />

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <header className={styles.hero}>
          <div className={styles.inner}>
            <Link href="/projets" className={styles.back}>
              ← Projets
            </Link>

            <div className={styles.heroContent}>
              <span className={`${styles.statut} ${styles[`statut_${projet.statut.replace(' ', '_')}`]}`}>
                {projet.statut}
              </span>
              <h1 className={styles.titre}>{projet.titre}</h1>
              <p className={styles.tagline}>{projet.tagline}</p>

              <ul className={styles.stackList} role="list" aria-label="Stack technique">
                {projet.stack.map((tech) => (
                  <li key={tech} className={styles.stackBadge}>{tech}</li>
                ))}
              </ul>

              {(projet.lienDemo || projet.lienRepo) && (
                <div className={styles.links}>
                  {projet.lienDemo && (
                    <a
                      href={projet.lienDemo}
                      className={styles.btnPrimary}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Voir la démo
                    </a>
                  )}
                  {projet.lienRepo && (
                    <a
                      href={projet.lienRepo}
                      className={styles.btnOutline}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Code source
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Sections ──────────────────────────────────────────────────── */}
        <div className={styles.content}>
          <div className={styles.inner}>
            {projet.sections.map((section, i) => (
              <section key={section.titre} className={styles.section}>
                <div className={styles.sectionNumber} aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className={styles.sectionBody}>
                  <h2 className={styles.sectionTitre}>{section.titre}</h2>
                  <p className={`${styles.sectionContenu} ${section.contenu.startsWith('[PLACEHOLDER]') ? styles.placeholder : ''}`}>
                    {section.contenu}
                  </p>
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* ── Footer nav ────────────────────────────────────────────────── */}
        <div className={styles.footerNav}>
          <div className={styles.inner}>
            <Link href="/projets" className={styles.btnOutline}>
              ← Retour aux projets
            </Link>
            <Link href="/contact" className={styles.btnPrimary}>
              Discutons de votre projet
            </Link>
          </div>
        </div>

      </article>
    </main>
  );
}
