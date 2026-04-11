'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';

// ─── Données ──────────────────────────────────────────────────────────────────

type Period = '3m' | '6m' | '12m';

interface MonthData {
  month: string;
  visits: number;
  conversions: number;
  revenue: number;
}

const ALL_DATA: MonthData[] = [
  { month: 'Mai 25',   visits: 1240, conversions: 38,  revenue: 3800  },
  { month: 'Jun 25',   visits: 1580, conversions: 51,  revenue: 5100  },
  { month: 'Jul 25',   visits: 1320, conversions: 42,  revenue: 4200  },
  { month: 'Aoû 25',   visits: 980,  conversions: 29,  revenue: 2900  },
  { month: 'Sep 25',   visits: 1750, conversions: 63,  revenue: 6300  },
  { month: 'Oct 25',   visits: 2100, conversions: 78,  revenue: 7800  },
  { month: 'Nov 25',   visits: 2340, conversions: 91,  revenue: 9100  },
  { month: 'Déc 25',   visits: 1890, conversions: 72,  revenue: 7200  },
  { month: 'Jan 26',   visits: 2560, conversions: 104, revenue: 10400 },
  { month: 'Fév 26',   visits: 2980, conversions: 127, revenue: 12700 },
  { month: 'Mar 26',   visits: 3240, conversions: 148, revenue: 14800 },
  { month: 'Avr 26',   visits: 3610, conversions: 163, revenue: 16300 },
];

const PERIOD_SLICE: Record<Period, number> = { '3m': 3, '6m': 6, '12m': 12 };

// ─── Composant ────────────────────────────────────────────────────────────────

