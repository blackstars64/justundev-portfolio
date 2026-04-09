import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Rate limiting — par IP (en mémoire, suffisant pour un portfolio) ──────────
const RATE_LIMIT = 3;         // max envois
const RATE_WINDOW = 60 * 60 * 1000; // par heure

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ── Sanitisation basique ───────────────────────────────────────────────────────
function sanitize(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim();
}

// ── Validation ─────────────────────────────────────────────────────────────────
const RULES = {
  nom:     { min: 2,  max: 80  },
  email:   { min: 5,  max: 120 },
  message: { min: 20, max: 2000 },
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Handler ────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';

  // Rate limit
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Trop de messages envoyés. Réessaye dans une heure.' },
      { status: 429 }
    );
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 });
  }

  const { nom, email, message, honeypot } = body as Record<string, string>;

  // Honeypot — si rempli → bot
  if (honeypot) {
    return NextResponse.json({ success: true }); // faux succès silencieux
  }

  // Validation types
  if (typeof nom !== 'string' || typeof email !== 'string' || typeof message !== 'string') {
    return NextResponse.json({ error: 'Données invalides.' }, { status: 400 });
  }

  const trimmedNom     = nom.trim();
  const trimmedEmail   = email.trim();
  const trimmedMessage = message.trim();

  if (trimmedNom.length < RULES.nom.min || trimmedNom.length > RULES.nom.max) {
    return NextResponse.json(
      { error: `Le nom doit faire entre ${RULES.nom.min} et ${RULES.nom.max} caractères.` },
      { status: 400 }
    );
  }
  if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > RULES.email.max) {
    return NextResponse.json({ error: 'Adresse email invalide.' }, { status: 400 });
  }
  if (trimmedMessage.length < RULES.message.min || trimmedMessage.length > RULES.message.max) {
    return NextResponse.json(
      { error: `Le message doit faire entre ${RULES.message.min} et ${RULES.message.max} caractères.` },
      { status: 400 }
    );
  }

  // Destination
  const to = process.env.CONTACT_TO_EMAIL;
  if (!to) {
    console.error('CONTACT_TO_EMAIL non défini');
    return NextResponse.json({ error: 'Configuration serveur manquante.' }, { status: 500 });
  }

  // Envoi
  const safeNom     = sanitize(trimmedNom);
  const safeMessage = sanitize(trimmedMessage);

  const { data, error } = await resend.emails.send({
    from: 'Portfolio <contact@justundev.fr>',
    to,
    replyTo: trimmedEmail,
    subject: `[Portfolio] Message de ${safeNom}`,
    text: `Nom : ${trimmedNom}\nEmail : ${trimmedEmail}\n\n${trimmedMessage}`,
    html: `
      <p><strong>Nom :</strong> ${safeNom}</p>
      <p><strong>Email :</strong> ${trimmedEmail}</p>
      <hr />
      <p>${safeMessage.replace(/\n/g, '<br />')}</p>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi. Réessaye plus tard.' },
      { status: 500 }
    );
  }

  console.log('Resend OK:', data?.id);
  return NextResponse.json({ success: true });
}
