// =============================================================================
// PATCH /api/admin/calendrier/bookings/[id] — confirmer ou refuser (admin)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkAdminAuth } from '@/lib/adminAuth';
import { getBookingById, getSlotById, updateBookingStatus } from '@/lib/calendar';

const resend = new Resend(process.env.RESEND_API_KEY);

function sanitize(str: string): string {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  const { id } = await params;
  const bookingId = parseInt(id, 10);
  if (isNaN(bookingId)) {
    return NextResponse.json({ error: 'ID invalide.' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { status } = body as { status: string };
  if (status !== 'confirmed' && status !== 'refused') {
    return NextResponse.json(
      { error: 'Status invalide (confirmed | refused).' },
      { status: 400 }
    );
  }

  const booking = getBookingById(bookingId);
  if (!booking) {
    return NextResponse.json({ error: 'Demande introuvable.' }, { status: 404 });
  }

  updateBookingStatus(bookingId, status);

  // Email de notification au client
  if (process.env.RESEND_API_KEY) {
    const slot = getSlotById(booking.slot_id);
    const slotLabel = slot
      ? `${slot.date} de ${slot.heure_debut} à ${slot.heure_fin}`
      : 'votre créneau';

    const safeNom = sanitize(booking.nom);

    if (status === 'confirmed') {
      await resend.emails.send({
        from: "Just'un Dev <contact@justundev.fr>",
        to: booking.email,
        subject: 'Votre RDV est confirmé ✓',
        html: `
          <p>Bonjour ${safeNom},</p>
          <p>
            Votre demande de RDV pour le créneau <strong>${slotLabel}</strong>
            est <strong>confirmée</strong>. À bientôt !
          </p>
          <p>— Blackstars64 / Just'un Dev</p>
        `,
        text: `Bonjour ${booking.nom},\n\nVotre RDV pour ${slotLabel} est confirmé. À bientôt !\n\n— Blackstars64 / Just'un Dev`,
      });
    } else {
      await resend.emails.send({
        from: "Just'un Dev <contact@justundev.fr>",
        to: booking.email,
        subject: 'Demande de RDV — suite',
        html: `
          <p>Bonjour ${safeNom},</p>
          <p>
            Je ne suis malheureusement pas disponible pour le créneau demandé.
            N'hésitez pas à choisir un autre créneau ou à me contacter directement.
          </p>
          <p>— Blackstars64 / Just'un Dev</p>
        `,
        text: `Bonjour ${booking.nom},\n\nJe ne suis pas disponible pour ce créneau. N'hésitez pas à en choisir un autre.\n\n— Blackstars64 / Just'un Dev`,
      });
    }
  }

  return NextResponse.json({ success: true });
}
