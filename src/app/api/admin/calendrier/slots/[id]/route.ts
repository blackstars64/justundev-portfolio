// =============================================================================
// PATCH /api/admin/calendrier/slots/[id] — toggle disponible (admin)
// DELETE /api/admin/calendrier/slots/[id] — supprimer (admin)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/adminAuth';
import { setSlotDisponible, deleteSlot, getSlotById } from '@/lib/calendar';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  const { id } = await params;
  const slotId = parseInt(id, 10);
  if (isNaN(slotId)) {
    return NextResponse.json({ error: 'ID invalide.' }, { status: 400 });
  }

  const slot = getSlotById(slotId);
  if (!slot) {
    return NextResponse.json({ error: 'Créneau introuvable.' }, { status: 404 });
  }

  // Toggle
  const newDisponible = slot.disponible === 0;
  setSlotDisponible(slotId, newDisponible);

  return NextResponse.json({ success: true, disponible: newDisponible });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  const { id } = await params;
  const slotId = parseInt(id, 10);
  if (isNaN(slotId)) {
    return NextResponse.json({ error: 'ID invalide.' }, { status: 400 });
  }

  const slot = getSlotById(slotId);
  if (!slot) {
    return NextResponse.json({ error: 'Créneau introuvable.' }, { status: 404 });
  }

  deleteSlot(slotId);
  return NextResponse.json({ success: true });
}
