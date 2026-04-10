'use client';

import { useState } from 'react';
import styles from './contact.module.scss';

const RULES = {
  nom:     { min: 2,   max: 80   },
  message: { min: 20,  max: 2000 },
};

export default function ContactClient() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // anti-bot
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function validate(): string | null {
    if (nom.trim().length < RULES.nom.min) return `Le nom doit faire au moins ${RULES.nom.min} caractères.`;
    if (nom.trim().length > RULES.nom.max) return `Le nom ne peut pas dépasser ${RULES.nom.max} caractères.`;
    if (!email.trim()) return "L'email est requis.";
    if (message.trim().length < RULES.message.min) return `Le message doit faire au moins ${RULES.message.min} caractères.`;
    if (message.trim().length > RULES.message.max) return `Le message ne peut pas dépasser ${RULES.message.max} caractères.`;
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setErrorMsg(err); return; }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, message, honeypot }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur');
      setStatus('success');
      setNom(''); setEmail(''); setMessage('');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : "Erreur lors de l'envoi.");
    }
  }

  const msgLen = message.trim().length;
  const msgOk  = msgLen >= RULES.message.min;

  return (
    <section className={styles.section}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.inner}>

        {/* Left — info */}
        <div className={styles.info}>
          <span className={styles.label}>Contact</span>
          <h1 className={styles.title}>Travaillons ensemble</h1>
          <p className={styles.desc}>
            Un projet, une question, une mission freelance — je réponds sous 24h.
          </p>
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <strong>Disponibilité</strong> Juillet 2026
            </div>
            <div className={styles.metaItem}>
              <strong>Type</strong> Freelance · Remote
            </div>
            <div className={styles.metaItem}>
              <strong>Spécialités</strong> React · Next.js · Node.js · D3.js
            </div>
          </div>
        </div>

        {/* Right — form card */}
        <div className={styles.card}>
          {status === 'success' ? (
            <div className={styles.feedbackSuccess}>
              <span aria-hidden>✓</span>
              Message envoyé. Je reviens vers toi rapidement.
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>

              {/* Honeypot — invisible pour les humains, les bots le remplissent */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                tabIndex={-1}
                aria-hidden="true"
                autoComplete="off"
                style={{ display: 'none' }}
              />

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="nom">Nom</label>
                  <input
                    id="nom"
                    className={styles.input}
                    type="text"
                    placeholder="Votre nom"
                    value={nom}
                    onChange={e => setNom(e.target.value)}
                    maxLength={RULES.nom.max}
                    disabled={status === 'loading'}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="email">Email</label>
                  <input
                    id="email"
                    className={styles.input}
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    maxLength={120}
                    disabled={status === 'loading'}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <div className={styles.fieldLabelRow}>
                  <label className={styles.fieldLabel} htmlFor="message">Message</label>
                  <span className={`${styles.charCount} ${msgOk ? styles.charCountOk : ''}`}>
                    {msgLen} / {RULES.message.max}
                    {!msgOk && msgLen > 0 && ` (min ${RULES.message.min})`}
                  </span>
                </div>
                <textarea
                  id="message"
                  className={styles.textarea}
                  rows={6}
                  placeholder="Décrivez votre projet ou votre demande... (20 caractères minimum)"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  maxLength={RULES.message.max}
                  disabled={status === 'loading'}
                />
              </div>

              {errorMsg && <p className={styles.feedbackError}>{errorMsg}</p>}

              <button
                type="submit"
                className={styles.submit}
                disabled={status === 'loading'}
              >
                {status === 'loading' && <span className={styles.spinner} aria-hidden />}
                {status === 'loading' ? 'Envoi...' : 'Envoyer le message'}
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
