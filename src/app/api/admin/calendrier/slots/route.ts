// =============================================================================
// GET /api/admin/calendrier/slots  — liste tous les créneaux (admin)
// POST /api/admin/calendrier/slots — ajouter un créneau (admin)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/adminAuth';
import { getAllSlots, addSlot } from '@/lib/calendar';

export async function GET(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  const slots = getAllSlots();
  return NextResponse.json({ slots });
}

// Date ISO : YYYY-MM-DD, heure : HH:MM
const dateRegex  = /^\d{4}-\d{2}-\d{2}$/;
const heureRegex = /^\d{2}:\d{2}$/;

export async function POST(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { date, heure_debut, heure_fin, disponible } = body as Record<string, unknown>;

  if (
    typeof date !== 'string' ||
    typeof heure_debut !== 'string' ||
    typeof heure_fin !== 'string'
  ) {
    return NextResponse.json({ error: 'Données invalides.' }, { status: 400 });
  }

  if (!dateRegex.test(date) || !heureRegex.test(heure_debut) || !heureRegex.test(heure_fin)) {
    return NextResponse.json(
      { error: 'Format invalide. Date : YYYY-MM-DD, heure : HH:MM.' },
      { status: 400 }
    );
  }

  if (heure_debut >= heure_fin) {
    return NextResponse.json(
      { error: 'L\'heure de fin doit être après l\'heure de début.' },
      { status: 400 }
    );
  }

  const slot = addSlot({
    date,
    heure_debut,
    heure_fin,
    disponible: disponible !== false ? 1 : 0,
  });

  return NextResponse.json({ slot }, { status: 201 });
}
