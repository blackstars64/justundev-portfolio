'use client';

import { useRef, useState } from 'react';
import styles from './Hero.module.scss';

// ── Stack badges ──────────────────────────────────────────────────────────────
const STACK = ['TypeScript', 'React', 'Next.js', 'Node.js', 'D3.js', 'PostgreSQL', 'SCSS', 'Tauri'];

// ── Syntax token types ────────────────────────────────────────────────────────
type TK = 'kw' | 'fn' | 'ty' | 'cm' | 'pu' | 'va' | 'pr';
type Token = [TK | 'tx', string];
type Line = Token[];

const CODE: Line[] = [
  [['cm', '// app.ts']],
  [],
  [['kw', 'async'], ['tx', ' '], ['kw', 'function'], ['tx', ' '], ['fn', 'fetchData'], ['pu', '<'], ['ty', 'T'], ['pu', '>(']],
  [['tx', '  '], ['va', 'endpoint'], ['pu', ': '], ['ty', 'string'], ['pu', ',']],
  [['tx', '  '], ['va', 'options'], ['pu', '?: '], ['ty', 'RequestInit']],
  [['pu', '): '], ['ty', 'Promise'], ['pu', '<'], ['ty', 'T'], ['pu', '> {']],
  [['tx', '  '], ['kw', 'const'], ['tx', ' '], ['va', 'res'], ['tx', ' = '], ['kw', 'await'], ['tx', ' '], ['fn', 'fetch'], ['pu', '(']],
  [['tx', '    '], ['va', 'endpoint'], ['pu', ', '], ['va', 'options']],
  [['tx', '  '], ['pu', ');']],
  [['tx', '  '], ['kw', 'if'], ['tx', ' (!'], ['va', 'res'], ['pu', '.'], ['pr', 'ok'], ['tx', ') '], ['kw', 'throw'], ['tx', ' '], ['kw', 'new']],
  [['tx', '    '], ['ty', 'Error'], ['pu', '('], ['va', 'res'], ['pu', '.'], ['pr', 'statusText'], ['pu', ');']],
  [['tx', '  '], ['kw', 'return'], ['tx', ' '], ['va', 'res'], ['pu', '.'], ['fn', 'json'], ['pu', '() '], ['kw', 'as']],
  [['tx', '    '], ['ty', 'Promise'], ['pu', '<'], ['ty', 'T'], ['pu', '>;']],
  [['pu', '}']],
];

// Map token type → CSS module class name
function tokenClass(tk: TK | 'tx'): string | undefined {
  if (tk === 'tx') return undefined;
  const map: Record<TK, string> = {
    kw: styles.kw,
    fn: styles.fn,
    ty: styles.ty,
    cm: styles.cm,
    pu: styles.pu,
    va: styles.va,
    pr: styles.pr,
  };
  return map[tk as TK];
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Hero() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [hovering, setHovering] = useState(false);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = panelRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const rx = -(((e.clientY - top) / height) * 16 - 8); // ±8deg
    const ry = ((e.clientX - left) / width) * 16 - 8;
    setTilt({ rx, ry });
  }

  function onMouseLeave() {
    setHovering(false);
    setTilt({ rx: 0, ry: 0 });
  }

  return (
    <section className={styles.hero}>
      {/* Background glow */}
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        {/* ── Left column ── */}
        <div className={styles.content}>
          {/* Badge disponible */}
          <span className={styles.badge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            Disponible ✦
          </span>

          {/* Headline */}
          <h1 className={styles.headline}>
            Développeur<br />
            Full-Stack &amp; Data Viz.
          </h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            Je crée des applications modernes et des visualisations de données interactives.
          </p>

          {/* Tagline */}
          <p className={styles.tagline}>Simple à dire, sérieux à faire.</p>

          {/* CTAs */}
          <div className={styles.ctas}>
            <a href="#projets" className={styles.btnPrimary}>Voir mes projets</a>
            <a href="#contact" className={styles.btnOutline}>Me contacter</a>
          </div>

          {/* Stack badges */}
          <div className={styles.stack} role="list" aria-label="Stack technique">
            {STACK.map((tech) => (
              <span key={tech} role="listitem" className={styles.stackBadge}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right column — floating code panel ── */}
        <div
          ref={panelRef}
          className={styles.panelWrapper}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onMouseEnter={() => setHovering(true)}
          style={{
            transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: hovering ? 'transform 0.1s ease' : 'transform 0.3s ease',
          }}
          aria-hidden="true"
        >
          {/* Window chrome */}
          <div className={styles.panelBar}>
            <div className={styles.dots}>
              <span className={`${styles.dot} ${styles.dotRed}`} />
              <span className={`${styles.dot} ${styles.dotYellow}`} />
              <span className={`${styles.dot} ${styles.dotGreen}`} />
            </div>
            <span className={styles.filename}>app.ts</span>
            {/* spacer to visually center filename */}
            <div className={styles.dots} style={{ visibility: 'hidden' }} aria-hidden="true" />
          </div>

          {/* Code body */}
          <div className={styles.panelBody}>
            {/* Line numbers */}
            <div className={styles.lineNums} aria-hidden="true">
              {CODE.map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>

            {/* Highlighted code */}
            <div className={styles.codeArea}>
              {CODE.map((line, li) => (
                <div key={li} className={styles.codeLine}>
                  {line.length === 0
                    ? <>&nbsp;</>
                    : line.map(([tk, text], ti) => {
                        const cls = tokenClass(tk);
                        return cls
                          ? <span key={ti} className={cls}>{text}</span>
                          : <span key={ti}>{text}</span>;
                      })
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
