// =============================================================================
// POST /api/calendrier/booking — demande de RDV (public)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  createBooking,
  getSlotById,
  isCalendrierPublic,
} from '@/lib/calendar';

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Sanitize ──────────────────────────────────────────────────────────────────

function sanitize(str: string): string {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
}

// ── Validation ────────────────────────────────────────────────────────────────

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Calendrier actif ?
  if (!isCalendrierPublic()) {
    return NextResponse.json(
      { error: 'Le calendrier est désactivé.' },
      { status: 403 }
    );
  }

  // Parse
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { slot_id, nom, email, message } = body as Record<string, unknown>;

  // Validation types
  if (
    typeof slot_id !== 'number' ||
    typeof nom !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string'
  ) {
    return NextResponse.json({ error: 'Données invalides.' }, { status: 400 });
  }

  const trimNom     = nom.trim();
  const trimEmail   = email.trim();
  const trimMessage = message.trim();

  if (trimNom.length < 2 || trimNom.length > 80)
    return NextResponse.json({ error: 'Nom invalide (2–80 caractères).' }, { status: 400 });

  if (!emailRegex.test(trimEmail) || trimEmail.length > 120)
    return NextResponse.json({ error: 'Email invalide.' }, { status: 400 });

  if (trimMessage.length < 10 || trimMessage.length > 1000)
    return NextResponse.json({ error: 'Message invalide (10–1000 caractères).' }, { status: 400 });

  // Créneau valide ?
  const slot = getSlotById(slot_id);
  if (!slot || !slot.disponible) {
    return NextResponse.json(
      { error: 'Ce créneau n\'est plus disponible.' },
      { status: 409 }
    );
  }

  // Créer la réservation
  const booking = createBooking({
    slot_id,
    nom: trimNom,
    email: trimEmail,
    message: trimMessage,
  });

  // Emails Resend
  const to = process.env.CONTACT_TO_EMAIL;
  if (to && process.env.RESEND_API_KEY) {
    const safeNom     = sanitize(trimNom);
    const safeMessage = sanitize(trimMessage);
    const slotLabel   = `${slot.date} de ${slot.heure_debut} à ${slot.heure_fin}`;

    // Email à moi
    await resend.emails.send({
      from: 'Portfolio <contact@justundev.fr>',
      to,
      replyTo: trimEmail,
      subject: `[RDV] Nouvelle demande de ${safeNom}`,
      html: `
        <p><strong>Nom :</strong> ${safeNom}</p>
        <p><strong>Email :</strong> ${trimEmail}</p>
        <p><strong>Créneau :</strong> ${slotLabel}</p>
        <hr />
        <p>${safeMessage.replace(/\n/g, '<br />')}</p>
      `,
      text: `Nom : ${trimNom}\nEmail : ${trimEmail}\nCréneau : ${slotLabel}\n\n${trimMessage}`,
    });

    // Confirmation au client
    await resend.emails.send({
      from: 'Just\'un Dev <contact@justundev.fr>',
      to: trimEmail,
      subject: 'Votre demande de RDV a bien été reçue',
      html: `
        <p>Bonjour ${safeNom},</p>
        <p>
          Votre demande de RDV pour le créneau <strong>${slotLabel}</strong>
          a bien été reçue. Je reviendrai vers vous rapidement pour confirmer.
        </p>
        <p>— Blackstars64 / Just'un Dev</p>
      `,
      text: `Bonjour ${trimNom},\n\nVotre demande de RDV pour ${slotLabel} a bien été reçue.\nJe reviens vers vous rapidement.\n\n— Blackstars64 / Just'un Dev`,
    });
  }

  return NextResponse.json({ success: true, booking_id: booking.id });
}
