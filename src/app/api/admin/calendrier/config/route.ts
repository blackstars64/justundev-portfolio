// =============================================================================
// GET /api/admin/calendrier/config  — état public/privé (admin)
// POST /api/admin/calendrier/config — toggle public/privé (admin)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/adminAuth';
import { isCalendrierPublic, setCalendrierPublic } from '@/lib/calendar';

export async function GET(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  return NextResponse.json({ public: isCalendrierPublic() });
}

export async function POST(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { public: isPublic } = body as { public: unknown };
  if (typeof isPublic !== 'boolean') {
    return NextResponse.json({ error: 'Champ "public" (boolean) requis.' }, { status: 400 });
  }

  setCalendrierPublic(isPublic);
  return NextResponse.json({ success: true, public: isPublic });
}
