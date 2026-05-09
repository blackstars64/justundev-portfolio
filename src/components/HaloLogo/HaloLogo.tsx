'use client';

import Image from 'next/image';
import { useRef } from 'react';
import styles from './HaloLogo.module.scss';

interface Props {
  src:       string;
  labelPre:  string;
  labelPost: string;
}

export default function HaloLogo({ src, labelPre, labelPost }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--halo-x', `${x}%`);
    el.style.setProperty('--halo-y', `${y}%`);
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty('--halo-x');
    el.style.removeProperty('--halo-y');
  };

  return (
    <div
      ref={ref}
      className={styles.wrapper}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.halo} aria-hidden />
      <div className={styles.content}>
        <Image src={src} alt={`${labelPre}${labelPost} logo`} width={72} height={72} className={styles.logo} />
        <p className={styles.brand}>
          <span className={styles.pre}>{labelPre}</span>
          <span className={styles.post}>{labelPost}</span>
        </p>
      </div>
      <div className={styles.fade} aria-hidden />
    </div>
  );
}
