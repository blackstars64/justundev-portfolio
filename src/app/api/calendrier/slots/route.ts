// =============================================================================
// GET /api/calendrier/slots — créneaux disponibles (public)
// =============================================================================

import { NextResponse } from 'next/server';
import { getAvailableSlots, isCalendrierPublic } from '@/lib/calendar';

export async function GET() {
  const isPublic = await isCalendrierPublic();

  if (!isPublic) {
    return NextResponse.json({ public: false, slots: [] });
  }

  const slots = await getAvailableSlots();
  return NextResponse.json({ public: true, slots });
}
