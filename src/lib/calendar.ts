// =============================================================================
// src/lib/calendar.ts — Fonctions CRUD calendrier
// =============================================================================

import getDb from './db';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Slot {
  id: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  disponible: number;
}

export interface Booking {
  id: number;
  slot_id: number;
  nom: string;
  email: string;
  message: string;
  status: 'pending' | 'confirmed' | 'refused';
  created_at: string;
}

export interface BookingWithSlot extends Booking {
  slot_date: string;
  slot_heure_debut: string;
  slot_heure_fin: string;
}

// ── Slots — public ────────────────────────────────────────────────────────────

export function getAvailableSlots(): Slot[] {
  const db = getDb();
  return db
    .prepare('SELECT * FROM slots WHERE disponible = 1 ORDER BY date, heure_debut')
    .all() as Slot[];
}

// ── Slots — admin ─────────────────────────────────────────────────────────────

export function getAllSlots(): Slot[] {
  const db = getDb();
  return db
    .prepare('SELECT * FROM slots ORDER BY date, heure_debut')
    .all() as Slot[];
}

export function addSlot(slot: Omit<Slot, 'id'>): Slot {
  const db = getDb();
  const result = db
    .prepare('INSERT INTO slots (date, heure_debut, heure_fin, disponible) VALUES (?, ?, ?, ?)')
    .run(slot.date, slot.heure_debut, slot.heure_fin, slot.disponible ? 1 : 0);
  return db
    .prepare('SELECT * FROM slots WHERE id = ?')
    .get(result.lastInsertRowid) as Slot;
}

export function setSlotDisponible(id: number, disponible: boolean): void {
  const db = getDb();
  db.prepare('UPDATE slots SET disponible = ? WHERE id = ?').run(disponible ? 1 : 0, id);
}

export function deleteSlot(id: number): void {
  const db = getDb();
  db.prepare('DELETE FROM slots WHERE id = ?').run(id);
}

// ── Bookings — public ─────────────────────────────────────────────────────────

export function createBooking(
  booking: Omit<Booking, 'id' | 'status' | 'created_at'>
): Booking {
  const db = getDb();
  const result = db
    .prepare('INSERT INTO bookings (slot_id, nom, email, message) VALUES (?, ?, ?, ?)')
    .run(booking.slot_id, booking.nom, booking.email, booking.message);
  return db
    .prepare('SELECT * FROM bookings WHERE id = ?')
    .get(result.lastInsertRowid) as Booking;
}

export function getSlotById(id: number): Slot | null {
  const db = getDb();
  return (db.prepare('SELECT * FROM slots WHERE id = ?').get(id) as Slot) ?? null;
}

// ── Bookings — admin ──────────────────────────────────────────────────────────

export function getAllBookings(): BookingWithSlot[] {
  const db = getDb();
  return db
    .prepare(`
      SELECT
        b.*,
        s.date        AS slot_date,
        s.heure_debut AS slot_heure_debut,
        s.heure_fin   AS slot_heure_fin
      FROM bookings b
      JOIN slots s ON b.slot_id = s.id
      ORDER BY
        CASE b.status WHEN 'pending' THEN 0 ELSE 1 END,
        b.created_at DESC
    `)
    .all() as BookingWithSlot[];
}

export function updateBookingStatus(
  id: number,
  status: 'confirmed' | 'refused'
): void {
  const db = getDb();
  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
}

export function getBookingById(id: number): Booking | null {
  const db = getDb();
  return (db.prepare('SELECT * FROM bookings WHERE id = ?').get(id) as Booking) ?? null;
}

// ── Config ────────────────────────────────────────────────────────────────────

export function isCalendrierPublic(): boolean {
  const db = getDb();
  const row = db
    .prepare('SELECT value FROM config WHERE key = ?')
    .get('calendrier_public') as { value: string } | undefined;
  return row?.value === '1';
}

export function setCalendrierPublic(isPublic: boolean): void {
  const db = getDb();
  db
    .prepare('UPDATE config SET value = ? WHERE key = ?')
    .run(isPublic ? '1' : '0', 'calendrier_public');
}
