'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Nav.module.scss';

const NAV_LINKS = [
  { href: '/',          label: 'Home' },
  { href: '/projets',   label: 'Projects' },
  { href: '/stack',     label: 'Stack' },
  { href: '/dataviz',   label: 'Data' },
  { href: '/contact',   label: 'Contact' },
  { href: '/calendrier', label: 'RDV' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Ferme le menu si on redimensionne vers desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Bloque le scroll body quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
      role="banner"
    >
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoTag}>&lt;/&gt;</span>
          {' '}Just&apos;un Dev
        </Link>

        {/* Liens desktop */}
        <nav className={styles.links} aria-label="Navigation principale">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className={styles.link}>
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA desktop */}
        <Link href="/projets" className={styles.cta}>
          Voir mes projets
        </Link>

        {/* Burger mobile */}
        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Menu mobile plein écran */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className={styles.mobileLinks} aria-label="Navigation mobile">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={styles.mobileLink}
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/projets"
            className={styles.mobileCta}
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
          >
            Voir mes projets
          </Link>
        </nav>
      </div>
    </header>
  );
}
