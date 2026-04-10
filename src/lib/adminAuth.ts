// =============================================================================
// src/lib/adminAuth.ts — Validation du secret admin
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';

export function checkAdminAuth(req: NextRequest): NextResponse | null {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'ADMIN_SECRET non configuré.' },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get('x-admin-secret');
  if (authHeader !== secret) {
    return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  }

  return null; // auth OK
}
