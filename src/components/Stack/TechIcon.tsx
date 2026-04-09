// =============================================================================
// TechIcon.tsx — Inline SVG icons for each technology (24×24 viewBox)
// =============================================================================

interface IconProps {
  color: string;
}

function ReactIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="28" height="28">
      <ellipse cx="12" cy="12" rx="10.5" ry="3.6" stroke={color} strokeWidth="1.4"/>
      <ellipse cx="12" cy="12" rx="10.5" ry="3.6" stroke={color} strokeWidth="1.4" transform="rotate(60 12 12)"/>
      <ellipse cx="12" cy="12" rx="10.5" ry="3.6" stroke={color} strokeWidth="1.4" transform="rotate(120 12 12)"/>
      <circle cx="12" cy="12" r="2.1" fill={color}/>
    </svg>
  );
}

function NextIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="28" height="28">
      <path d="M12 2L2 20h20L12 2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M12 8v6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 14l3-6 3 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function NodeIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="28" height="28">
      <path d="M12 2l9 5.2v9.6L12 22l-9-5.2V7.2L12 2z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M9 9v6M15 9v2.5a2.5 2.5 0 0 1-5 0" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function GitIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="28" height="28">
      <circle cx="6" cy="6" r="2.5" fill={color}/>
      <circle cx="18" cy="6" r="2.5" fill={color}/>
      <circle cx="6" cy="18" r="2.5" fill={color}/>
      <line x1="6" y1="8.6" x2="6" y2="15.4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M6 8.6C6 12.5 18 12.5 18 8.6" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function FigmaIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="28" height="28">
      <rect x="5" y="2" width="7" height="6" rx="3" fill={color} opacity="0.9"/>
      <rect x="12" y="2" width="7" height="6" rx="3" fill={color} opacity="0.65"/>
      <rect x="5" y="9" width="7" height="6" rx="3" fill={color} opacity="0.75"/>
      <circle cx="15.5" cy="12" r="3.5" fill={color} opacity="0.85"/>
      <rect x="5" y="16" width="7" height="6" rx="3" fill={color} opacity="0.55"/>
    </svg>
  );
}

function ApolloIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="28" height="28">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5"/>
      <path d="M8 16l2.5-8 1.5 5 1.5-5L16 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DbIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="28" height="28">
      <ellipse cx="12" cy="7" rx="9" ry="3" stroke={color} strokeWidth="1.4"/>
      <path d="M3 7v5c0 1.66 4.03 3 9 3s9-1.34 9-3V7" stroke={color} strokeWidth="1.4"/>
      <path d="M3 12v5c0 1.66 4.03 3 9 3s9-1.34 9-3v-5" stroke={color} strokeWidth="1.4"/>
    </svg>
  );
}

function BracketsIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="28" height="28">
      <path d="M7 4H4v16h3M17 4h3v16h-3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 8l-3 4 3 4M14 8l3 4-3 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CurlyIcon({ color }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="28" height="28">
      <path d="M8 4C6.5 4 6 5 6 6.5C6 8 7 8.5 7 10C7 11.5 5.5 12 5.5 12C5.5 12 7 12.5 7 14C7 15.5 6 16 6 17.5C6 19 6.5 20 8 20"
        stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M16 4C17.5 4 18 5 18 6.5C18 8 17 8.5 17 10C17 11.5 18.5 12 18.5 12C18.5 12 17 12.5 17 14C17 15.5 18 16 18 17.5C18 19 17.5 20 16 20"
        stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function TextIcon({ color, label }: IconProps & { label: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="28" height="28">
      <text
        x="12" y="16"
        textAnchor="middle"
        fill={color}
        fontSize={label.length > 2 ? '8' : '10'}
        fontWeight="800"
        fontFamily="'JetBrains Mono', monospace"
        letterSpacing="-0.5"
      >
        {label}
      </text>
    </svg>
  );
}

// =============================================================================
// Main export — pick the right icon per tech name
// =============================================================================

export default function TechIcon({ name, color }: { name: string; color: string }) {
  switch (name) {
    case 'React':      return <ReactIcon color={color}/>;
    case 'Next.js':    return <NextIcon color={color}/>;
    case 'Node.js':    return <NodeIcon color={color}/>;
    case 'Git':        return <GitIcon color={color}/>;
    case 'Figma':      return <FigmaIcon color={color}/>;
    case 'Apollo':     return <ApolloIcon color={color}/>;
    case 'SQLite':     return <DbIcon color={color}/>;
    case 'MySQL':      return <DbIcon color={color}/>;
    case 'HTML':       return <BracketsIcon color={color}/>;
    case 'SCSS':       return <CurlyIcon color={color}/>;
    case 'TypeScript': return <TextIcon color={color} label="TS"/>;
    case 'D3.js':      return <TextIcon color={color} label="D3"/>;
    default:           return <TextIcon color={color} label={name.slice(0, 2).toUpperCase()}/>;
  }
}
