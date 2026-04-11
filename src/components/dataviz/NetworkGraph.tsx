'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// ─── Données : réseau de compétences tech ─────────────────────────────────────

type Category = 'frontend' | 'backend' | 'data' | 'devops' | 'lang';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  category: Category;
  level: number;   // 1-3 → rayon node
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  strength: number;  // 0.1-1
}

const NODES: Node[] = [
  // Langages
  { id: 'ts',         label: 'TypeScript',   category: 'lang',     level: 3 },
  { id: 'js',         label: 'JavaScript',   category: 'lang',     level: 3 },
  { id: 'python',     label: 'Python',       category: 'lang',     level: 2 },
  // Frontend
  { id: 'react',      label: 'React',        category: 'frontend', level: 3 },
  { id: 'next',       label: 'Next.js',      category: 'frontend', level: 3 },
  { id: 'scss',       label: 'SCSS',         category: 'frontend', level: 3 },
  { id: 'gsap',       label: 'GSAP',         category: 'frontend', level: 2 },
  { id: 'd3',         label: 'D3.js',        category: 'data',     level: 2 },
  // Backend
  { id: 'node',       label: 'Node.js',      category: 'backend',  level: 3 },
  { id: 'express',    label: 'Express',      category: 'backend',  level: 2 },
  { id: 'apollo',     label: 'Apollo GQL',   category: 'backend',  level: 2 },
  { id: 'prisma',     label: 'Prisma',       category: 'backend',  level: 2 },
  // Data / BDD
  { id: 'postgres',   label: 'PostgreSQL',   category: 'data',     level: 2 },
  { id: 'sqlite',     label: 'SQLite',       category: 'data',     level: 2 },
  // DevOps
  { id: 'docker',     label: 'Docker',       category: 'devops',   level: 2 },
  { id: 'vercel',     label: 'Vercel',       category: 'devops',   level: 3 },
  { id: 'git',        label: 'Git',          category: 'devops',   level: 3 },
];

const LINKS: Link[] = [
  // JS → tout
  { source: 'js',       target: 'ts',       strength: 0.9 },
  { source: 'js',       target: 'react',    strength: 0.8 },
  { source: 'js',       target: 'node',     strength: 0.8 },
  { source: 'js',       target: 'd3',       strength: 0.6 },
  // TS → frameworks
  { source: 'ts',       target: 'react',    strength: 0.9 },
  { source: 'ts',       target: 'next',     strength: 0.9 },
  { source: 'ts',       target: 'node',     strength: 0.7 },
  { source: 'ts',       target: 'prisma',   strength: 0.6 },
  // React → Next / GSAP / SCSS
  { source: 'react',    target: 'next',     strength: 0.95 },
  { source: 'react',    target: 'gsap',     strength: 0.5 },
  { source: 'react',    target: 'scss',     strength: 0.6 },
  // Next → Vercel
  { source: 'next',     target: 'vercel',   strength: 0.8 },
  // Node → Express / Apollo
  { source: 'node',     target: 'express',  strength: 0.8 },
  { source: 'node',     target: 'apollo',   strength: 0.7 },
  // Backend → BDD
  { source: 'express',  target: 'postgres', strength: 0.6 },
  { source: 'prisma',   target: 'postgres', strength: 0.9 },
  { source: 'prisma',   target: 'sqlite',   strength: 0.7 },
  { source: 'apollo',   target: 'prisma',   strength: 0.5 },
  // Data
  { source: 'd3',       target: 'react',    strength: 0.5 },
  { source: 'python',   target: 'postgres', strength: 0.4 },
  // DevOps
  { source: 'docker',   target: 'node',     strength: 0.5 },
  { source: 'docker',   target: 'postgres', strength: 0.5 },
  { source: 'git',      target: 'vercel',   strength: 0.6 },
];

const COLORS: Record<Category, string> = {
  lang:     '#8B5CF6',  // violet — langages
  frontend: '#60A5FA',  // bleu — frontend
  backend:  '#34D399',  // vert — backend
  data:     '#F59E0B',  // amber — data
  devops:   '#F87171',  // rouge — devops
};

const RADIUS: Record<number, number> = { 1: 18, 2: 24, 3: 32 };

// ─── Composant ────────────────────────────────────────────────────────────────

