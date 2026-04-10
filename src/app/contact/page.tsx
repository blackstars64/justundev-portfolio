import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Un projet, une mission freelance ? Contactez Just'un Dev — réponse sous 24h. Remote, disponible juillet 2026.",
  openGraph: {
    title: "Contactez Just'un Dev",
    description:
      "Un projet, une mission freelance ? Réponse sous 24h. Remote, disponible juillet 2026.",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
