'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './EasterEgg.module.scss';

// ── Triggers ──────────────────────────────────────────────────────────────────

const KONAMI: string[] = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];
const SECRET = 'blackstars';

// ── Matrix chars ──────────────────────────────────────────────────────────────

const MATRIX_CHARS = '★☆✦✧◆▲●○∞≡λΨΩπμβ01アイウエオカキクケコ';

// ── Terminal lines ────────────────────────────────────────────────────────────

type Variant = 'glitch' | 'dim' | undefined;
type LineSpec = { text: string; variant?: Variant };

const LINES: LineSpec[] = [
  { text: '> accessing restricted layer...' },
  { text: '> identity: blackstars64', variant: 'glitch' },
  { text: '> signature: ★★★★★★★★★★' },
  { text: '' },
  { text: '[ ESC pour fermer ]', variant: 'dim' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function EasterEgg() {
  const [active, setActive] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  const konamiRef = useRef<string[]>([]);
  const bufRef = useRef('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // ── Global keyboard listener ──────────────────────────────────────────────

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setActive(false); return; }

      // Konami code
      konamiRef.current = [...konamiRef.current, e.key].slice(-KONAMI.length);
      if (konamiRef.current.join(',') === KONAMI.join(',')) {
        setActive(true);
        return;
      }

      // "blackstars" typed sequence
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        bufRef.current = (bufRef.current + e.key.toLowerCase()).slice(-SECRET.length);
        if (bufRef.current === SECRET) setActive(true);
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // ── Reset animation when toggled ──────────────────────────────────────────

  useEffect(() => {
    if (active) {
      setLineIdx(0);
      setCharIdx(0);
    }
  }, [active]);

  // ── Typewriter ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!active || lineIdx >= LINES.length) return;

    const line = LINES[lineIdx].text;
    // first char of first line: 600ms dramatic pause; between lines: 450ms; typing: 28ms
    const delay = charIdx === 0
      ? (lineIdx === 0 ? 600 : 450)
      : 28;

    const t = setTimeout(() => {
      if (charIdx < line.length) {
        setCharIdx(c => c + 1);
      } else {
        setLineIdx(l => l + 1);
        setCharIdx(0);
      }
    }, delay);

    return () => clearTimeout(t);
  }, [active, lineIdx, charIdx]);

  // ── Canvas matrix rain ────────────────────────────────────────────────────

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = 16;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    let cols = Math.floor(canvas.width / fontSize);
    let drops: number[] = Array.from({ length: cols }, () => Math.random() * -60);

    const handleResize = () => {
      resize();
      cols = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: cols }, () => Math.random() * -60);
    };
    window.addEventListener('resize', handleResize);

    const context = ctx;

    function draw() {
      context.fillStyle = 'rgba(10, 10, 10, 0.06)';
      context.fillRect(0, 0, canvas!.width, canvas!.height);

      drops.forEach((y, i) => {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const alpha = Math.random() * 0.55 + 0.2;
        context.fillStyle = `rgba(139, 92, 246, ${alpha})`;
        context.font = `${fontSize}px monospace`;
        context.fillText(char, i * fontSize, y * fontSize);

        if (y * fontSize > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5;
      });

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  if (!active) return null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className={styles.overlay}
      onClick={() => setActive(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Easter egg secret"
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <div className={styles.terminal} onClick={e => e.stopPropagation()}>
        {/* Window chrome */}
        <div className={styles.termBar}>
          <div className={styles.termDots} aria-hidden="true">
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
          <span className={styles.termTitle}>blackstars@terminal</span>
        </div>

        {/* Body */}
        <div className={styles.termBody}>
          {LINES.map((line, i) => {
            const isComplete = i < lineIdx;
            const isCurrent = i === lineIdx && lineIdx < LINES.length;
            const displayText = isComplete
              ? line.text
              : isCurrent
                ? line.text.slice(0, charIdx)
                : '';

            return (
              <div
                key={i}
                className={[
                  styles.line,
                  line.variant === 'glitch' && isComplete ? styles.glitch : '',
                  line.variant === 'dim' ? styles.dim : '',
                ].filter(Boolean).join(' ')}
                data-text={line.text}
              >
                {displayText}
                {isCurrent && <span className={styles.cursor} aria-hidden="true" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
