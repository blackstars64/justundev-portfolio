import type { Metadata } from 'next';
import Stack from '@/components/Stack/Stack';

export const metadata: Metadata = {
  title: "Stack — Just'un Dev",
  description:
    "Les technologies et outils que j'utilise au quotidien : TypeScript, React, Next.js, Node.js, D3.js, SCSS, Apollo, Git et plus.",
};

export default function StackPage() {
  return (
    <main>
      <Stack />
    </main>
  );
}
