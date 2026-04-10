// =============================================================================
// src/lib/calendar.ts — Fonctions CRUD calendrier (async, Turso/libSQL)
// =============================================================================

import getDb from './db';
import type { Row } from '@libsql/client';

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

// ── Row converters ────────────────────────────────────────────────────────────

function rowToSlot(row: Row): Slot {
  return {
    id: Number(row.id),
    date: row.date as string,
    heure_debut: row.heure_debut as string,
    heure_fin: row.heure_fin as string,
    disponible: Number(row.disponible),
  };
}

function rowToBooking(row: Row): Booking {
  return {
    id: Number(row.id),
    slot_id: Number(row.slot_id),
    nom: row.nom as string,
    email: row.email as string,
    message: row.message as string,
    status: row.status as 'pending' | 'confirmed' | 'refused',
    created_at: row.created_at as string,
  };
}

// ── Slots — public ────────────────────────────────────────────────────────────

export async function getAvailableSlots(): Promise<Slot[]> {
  const db = await getDb();
  const result = await db.execute(
    'SELECT * FROM slots WHERE disponible = 1 ORDER BY date, heure_debut'
  );
  return result.rows.map(rowToSlot);
}

// ── Slots — admin ─────────────────────────────────────────────────────────────

export async function getAllSlots(): Promise<Slot[]> {
  const db = await getDb();
  const result = await db.execute('SELECT * FROM slots ORDER BY date, heure_debut');
  return result.rows.map(rowToSlot);
}

export async function addSlot(slot: Omit<Slot, 'id'>): Promise<Slot> {
  const db = await getDb();
  const result = await db.execute({
    sql: 'INSERT INTO slots (date, heure_debut, heure_fin, disponible) VALUES (?, ?, ?, ?)',
    args: [slot.date, slot.heure_debut, slot.heure_fin, slot.disponible ? 1 : 0],
  });
  const newId = Number(result.lastInsertRowid);
  const row = await db.execute({ sql: 'SELECT * FROM slots WHERE id = ?', args: [newId] });
  return rowToSlot(row.rows[0]);
}

export async function setSlotDisponible(id: number, disponible: boolean): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: 'UPDATE slots SET disponible = ? WHERE id = ?',
    args: [disponible ? 1 : 0, id],
  });
}

export async function deleteSlot(id: number): Promise<void> {
  const db = await getDb();
  await db.execute({ sql: 'DELETE FROM slots WHERE id = ?', args: [id] });
}

// ── Bookings — public ─────────────────────────────────────────────────────────

export async function createBooking(
  booking: Omit<Booking, 'id' | 'status' | 'created_at'>
): Promise<Booking> {
  const db = await getDb();
  const result = await db.execute({
    sql: 'INSERT INTO bookings (slot_id, nom, email, message) VALUES (?, ?, ?, ?)',
    args: [booking.slot_id, booking.nom, booking.email, booking.message],
  });
  const newId = Number(result.lastInsertRowid);
  const row = await db.execute({ sql: 'SELECT * FROM bookings WHERE id = ?', args: [newId] });
  return rowToBooking(row.rows[0]);
}

export async function getSlotById(id: number): Promise<Slot | null> {
  const db = await getDb();
  const result = await db.execute({ sql: 'SELECT * FROM slots WHERE id = ?', args: [id] });
  return result.rows.length > 0 ? rowToSlot(result.rows[0]) : null;
}

// ── Bookings — admin ──────────────────────────────────────────────────────────

export async function getAllBookings(): Promise<BookingWithSlot[]> {
  const db = await getDb();
  const result = await db.execute(`
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
  `);
  return result.rows.map((row) => ({
    ...rowToBooking(row),
    slot_date: row.slot_date as string,
    slot_heure_debut: row.slot_heure_debut as string,
    slot_heure_fin: row.slot_heure_fin as string,
  }));
}

export async function updateBookingStatus(
  id: number,
  status: 'confirmed' | 'refused'
): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: 'UPDATE bookings SET status = ? WHERE id = ?',
    args: [status, id],
  });
}

export async function getBookingById(id: number): Promise<Booking | null> {
  const db = await getDb();
  const result = await db.execute({ sql: 'SELECT * FROM bookings WHERE id = ?', args: [id] });
  return result.rows.length > 0 ? rowToBooking(result.rows[0]) : null;
}

// ── Config ────────────────────────────────────────────────────────────────────

export async function isCalendrierPublic(): Promise<boolean> {
  const db = await getDb();
  const result = await db.execute({
    sql: 'SELECT value FROM config WHERE key = ?',
    args: ['calendrier_public'],
  });
  return result.rows.length > 0 && (result.rows[0].value as string) === '1';
}

export async function setCalendrierPublic(isPublic: boolean): Promise<void> {
  const db = await getDb();
  await db.execute({
    sql: 'UPDATE config SET value = ? WHERE key = ?',
    args: [isPublic ? '1' : '0', 'calendrier_public'],
  });
}
