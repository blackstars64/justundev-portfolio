// =============================================================================
// GET /api/admin/calendrier/bookings — liste toutes les demandes (admin)
// =============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/adminAuth';
import { getAllBookings } from '@/lib/calendar';

export async function GET(req: NextRequest) {
  const authError = checkAdminAuth(req);
  if (authError) return authError;

  const bookings = getAllBookings();
  return NextResponse.json({ bookings });
}
