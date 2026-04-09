'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// ─── Données fictives réalistes : missions freelance tech / 100k hab. ─────────

const REGION_DATA: Record<string, number> = {
  'Île-de-France':              284,
  'Auvergne-Rhône-Alpes':       142,
  'Provence-Alpes-Côte d\'Azur': 127,
  'Occitanie':                   98,
  'Bretagne':                    94,
  'Nouvelle-Aquitaine':          89,
  'Pays de la Loire':            88,
  'Centre-Val de Loire':         74,
  'Normandie':                   71,
  'Grand Est':                   76,
  'Hauts-de-France':             68,
  'Bourgogne-Franche-Comté':     62,
  'Corse':                       31,
};

const GEOJSON_URL =
  'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-version-simplifiee.geojson';

// ─── Composant ────────────────────────────────────────────────────────────────

export default function ChoroplethMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el  = containerRef.current!;
    const tip = tooltipRef.current!;

    const W = el.getBoundingClientRect().width || 680;
    const H = Math.min(W * 0.9, 580);

    const svg = d3.select(el).append('svg')
      .attr('width', W)
      .attr('height', H)
      .attr('viewBox', `0 0 ${W} ${H}`)
      .style('width', '100%')
      .style('overflow', 'visible');

    // ── Projection Mercator centrée sur la France métropolitaine ──────────────
    const projection = d3.geoConicConformal()
      .center([2.454071, 46.279229])
      .parallels([44, 49])
      .scale(W * 4.2)
      .translate([W / 2, H / 2 - H * 0.04]);

    const path = d3.geoPath().projection(projection);

    // ── Échelle couleur violet ────────────────────────────────────────────────
    const values = Object.values(REGION_DATA);
    const [vMin, vMax] = [d3.min(values)!, d3.max(values)!];

    const colorScale = d3.scaleSequential()
      .domain([vMin, vMax])
      .interpolator(d3.interpolate('rgba(139,92,246,0.08)', 'rgba(139,92,246,0.95)'));

    // ── Chargement GeoJSON ────────────────────────────────────────────────────
    d3.json(GEOJSON_URL).then((geojson: unknown) => {
      const geo = geojson as GeoJSON.FeatureCollection;

      // Régions
      svg.append('g')
        .selectAll('path')
        .data(geo.features)
        .enter().append('path')
        .attr('d', path as unknown as string)
        .attr('fill', f => {
          const name  = f.properties?.nom as string;
          const value = REGION_DATA[name];
          return value !== undefined ? colorScale(value) : 'rgba(255,255,255,0.04)';
        })
        .attr('stroke', 'rgba(255,255,255,0.15)')
        .attr('stroke-width', 0.8)
        .attr('cursor', 'pointer')
        .attr('opacity', 0)
        .on('mouseenter', (event: MouseEvent, f: GeoJSON.Feature) => {
          const name  = f.properties?.nom as string;
          const value = REGION_DATA[name];
          const rect  = el.getBoundingClientRect();
          tip.innerHTML = `
            <strong>${name}</strong>
            <span>${value !== undefined ? `${value} missions / 100k hab.` : 'Données indisponibles'}</span>
          `;
          tip.style.left    = `${event.clientX - rect.left + 14}px`;
          tip.style.top     = `${event.clientY - rect.top  - 12}px`;
          tip.style.opacity = '1';
          d3.select(event.currentTarget as Element)
            .attr('stroke', '#A78BFA')
            .attr('stroke-width', 1.8);
        })
        .on('mousemove', (event: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          tip.style.left = `${event.clientX - rect.left + 14}px`;
          tip.style.top  = `${event.clientY - rect.top  - 12}px`;
        })
        .on('mouseleave', (event: MouseEvent) => {
          tip.style.opacity = '0';
          d3.select(event.currentTarget as Element)
            .attr('stroke', 'rgba(255,255,255,0.15)')
            .attr('stroke-width', 0.8);
        })
        // Animation apparition décalée
        .transition().duration(500)
        .delay((_, i) => i * 40)
        .attr('opacity', 1);

      // Labels régions — masqués sur mobile (trop petits / chevauchement)
      const LABELED = new Set([
        'Île-de-France', 'Auvergne-Rhône-Alpes', 'Occitanie',
        'Nouvelle-Aquitaine', 'Grand Est', 'Hauts-de-France',
        'Bretagne', 'Normandie', 'Provence-Alpes-Côte d\'Azur',
      ]);

      if (W >= 480) svg.append('g')
        .selectAll('text')
        .data(geo.features.filter(f => LABELED.has(f.properties?.nom)))
        .enter().append('text')
        .attr('transform', f => {
          const c = path.centroid(f as unknown as d3.GeoPermissibleObjects);
          return `translate(${c[0]},${c[1]})`;
        })
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', 'rgba(234,234,234,0.7)')
        .attr('font-size', `${Math.max(8, W / 100)}px`)
        .attr('font-family', 'var(--font-mono)')
        .attr('pointer-events', 'none')
        .style('user-select', 'none')
        .text(f => {
          const name = f.properties?.nom as string;
          const val  = REGION_DATA[name];
          return val !== undefined ? String(val) : '';
        });

    }).catch(() => {
      svg.append('text')
        .attr('x', W / 2).attr('y', H / 2)
        .attr('text-anchor', 'middle')
        .attr('fill', 'rgba(234,234,234,0.3)')
        .attr('font-family', 'var(--font-mono)')
        .attr('font-size', '13px')
        .text('Impossible de charger la carte (réseau requis)');
    });

    return () => { d3.select(el).select('svg').remove(); };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      {/* Légende */}
      <div className="choropleth-legend">
        <span className="legend-label">Faible</span>
        <div className="legend-gradient" />
        <span className="legend-label">Élevé</span>
        <span className="legend-unit">missions freelance tech / 100k hab. — données fictives</span>
      </div>
      <div ref={containerRef} style={{ width: '100%' }} />
      <div ref={tooltipRef} className="d3-tooltip" style={{ opacity: 0 }} />
    </div>
  );
}
