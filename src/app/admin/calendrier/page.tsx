'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './admin-calendrier.module.scss';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Slot {
  id: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  disponible: number;
}

interface Booking {
  id: number;
  slot_id: number;
  nom: string;
  email: string;
  message: string;
  status: 'pending' | 'confirmed' | 'refused';
  created_at: string;
  slot_date: string;
  slot_heure_debut: string;
  slot_heure_fin: string;
}

type Tab = 'demandes' | 'creneaux' | 'parametres';

// ── Admin page ────────────────────────────────────────────────────────────────

export default function AdminCalendrierPage() {
  const [secret, setSecret]     = useState('');
  const [authed, setAuthed]     = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [tab, setTab]           = useState<Tab>('demandes');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [slots, setSlots]       = useState<Slot[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  // ── New slot form ──
  const [newDate, setNewDate]   = useState('');
  const [newDebut, setNewDebut] = useState('');
  const [newFin, setNewFin]     = useState('');
  const [slotMsg, setSlotMsg]   = useState('');

  const headers = useCallback(
    () => ({ 'Content-Type': 'application/json', 'x-admin-secret': secret }),
    [secret]
  );

  // ── Auth ────────────────────────────────────────────────────────────────────

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const res = await fetch('/api/admin/calendrier/bookings', {
      headers: { 'x-admin-secret': secret },
    });

    setAuthLoading(false);
    if (res.status === 401 || res.status === 500) {
      setAuthError('Secret incorrect.');
      return;
    }
    setAuthed(true);
  }

  // ── Load data ────────────────────────────────────────────────────────────────

  const loadData = useCallback(async () => {
    setDataLoading(true);
    const h = headers();

    const [bRes, sRes, cRes] = await Promise.all([
      fetch('/api/admin/calendrier/bookings', { headers: h }),
      fetch('/api/admin/calendrier/slots',    { headers: h }),
      fetch('/api/admin/calendrier/config',   { headers: h }),
    ]);

    const [bData, sData, cData] = await Promise.all([
      bRes.json(),
      sRes.json(),
      cRes.json(),
    ]);

    setBookings(bData.bookings ?? []);
    setSlots(sData.slots ?? []);
    setIsPublic(cData.public ?? true);
    setDataLoading(false);
  }, [headers]);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  // ── Booking actions ──────────────────────────────────────────────────────────

  async function updateBooking(id: number, status: 'confirmed' | 'refused') {
    await fetch(`/api/admin/calendrier/bookings/${id}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify({ status }),
    });
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status } : b))
    );
  }

  // ── Slot actions ─────────────────────────────────────────────────────────────

  async function toggleSlot(id: number) {
    const res = await fetch(`/api/admin/calendrier/slots/${id}`, {
      method: 'PATCH',
      headers: headers(),
    });
    const data = await res.json();
    setSlots(prev =>
      prev.map(s => (s.id === id ? { ...s, disponible: data.disponible ? 1 : 0 } : s))
    );
  }

  async function removeSlot(id: number) {
    await fetch(`/api/admin/calendrier/slots/${id}`, {
      method: 'DELETE',
      headers: headers(),
    });
    setSlots(prev => prev.filter(s => s.id !== id));
  }

  async function addSlot(e: React.FormEvent) {
    e.preventDefault();
    setSlotMsg('');
    const res = await fetch('/api/admin/calendrier/slots', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ date: newDate, heure_debut: newDebut, heure_fin: newFin }),
    });
    const data = await res.json();
    if (!res.ok) { setSlotMsg(data.error); return; }
    setSlots(prev => [...prev, data.slot]);
    setNewDate(''); setNewDebut(''); setNewFin('');
    setSlotMsg('Créneau ajouté.');
  }

  // ── Toggle public/privé ──────────────────────────────────────────────────────

  async function togglePublic() {
    const res = await fetch('/api/admin/calendrier/config', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ public: !isPublic }),
    });
    const data = await res.json();
    if (res.ok) setIsPublic(data.public);
  }

  // ── Render — unlock ──────────────────────────────────────────────────────────

  if (!authed) {
    return (
      <section className={styles.section}>
        <div className={styles.unlockWrap}>
          <span className={styles.label}>Admin</span>
          <h1 className={styles.title}>Calendrier</h1>
          <form className={styles.unlockForm} onSubmit={handleAuth}>
            <label className={styles.fieldLabel} htmlFor="admin-secret">
              Secret admin
            </label>
            <input
              id="admin-secret"
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              autoFocus
            />
            {authError && <p className={styles.feedbackError}>{authError}</p>}
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={authLoading || !secret}
            >
              {authLoading && <span className={styles.spinner} aria-hidden />}
              {authLoading ? 'Vérification…' : 'Accéder'}
            </button>
          </form>
        </div>
      </section>
    );
  }

  // ── Render — admin ───────────────────────────────────────────────────────────

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.adminHeader}>
          <div>
            <span className={styles.label}>Admin</span>
            <h1 className={styles.title}>Gestion calendrier</h1>
          </div>
          <button className={styles.btnOutline} onClick={loadData} disabled={dataLoading}>
            {dataLoading ? '…' : '↺ Actualiser'}
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist">
          {(['demandes', 'creneaux', 'parametres'] as Tab[]).map(t => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              className={`${styles.tabBtn} ${tab === t ? styles.tabActive : ''}`}
              onClick={() => setTab(t)}
            >
              {t === 'demandes' && (
                <>
                  Demandes
                  {pendingCount > 0 && (
                    <span className={styles.badge}>{pendingCount}</span>
                  )}
                </>
              )}
              {t === 'creneaux'   && 'Créneaux'}
              {t === 'parametres' && 'Paramètres'}
            </button>
          ))}
        </div>

        {/* ── Tab: Demandes ── */}
        {tab === 'demandes' && (
          <div className={styles.tabContent}>
            {bookings.length === 0 ? (
              <p className={styles.empty}>Aucune demande pour l'instant.</p>
            ) : (
              <div className={styles.bookingList}>
                {bookings.map(b => (
                  <div
                    key={b.id}
                    className={`${styles.bookingCard} ${styles[`status_${b.status}`]}`}
                  >
                    <div className={styles.bookingTop}>
                      <div className={styles.bookingInfo}>
                        <span className={styles.bookingName}>{b.nom}</span>
                        <a className={styles.bookingEmail} href={`mailto:${b.email}`}>
                          {b.email}
                        </a>
                        <span className={styles.bookingSlot}>
                          {b.slot_date} · {b.slot_heure_debut}–{b.slot_heure_fin}
                        </span>
                        <span className={styles.bookingDate}>
                          Reçu le {new Date(b.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </span>
                      </div>
                      <span className={`${styles.statusBadge} ${styles[`badge_${b.status}`]}`}>
                        {b.status === 'pending'   && 'En attente'}
                        {b.status === 'confirmed' && 'Confirmé'}
                        {b.status === 'refused'   && 'Refusé'}
                      </span>
                    </div>

                    <p className={styles.bookingMessage}>{b.message}</p>

                    {b.status === 'pending' && (
                      <div className={styles.bookingActions}>
                        <button
                          className={styles.btnConfirm}
                          onClick={() => updateBooking(b.id, 'confirmed')}
                        >
                          ✓ Confirmer
                        </button>
                        <button
                          className={styles.btnRefuse}
                          onClick={() => updateBooking(b.id, 'refused')}
                        >
                          ✕ Refuser
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Créneaux ── */}
        {tab === 'creneaux' && (
          <div className={styles.tabContent}>

            {/* Add slot form */}
            <div className={styles.addSlotCard}>
              <h2 className={styles.sectionTitle}>Ajouter un créneau</h2>
              <form className={styles.addSlotForm} onSubmit={addSlot}>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="slot-date">Date</label>
                    <input
                      id="slot-date"
                      className={styles.input}
                      type="date"
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="slot-debut">Début</label>
                    <input
                      id="slot-debut"
                      className={styles.input}
                      type="time"
                      value={newDebut}
                      onChange={e => setNewDebut(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="slot-fin">Fin</label>
                    <input
                      id="slot-fin"
                      className={styles.input}
                      type="time"
                      value={newFin}
                      onChange={e => setNewFin(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {slotMsg && (
                  <p className={slotMsg.includes('ajouté') ? styles.feedbackSuccess : styles.feedbackError}>
                    {slotMsg}
                  </p>
                )}
                <button type="submit" className={styles.btnPrimary}>
                  + Ajouter
                </button>
              </form>
            </div>

            {/* Slot list */}
            <h2 className={styles.sectionTitle} style={{ marginTop: '1.5rem' }}>
              Tous les créneaux ({slots.length})
            </h2>
            {slots.length === 0 ? (
              <p className={styles.empty}>Aucun créneau défini.</p>
            ) : (
              <div className={styles.slotList}>
                {slots.map(slot => (
                  <div key={slot.id} className={`${styles.slotRow} ${!slot.disponible ? styles.slotIndispo : ''}`}>
                    <span className={styles.slotDate}>{slot.date}</span>
                    <span className={styles.slotTime}>
                      {slot.heure_debut} – {slot.heure_fin}
                    </span>
                    <span className={`${styles.disponibleBadge} ${slot.disponible ? styles.disponibleOn : styles.disponibleOff}`}>
                      {slot.disponible ? 'Dispo' : 'Indispo'}
                    </span>
                    <div className={styles.slotActions}>
                      <button
                        className={styles.btnOutline}
                        onClick={() => toggleSlot(slot.id)}
                        title={slot.disponible ? 'Marquer indispo' : 'Marquer dispo'}
                      >
                        {slot.disponible ? '⊘ Masquer' : '✓ Activer'}
                      </button>
                      <button
                        className={styles.btnDanger}
                        onClick={() => removeSlot(slot.id)}
                        title="Supprimer"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Paramètres ── */}
        {tab === 'parametres' && (
          <div className={styles.tabContent}>
            <div className={styles.paramCard}>
              <h2 className={styles.sectionTitle}>Visibilité du calendrier</h2>
              <p className={styles.paramDesc}>
                Quand le calendrier est <strong>privé</strong>, la page&nbsp;
                <code>/calendrier</code> affiche un message "sur demande" — aucun
                créneau n'est visible.
              </p>
              <div className={styles.toggleRow}>
                <span className={styles.toggleLabel}>
                  Statut actuel :&nbsp;
                  <strong className={isPublic ? styles.statusOn : styles.statusOff}>
                    {isPublic ? 'Public' : 'Privé'}
                  </strong>
                </span>
                <button
                  className={isPublic ? styles.btnDanger : styles.btnConfirm}
                  onClick={togglePublic}
                >
                  {isPublic ? 'Passer en privé' : 'Rendre public'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
