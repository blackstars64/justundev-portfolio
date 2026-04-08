interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjetPage({ params }: Props) {
  const { slug } = await params;
  return (
    <main>
      <h1>Projet : {slug}</h1>
    </main>
  );
}
