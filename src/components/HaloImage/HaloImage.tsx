'use client';

import Image from 'next/image';
import { useRef } from 'react';
import styles from './HaloImage.module.scss';

interface Props {
  src: string;
  alt: string;
}

export default function HaloImage({ src, alt }: Props) {
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
      <Image
        src={src}
        alt={alt}
        width={200}
        height={140}
        className={styles.img}
      />
      <div className={styles.fade} aria-hidden />
    </div>
  );
}