export default function AnalyticsDashboard() {
  const svgRef     = useRef<SVGSVGElement>(null);
  const lineRef    = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);  // tooltip DOM direct — pas de state
  const [period, setPeriod] = useState<Period>('6m');

  // useMemo : référence stable → useEffect ne se relance que si period change
  const data = useMemo(
    () => ALL_DATA.slice(-PERIOD_SLICE[period]),
    [period]
  );

  const totalVisits      = useMemo(() => data.reduce((s, d) => s + d.visits, 0), [data]);
  const totalConversions = useMemo(() => data.reduce((s, d) => s + d.conversions, 0), [data]);
  const totalRevenue     = useMemo(() => data.reduce((s, d) => s + d.revenue, 0), [data]);
  const convRate         = ((totalConversions / totalVisits) * 100).toFixed(1);

  // ── Bar chart ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const svgEl  = svgRef.current;
    const tip    = tooltipRef.current;
    if (!svgEl || !tip) return;
    const container = svgEl.parentElement;
    if (!container) return;

    const draw = () => {
      const W = container.getBoundingClientRect().width;
      if (!W) return; // container pas encore layouté — ResizeObserver va retry

      const svg = d3.select(svgEl);
      svg.selectAll('*').remove();

      const isMobile = W < 480;
      const H = isMobile ? 200 : 220;
      const margin = {
        top: 16,
        right: isMobile ? 8 : 16,
        bottom: isMobile ? 52 : 40,
        left: isMobile ? 38 : 52,
      };
      const innerW = W - margin.left - margin.right;
      const innerH = H - margin.top - margin.bottom;

      svg.attr('width', W).attr('height', H).attr('viewBox', `0 0 ${W} ${H}`);

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand()
        .domain(data.map(d => d.month))
        .range([0, innerW])
        .padding(0.35);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.visits)! * 1.1])
        .range([innerH, 0]);

      // Grid lines
      g.selectAll('.grid-line')
        .data(y.ticks(isMobile ? 3 : 4))
        .enter().append('line')
        .attr('class', 'grid-line')
        .attr('x1', 0).attr('x2', innerW)
        .attr('y1', d => y(d)).attr('y2', d => y(d))
        .attr('stroke', 'rgba(255,255,255,0.06)')
        .attr('stroke-dasharray', '4,4');

      // Axe X — labels en diagonale sur mobile pour éviter le chevauchement
      const xAxis = g.append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(x).tickSize(0))
        .call(ax => ax.select('.domain').remove());

      xAxis.selectAll('text')
        .attr('fill', 'rgba(234,234,234,0.5)')
        .attr('font-size', isMobile ? '9px' : '11px')
        .attr('text-anchor', isMobile ? 'end' : 'middle')
        .attr('dx', isMobile ? '-0.4em' : '0')
        .attr('dy', isMobile ? '0.4em' : '1.2em')
        .attr('transform', isMobile ? 'rotate(-40)' : null);

      g.append('g')
        .call(d3.axisLeft(y).ticks(isMobile ? 3 : 4).tickFormat(v => {
          const n = v as number;
          return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
        }).tickSize(0))
        .call(ax => ax.select('.domain').remove())
        .selectAll('text')
        .attr('fill', 'rgba(234,234,234,0.5)')
        .attr('font-size', isMobile ? '9px' : '11px')
        .attr('dx', '-6px');

      // Dégradé violet
      const defs = svg.append('defs');
      const grad = defs.append('linearGradient')
        .attr('id', 'bar-grad').attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
      grad.append('stop').attr('offset', '0%').attr('stop-color', '#8B5CF6');
      grad.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(139,92,246,0.2)');

      // Barres
      g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.month)!)
        .attr('width', x.bandwidth())
        .attr('y', innerH)
        .attr('height', 0)
        .attr('rx', 4)
        .attr('fill', 'url(#bar-grad)')
        .on('mouseenter', (event: MouseEvent, d: MonthData) => {
          const cr = container.getBoundingClientRect();
          tip.innerHTML = `<strong>${d.month}</strong><span>${d.visits.toLocaleString('fr-FR')} visites</span><span>${d.conversions} conversions</span>`;
          tip.style.left = `${event.clientX - cr.left + 12}px`;
          tip.style.top  = `${event.clientY - cr.top  - 16}px`;
          tip.style.opacity = '1';
          d3.select(event.currentTarget as Element).attr('fill', '#A78BFA');
        })
        .on('mousemove', (event: MouseEvent) => {
          const cr = container.getBoundingClientRect();
          tip.style.left = `${event.clientX - cr.left + 12}px`;
          tip.style.top  = `${event.clientY - cr.top  - 16}px`;
        })
        .on('mouseleave', (event: MouseEvent) => {
          tip.style.opacity = '0';
          d3.select(event.currentTarget as Element).attr('fill', 'url(#bar-grad)');
        })
        .transition().duration(600).ease(d3.easeCubicOut)
        .attr('y', d => y(d.visits))
        .attr('height', d => innerH - y(d.visits));
    };

    const observer = new ResizeObserver(draw);
    observer.observe(container);
    draw(); // tentative initiale

    return () => observer.disconnect();
  }, [data]);

  // ── Line chart ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const lineEl = lineRef.current;
    if (!lineEl) return;
    const container = lineEl.parentElement;
    if (!container) return;

    const draw = () => {
      const W = container.getBoundingClientRect().width;
      if (!W) return; // container pas encore layouté — ResizeObserver va retry

      const svg = d3.select(lineEl);
      svg.selectAll('*').remove();

      const isMobile = W < 480;
      const H = isMobile ? 150 : 160;
      const margin = {
        top: 16,
        right: isMobile ? 8 : 16,
        bottom: isMobile ? 48 : 36,
        left: isMobile ? 34 : 48,
      };
      const innerW = W - margin.left - margin.right;
      const innerH = H - margin.top - margin.bottom;

      svg.attr('width', W).attr('height', H).attr('viewBox', `0 0 ${W} ${H}`);

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scalePoint()
        .domain(data.map(d => d.month))
        .range([0, innerW])
        .padding(0.2);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.conversions)! * 1.15])
        .range([innerH, 0]);

      // Grid
      g.selectAll('.gl')
        .data(y.ticks(3))
        .enter().append('line')
        .attr('x1', 0).attr('x2', innerW)
        .attr('y1', d => y(d)).attr('y2', d => y(d))
        .attr('stroke', 'rgba(255,255,255,0.06)')
        .attr('stroke-dasharray', '4,4');

      // Axes
      const xAxisLine = g.append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(x).tickSize(0))
        .call(ax => ax.select('.domain').remove());

      xAxisLine.selectAll('text')
        .attr('fill', 'rgba(234,234,234,0.5)')
        .attr('font-size', isMobile ? '9px' : '11px')
        .attr('text-anchor', isMobile ? 'end' : 'middle')
        .attr('dx', isMobile ? '-0.4em' : '0')
        .attr('dy', isMobile ? '0.4em' : '1.2em')
        .attr('transform', isMobile ? 'rotate(-40)' : null);

      g.append('g')
        .call(d3.axisLeft(y).ticks(3).tickSize(0))
        .call(ax => ax.select('.domain').remove())
        .selectAll('text')
        .attr('fill', 'rgba(234,234,234,0.5)')
        .attr('font-size', isMobile ? '9px' : '11px')
        .attr('dx', '-6px');

      // Area gradient
      const defs = svg.append('defs');
      const areaGrad = defs.append('linearGradient')
        .attr('id', 'line-area-grad').attr('x1', '0').attr('y1', '0').attr('x2', '0').attr('y2', '1');
      areaGrad.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(139,92,246,0.3)');
      areaGrad.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(139,92,246,0)');

      // Area
      const area = d3.area<MonthData>()
        .x(d => x(d.month)!)
        .y0(innerH)
        .y1(d => y(d.conversions))
        .curve(d3.curveCatmullRom);

      g.append('path')
        .datum(data)
        .attr('fill', 'url(#line-area-grad)')
        .attr('d', area);

      // Line
      const line = d3.line<MonthData>()
        .x(d => x(d.month)!)
        .y(d => y(d.conversions))
        .curve(d3.curveCatmullRom);

      const path = g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#8B5CF6')
        .attr('stroke-width', 2.5)
        .attr('d', line);

      // Animation draw
      const len = (path.node() as SVGPathElement).getTotalLength();
      path
        .attr('stroke-dasharray', len)
        .attr('stroke-dashoffset', len)
        .transition().duration(900).ease(d3.easeCubicInOut)
        .attr('stroke-dashoffset', 0);

      // Dots
      g.selectAll('.dot')
        .data(data)
        .enter().append('circle')
        .attr('cx', d => x(d.month)!)
        .attr('cy', d => y(d.conversions))
        .attr('r', 4)
        .attr('fill', '#8B5CF6')
        .attr('stroke', '#0A0A0A')
        .attr('stroke-width', 2)
        .attr('opacity', 0)
        .transition().delay(800).duration(200)
        .attr('opacity', 1);
    };

    const observer = new ResizeObserver(draw);
    observer.observe(container);
    draw(); // tentative initiale

    return () => observer.disconnect();
  }, [data]);

  return (
    <div className="analytics-dashboard">
      {/* KPIs */}
      <div className="kpi-row">
        <div className="kpi-card">
          <span className="kpi-label">Visites totales</span>
          <span className="kpi-value">{totalVisits.toLocaleString('fr-FR')}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Conversions</span>
          <span className="kpi-value">{totalConversions.toLocaleString('fr-FR')}</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Taux de conv.</span>
          <span className="kpi-value accent">{convRate}%</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Revenus (€)</span>
          <span className="kpi-value">{totalRevenue.toLocaleString('fr-FR')}</span>
        </div>
      </div>

      {/* Filtres temporels */}
      <div className="period-filters">
        {(['3m', '6m', '12m'] as Period[]).map(p => (
          <button
            key={p}
            className={`period-btn${period === p ? ' active' : ''}`}
            onClick={() => setPeriod(p)}
          >
            {p === '3m' ? '3 mois' : p === '6m' ? '6 mois' : '12 mois'}
          </button>
        ))}
      </div>

      {/* Bar chart */}
      <div className="chart-block">
        <h3 className="chart-title">Visites mensuelles</h3>
        <div className="chart-wrap" style={{ position: 'relative' }}>
          <svg ref={svgRef} style={{ width: '100%', display: 'block' }} />
          {/* Tooltip DOM — manipulé directement, jamais via setState */}
          <div ref={tooltipRef} className="d3-tooltip" style={{ opacity: 0 }} />
        </div>
      </div>

      {/* Line chart */}
      <div className="chart-block">
        <h3 className="chart-title">Conversions — évolution</h3>
        <div className="chart-wrap">
          <svg ref={lineRef} style={{ width: '100%', display: 'block' }} />
        </div>
      </div>
    </div>
  );
}