export default function NetworkGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const tip = tooltipRef.current;
    if (!el || !tip) return;

    let currentSim: d3.Simulation<Node, Link> | null = null;

    const draw = () => {
      const W = el.getBoundingClientRect().width;
      if (!W) return;

      if (currentSim) { currentSim.stop(); currentSim = null; }
      d3.select(el).select('svg').remove();

    const isMobile = W < 480;
    const H = isMobile ? 300 : 420;
    const radius: Record<number, number> = isMobile
      ? { 1: 12, 2: 16, 3: 22 }
      : { 1: 18, 2: 24, 3: 32 };

    // Copie profonde des données — D3 mute les objets
    const nodes: Node[] = NODES.map(n => ({
      ...n,
      // Pré-positionner près du centre → simulation démarre centrée
      x: W / 2 + (Math.random() - 0.5) * 100,
      y: H / 2 + (Math.random() - 0.5) * 100,
    }));
    const links: Link[] = LINKS.map(l => ({ ...l }));

    const svg = d3.select(el).append('svg')
      .attr('width', W)
      .attr('height', H)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .style('width', '100%')
      .style('overflow', 'hidden');

    // ── Zoom ──────────────────────────────────────────────────────────────────
    const zoomG = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 3])
      .on('zoom', (e) => zoomG.attr('transform', e.transform));

    svg.call(zoom);

    // ── Defs : flèches + glow ──────────────────────────────────────────────────
    const defs = svg.append('defs');

    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 28)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', 'rgba(255,255,255,0.15)');

    const glowFilter = defs.append('filter').attr('id', 'glow');
    glowFilter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    const merge = glowFilter.append('feMerge');
    merge.append('feMergeNode').attr('in', 'blur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    // ── Simulation ────────────────────────────────────────────────────────────
    const sim = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links)
        .id(d => d.id)
        .distance(d => (isMobile ? 50 : 80) + (1 - (d as Link).strength) * (isMobile ? 30 : 60))
        .strength(d => (d as Link).strength * 0.4)
      )
      .force('charge', d3.forceManyBody().strength(isMobile ? -140 : -280))
      .force('center', d3.forceCenter(W / 2, H / 2).strength(0.8))
      .force('collide', d3.forceCollide<Node>().radius(d => radius[d.level] + 8));

    // ── Links ─────────────────────────────────────────────────────────────────
    const linkEl = zoomG.append('g').selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke', 'rgba(255,255,255,0.1)')
      .attr('stroke-width', d => (d as Link).strength * 2)
      .attr('marker-end', 'url(#arrow)');

    // ── Nodes ─────────────────────────────────────────────────────────────────
    const nodeG = zoomG.append('g').selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('cursor', 'grab')
      .call(
        d3.drag<SVGGElement, Node>()
          .on('start', (event, d) => {
            if (!event.active) sim.alphaTarget(0.3).restart();
            d.fx = d.x; d.fy = d.y;
            d3.select(event.sourceEvent.currentTarget).attr('cursor', 'grabbing');
          })
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
          .on('end', (event, d) => {
            if (!event.active) sim.alphaTarget(0);
            d.fx = null; d.fy = null;
            d3.select(event.sourceEvent.currentTarget).attr('cursor', 'grab');
          })
      )
      .on('mouseenter', (event: MouseEvent, d: Node) => {
        const rect = el.getBoundingClientRect();
        const connected = links
          .filter(l => (l.source as Node).id === d.id || (l.target as Node).id === d.id)
          .map(l => (l.source as Node).id === d.id
            ? (l.target as Node).label
            : (l.source as Node).label
          ).join(', ');
        tip.innerHTML = `<strong>${d.label}</strong><span>${d.category}</span>${connected ? `<span style="color:rgba(234,234,234,0.4);font-size:11px">→ ${connected}</span>` : ''}`;
        tip.style.left    = `${event.clientX - rect.left + 14}px`;
        tip.style.top     = `${event.clientY - rect.top  - 12}px`;
        tip.style.opacity = '1';
        // Highlight node
        d3.select(event.currentTarget as SVGGElement).select('circle')
          .attr('filter', 'url(#glow)')
          .attr('stroke-width', '3');
      })
      .on('mousemove', (event: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        tip.style.left = `${event.clientX - rect.left + 14}px`;
        tip.style.top  = `${event.clientY - rect.top  - 12}px`;
      })
      .on('mouseleave', (event: MouseEvent) => {
        tip.style.opacity = '0';
        d3.select(event.currentTarget as SVGGElement).select('circle')
          .attr('filter', null)
          .attr('stroke-width', '1.5');
      });

    // Cercle
    nodeG.append('circle')
      .attr('r', d => radius[d.level])
      .attr('fill', d => `${COLORS[d.category]}22`)
      .attr('stroke', d => COLORS[d.category])
      .attr('stroke-width', 1.5);

    // Label
    nodeG.append('text')
      .text(d => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#EAEAEA')
      .attr('font-size', d => isMobile ? '8px' : d.level === 3 ? '11px' : '10px')
      .attr('font-family', 'var(--font-mono)')
      .attr('pointer-events', 'none')
      .style('user-select', 'none');

    // ── Tick ──────────────────────────────────────────────────────────────────
    sim.on('tick', () => {
      linkEl
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!);

      nodeG.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    currentSim = sim;
    }; // fin draw()

    const observer = new ResizeObserver(draw);
    observer.observe(el);
    draw(); // tentative initiale

    return () => {
      observer.disconnect();
      if (currentSim) currentSim.stop();
      d3.select(el).select('svg').remove();
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      {/* Légende */}
      <div className="network-legend">
        {(Object.entries(COLORS) as [Category, string][]).map(([cat, color]) => (
          <span key={cat} className="legend-item">
            <span className="legend-dot" style={{ background: color }} />
            {cat}
          </span>
        ))}
        <span className="legend-hint">Drag · Scroll to zoom</span>
      </div>
      <div ref={containerRef} style={{ width: '100%' }} />
      <div ref={tooltipRef} className="d3-tooltip" style={{ opacity: 0 }} />
    </div>
  );
}
