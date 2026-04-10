'use client';

import { useState, useEffect, useReducer } from 'react';
import styles from './calendrier.module.scss';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Slot {
  id: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  disponible: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatWeekLabel(monday: Date): string {
  const sunday = addDays(monday, 6);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
  const mLabel = monday.toLocaleDateString('fr-FR', opts);
  const sLabel = sunday.toLocaleDateString('fr-FR', { ...opts, year: 'numeric' });
  return `${mLabel} – ${sLabel}`;
}

const DAY_LABELS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

// ── Form state ────────────────────────────────────────────────────────────────

interface FormState {
  nom: string;
  email: string;
  message: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMsg: string;
}

type FormAction =
  | { type: 'SET_FIELD'; field: 'nom' | 'email' | 'message'; value: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS' }
  | { type: 'SUBMIT_ERROR'; msg: string }
  | { type: 'RESET' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SUBMIT_START':
      return { ...state, status: 'loading', errorMsg: '' };
    case 'SUBMIT_SUCCESS':
      return { nom: '', email: '', message: '', status: 'success', errorMsg: '' };
    case 'SUBMIT_ERROR':
      return { ...state, status: 'error', errorMsg: action.msg };
    case 'RESET':
      return { nom: '', email: '', message: '', status: 'idle', errorMsg: '' };
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CalendrierPage() {
  const [isPublic, setIsPublic]   = useState<boolean | null>(null);
  const [slots, setSlots]         = useState<Slot[]>([]);
  const [loading, setLoading]     = useState(true);
  const [monday, setMonday]       = useState<Date>(() => getMondayOf(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [form, dispatch] = useReducer(formReducer, {
    nom: '', email: '', message: '', status: 'idle', errorMsg: '',
  });

  // Fetch slots
  useEffect(() => {
    setLoading(true);
    fetch('/api/calendrier/slots')
      .then(r => r.json())
      .then((data: { public: boolean; slots: Slot[] }) => {
        setIsPublic(data.public);
        setSlots(data.slots ?? []);
      })
      .catch(() => setIsPublic(false))
      .finally(() => setLoading(false));
  }, []);

  // Week days with their slots
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(monday, i);
    const iso  = toIso(day);
    return {
      date: day,
      iso,
      label: DAY_LABELS[i],
      slots: slots.filter(s => s.date === iso),
    };
  });

  function prevWeek() { setMonday(d => addDays(d, -7)); }
  function nextWeek() { setMonday(d => addDays(d,  7)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) return;

    const nom     = form.nom.trim();
    const email   = form.email.trim();
    const message = form.message.trim();

    if (nom.length < 2)    { dispatch({ type: 'SUBMIT_ERROR', msg: 'Nom trop court (min 2 caractères).' }); return; }
    if (!email.includes('@')) { dispatch({ type: 'SUBMIT_ERROR', msg: 'Email invalide.' }); return; }
    if (message.length < 10) { dispatch({ type: 'SUBMIT_ERROR', msg: 'Message trop court (min 10 caractères).' }); return; }

    dispatch({ type: 'SUBMIT_START' });

    try {
      const res = await fetch('/api/calendrier/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot_id: selectedSlot.id, nom, email, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur');
      dispatch({ type: 'SUBMIT_SUCCESS' });
      setSelectedSlot(null);
    } catch (err: unknown) {
      dispatch({
        type: 'SUBMIT_ERROR',
        msg: err instanceof Error ? err.message : "Erreur lors de l'envoi.",
      });
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.loader} aria-label="Chargement…" />
        </div>
      </section>
    );
  }

  if (!isPublic) {
    return (
      <section className={styles.section}>
        <div className={styles.glow} aria-hidden />
        <div className={styles.inner}>
          <div className={styles.privateWrap}>
            <span className={styles.privateIcon} aria-hidden>🔒</span>
            <h1 className={styles.title}>Calendrier sur demande</h1>
            <p className={styles.privateDesc}>
              La prise de RDV se fait directement par email ou via le formulaire de contact.
            </p>
            <a href="/contact" className={styles.btnPrimary}>Me contacter</a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.label}>Calendrier</span>
            <h1 className={styles.title}>Réserver un créneau</h1>
            <p className={styles.desc}>
              Choisissez un créneau disponible puis remplissez le formulaire.
              Je confirme sous 24h.
            </p>
          </div>
        </div>

        {/* Calendar */}
        <div className={styles.calendarCard}>
          <div className={styles.calendarNav}>
            <button className={styles.navBtn} onClick={prevWeek} aria-label="Semaine précédente">
              ←
            </button>
            <span className={styles.weekLabel}>{formatWeekLabel(monday)}</span>
            <button className={styles.navBtn} onClick={nextWeek} aria-label="Semaine suivante">
              →
            </button>
          </div>

          <div className={styles.weekGrid}>
            {weekDays.map(({ date, iso, label, slots: daySlots }) => {
              const isToday = toIso(new Date()) === iso;
              const isPast  = date < new Date(new Date().setHours(0, 0, 0, 0));
              return (
                <div
                  key={iso}
                  className={`${styles.dayCol} ${isToday ? styles.today : ''} ${isPast ? styles.past : ''}`}
                >
                  <div className={styles.dayHeader}>
                    <span className={styles.dayName}>{label}</span>
                    <span className={styles.dayNum}>
                      {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className={styles.slotList}>
                    {daySlots.length === 0 ? (
                      <span className={styles.noSlot}>—</span>
                    ) : (
                      daySlots.map(slot => {
                        const isSelected = selectedSlot?.id === slot.id;
                        return (
                          <button
                            key={slot.id}
                            className={`${styles.slotBtn} ${isSelected ? styles.slotSelected : ''} ${isPast ? styles.slotDisabled : ''}`}
                            onClick={() => !isPast && setSelectedSlot(isSelected ? null : slot)}
                            disabled={isPast}
                            aria-pressed={isSelected}
                          >
                            {slot.heure_debut}
                            <span className={styles.slotSep}>–</span>
                            {slot.heure_fin}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Booking form */}
        <div className={`${styles.formCard} ${selectedSlot ? styles.formCardVisible : ''}`}>
          {form.status === 'success' ? (
            <div className={styles.feedbackSuccess}>
              <span aria-hidden>✓</span>
              Demande envoyée ! Je vous confirme le RDV sous 24h.
            </div>
          ) : (
            <>
              {selectedSlot && (
                <div className={styles.selectedInfo}>
                  <span className={styles.selectedLabel}>Créneau sélectionné</span>
                  <span className={styles.selectedValue}>
                    {selectedSlot.date} · {selectedSlot.heure_debut} – {selectedSlot.heure_fin}
                  </span>
                  <button
                    className={styles.clearSlot}
                    onClick={() => setSelectedSlot(null)}
                    aria-label="Désélectionner le créneau"
                  >
                    ✕
                  </button>
                </div>
              )}

              {!selectedSlot && (
                <p className={styles.formHint}>
                  Sélectionnez un créneau dans le calendrier pour afficher le formulaire.
                </p>
              )}

              {selectedSlot && (
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="cal-nom">Nom</label>
                      <input
                        id="cal-nom"
                        className={styles.input}
                        type="text"
                        placeholder="Votre nom"
                        value={form.nom}
                        onChange={e => dispatch({ type: 'SET_FIELD', field: 'nom', value: e.target.value })}
                        maxLength={80}
                        disabled={form.status === 'loading'}
                      />
                    </div>
                    <div className={styles.field}>
                      <label className={styles.fieldLabel} htmlFor="cal-email">Email</label>
                      <input
                        id="cal-email"
                        className={styles.input}
                        type="email"
                        placeholder="votre@email.com"
                        value={form.email}
                        onChange={e => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
                        maxLength={120}
                        disabled={form.status === 'loading'}
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="cal-message">
                      Message <span className={styles.required}>*</span>
                    </label>
                    <textarea
                      id="cal-message"
                      className={styles.textarea}
                      rows={4}
                      placeholder="Décrivez brièvement votre projet ou votre demande…"
                      value={form.message}
                      onChange={e => dispatch({ type: 'SET_FIELD', field: 'message', value: e.target.value })}
                      maxLength={1000}
                      disabled={form.status === 'loading'}
                    />
                  </div>

                  {form.errorMsg && (
                    <p className={styles.feedbackError}>{form.errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    className={styles.submit}
                    disabled={form.status === 'loading'}
                  >
                    {form.status === 'loading' && (
                      <span className={styles.spinner} aria-hidden />
                    )}
                    {form.status === 'loading' ? 'Envoi…' : 'Demander ce créneau'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

      </div>
    </section>
  );
}
