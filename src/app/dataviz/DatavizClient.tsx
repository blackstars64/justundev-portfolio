'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import '@/styles/dataviz.scss';

// D3 ne supporte pas le SSR → chargement dynamique
const AnalyticsDashboard = dynamic(
  () => import('@/components/dataviz/AnalyticsDashboard'),
  { ssr: false, loading: () => <div className="chart-loading">Chargement…</div> }
);

const NetworkGraph = dynamic(
  () => import('@/components/dataviz/NetworkGraph'),
  { ssr: false, loading: () => <div className="chart-loading">Chargement…</div> }
);

const ChoroplethMap = dynamic(
  () => import('@/components/dataviz/ChoroplethMap'),
  { ssr: false, loading: () => <div className="chart-loading">Chargement…</div> }
);

// ── Code sources (extraits pédagogiques) ─────────────────────────────────────

const DEMO1_SOURCE = `// Données fictives réalistes
const data: MonthData[] = [
  { month: 'Oct 25', visits: 2100, conversions: 78 },
  { month: 'Nov 25', visits: 2340, conversions: 91 },
  // ...12 mois de données
];

// Bar chart D3 avec animation entrée depuis le bas
const x = d3.scaleBand().domain(data.map(d => d.month)).padding(0.35);
const y = d3.scaleLinear().domain([0, d3.max(data, d => d.visits)! * 1.1]);

g.selectAll('.bar').data(data).enter().append('rect')
  .attr('y', innerH).attr('height', 0)       // part du bas
  .transition().duration(600)
  .attr('y', d => y(d.visits))
  .attr('height', d => innerH - y(d.visits));

// Line chart — effet dessin stroke-dashoffset
const len = path.node().getTotalLength();
path.attr('stroke-dasharray', len).attr('stroke-dashoffset', len)
  .transition().duration(900).attr('stroke-dashoffset', 0);

// Tooltip : ref DOM direct (pas de useState → pas de re-render → pas de boucle)
const tip = tooltipRef.current!;
bar.on('mouseenter', (event, d) => {
  tip.innerHTML = \`<strong>\${d.month}</strong><span>\${d.visits} visites</span>\`;
  tip.style.opacity = '1';
}).on('mouseleave', () => { tip.style.opacity = '0'; });`;

const DEMO3_SOURCE = `// Projection conique conforme centrée sur la France
const projection = d3.geoConicConformal()
  .center([2.454071, 46.279229])
  .parallels([44, 49])
  .scale(W * 4.2)
  .translate([W / 2, H / 2]);

const path = d3.geoPath().projection(projection);

// Échelle couleur séquentielle violet → opaque
const colorScale = d3.scaleSequential()
  .domain([vMin, vMax])
  .interpolator(d3.interpolate(
    'rgba(139,92,246,0.08)',
    'rgba(139,92,246,0.95)'
  ));

// Fetch GeoJSON + rendu
d3.json(GEOJSON_URL).then(geojson => {
  svg.selectAll('path')
    .data(geojson.features)
    .enter().append('path')
    .attr('d', path)
    .attr('fill', f => colorScale(REGION_DATA[f.properties.nom]))
    // Animation décalée : chaque région apparaît à +40ms
    .attr('opacity', 0)
    .transition().duration(500).delay((_, i) => i * 40)
    .attr('opacity', 1);
});`;

const DEMO2_SOURCE = `// Force simulation — réseau de 17 nœuds tech
const sim = d3.forceSimulation<Node>(nodes)
  .force('link',    d3.forceLink<Node, Link>(links).id(d => d.id)
                       .distance(d => 80 + (1 - d.strength) * 60))
  .force('charge',  d3.forceManyBody().strength(-280))
  .force('center',  d3.forceCenter(W / 2, H / 2))
  .force('collide', d3.forceCollide<Node>().radius(d => RADIUS[d.level] + 10));

// Drag behavior
const drag = d3.drag<SVGGElement, Node>()
  .on('start', (e, d) => { d.fx = d.x; d.fy = d.y; sim.alphaTarget(0.3).restart(); })
  .on('drag',  (e, d) => { d.fx = e.x; d.fy = e.y; })
  .on('end',   (e, d) => { d.fx = null; d.fy = null; sim.alphaTarget(0); });

// Zoom behavior
const zoom = d3.zoom<SVGSVGElement, unknown>()
  .scaleExtent([0.4, 3])
  .on('zoom', e => zoomG.attr('transform', e.transform));

// Tick loop : repositionner liens et nœuds à chaque frame
sim.on('tick', () => {
  linkEl.attr('x1', d => d.source.x!).attr('y1', d => d.source.y!)
        .attr('x2', d => d.target.x!).attr('y2', d => d.target.y!);
  nodeG.attr('transform', d => \`translate(\${d.x},\${d.y})\`);
});`;

// ── Composant toggle source ───────────────────────────────────────────────────

function SourceBlock({ code, file }: { code: string; file: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="source-toggle" onClick={() => setOpen(o => !o)}>
        <span className={`toggle-icon${open ? ' open' : ''}`}>▶</span>
        Voir le code source
        <span className="source-toggle-file">{file}</span>
      </button>
      <div className={`source-code-block${open ? ' visible' : ''}`}>
        <pre><code>{code}</code></pre>
      </div>
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DatavizClient() {
  return (
    <main className="dataviz-page">
      <header className="dataviz-header">
        <span className="dataviz-eyebrow">Data Visualization</span>
        <h1>Démos D3.js interactives</h1>
        <p>
          Trois visualisations codées from scratch avec D3.js v7 — données fictives réalistes,
          animations soignées, responsive.
        </p>
      </header>

      {/* ── Démo 1 ── */}
      <section className="demo-section">
        <div className="demo-header">
          <div className="demo-meta">
            <div className="demo-number">01 / 03</div>
            <h2>Dashboard Analytics</h2>
            <p>Barres animées + courbe de conversion + filtres temporels + tooltip hover</p>
          </div>
          <span className="demo-tech-badge">D3.js · scaleBand · scaleLinear · area</span>
        </div>
        <div className="demo-body">
          <AnalyticsDashboard />
        </div>
        <SourceBlock code={DEMO1_SOURCE} file="AnalyticsDashboard.tsx" />
      </section>

      {/* ── Démo 2 ── */}
      <section className="demo-section">
        <div className="demo-header">
          <div className="demo-meta">
            <div className="demo-number">02 / 03</div>
            <h2>Visualisation réseau</h2>
            <p>Réseau de compétences tech — drag & drop, zoom, force simulation, tooltip</p>
          </div>
          <span className="demo-tech-badge">D3.js · forceSimulation · drag · zoom</span>
        </div>
        <div className="demo-body">
          <NetworkGraph />
        </div>
        <SourceBlock code={DEMO2_SOURCE} file="NetworkGraph.tsx" />
      </section>

      {/* ── Démo 3 ── */}
      <section className="demo-section">
        <div className="demo-header">
          <div className="demo-meta">
            <div className="demo-number">03 / 03</div>
            <h2>Carte choroplèthe France</h2>
            <p>Missions freelance tech par région — projection conique, tooltip, animation décalée</p>
          </div>
          <span className="demo-tech-badge">D3.js · geoPath · scaleSequential</span>
        </div>
        <div className="demo-body">
          <ChoroplethMap />
        </div>
        <SourceBlock code={DEMO3_SOURCE} file="ChoroplethMap.tsx" />
      </section>
    </main>
  );
}
