import type { Metadata } from 'next';
import DatavizClient from './DatavizClient';

export const metadata: Metadata = {
  title: 'Data Viz — D3.js | Just\'un Dev',
  description: 'Démonstrations interactives D3.js : dashboard analytics, visualisation réseau, carte choroplèthe France.',
};

export default function DatavizPage() {
  return <DatavizClient />;
}
