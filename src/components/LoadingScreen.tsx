import { useEffect, useState } from 'react';

interface Props {
  onDone: () => void;
}

const LOADING_STEPS = [
  'Updating real estate data…',
  'Computing zone scores…',
  'Building the map…',
  'Calculating projections…',
];

export default function LoadingScreen({ onDone }: Props) {
  const [fading, setFading] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  useEffect(() => {
    // Show loading steps one by one every 1.25s
    const timers: ReturnType<typeof setTimeout>[] = [];
    LOADING_STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setVisibleSteps((prev) => [...prev, i]);
      }, i * 1250 + 300));
    });

    const fadeTimer = setTimeout(() => setFading(true), 4500);
    const doneTimer = setTimeout(() => onDone(), 5200);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <>
      <style>{`
        @keyframes ls-fade-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ls-title-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Platform base: draws 0s → 1s */
        @keyframes draw-base {
          from { stroke-dashoffset: 400; }
          to   { stroke-dashoffset: 0; }
        }
        /* Columns: draws 1s → 2s */
        @keyframes draw-columns {
          from { stroke-dashoffset: 300; }
          to   { stroke-dashoffset: 0; }
        }
        /* Roof tiers: draws 2s → 4s */
        @keyframes draw-roof {
          from { stroke-dashoffset: 700; }
          to   { stroke-dashoffset: 0; }
        }
        /* Decorative details: draws 4s → 5s */
        @keyframes draw-details {
          from { stroke-dashoffset: 400; }
          to   { stroke-dashoffset: 0; }
        }

        .ls-base    { stroke-dasharray: 400; stroke-dashoffset: 400; animation: draw-base    1s ease-out 0s    forwards; }
        .ls-columns { stroke-dasharray: 300; stroke-dashoffset: 300; animation: draw-columns 1s ease-out 1s    forwards; }
        .ls-roof    { stroke-dasharray: 700; stroke-dashoffset: 700; animation: draw-roof    2s ease-out 2s    forwards; }
        .ls-details { stroke-dasharray: 400; stroke-dashoffset: 400; animation: draw-details 1s ease-out 4s    forwards; }

        .ls-title   { opacity: 0; animation: ls-title-in 0.8s ease 2s forwards; }
        .ls-step    { opacity: 0; animation: ls-fade-in-up 0.5s ease forwards; }

        .ls-overlay {
          transition: opacity 0.7s ease;
        }
        .ls-overlay.fading {
          opacity: 0 !important;
          pointer-events: none;
        }
      `}</style>

      <div
        className={`ls-overlay${fading ? ' fading' : ''}`}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#faf8f4',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 1,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Joglo SVG — draws itself progressively */}
        <svg
          viewBox="0 0 200 180"
          width="200"
          height="180"
          style={{ marginBottom: '20px' }}
          fill="none"
          stroke="#c0392b"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* ── Platform / Base (0–1s) ── */}
          <g className="ls-base" strokeWidth="2.5">
            {/* Base platform rectangle */}
            <rect x="30" y="148" width="140" height="14" rx="2" />
            {/* Ground line */}
            <line x1="20" y1="162" x2="180" y2="162" />
          </g>

          {/* ── Columns & Walls (1–2s) ── */}
          <g className="ls-columns" strokeWidth="2">
            {/* Left column */}
            <line x1="52" y1="148" x2="52" y2="120" />
            {/* Center-left column */}
            <line x1="82" y1="148" x2="82" y2="120" />
            {/* Center-right column */}
            <line x1="118" y1="148" x2="118" y2="120" />
            {/* Right column */}
            <line x1="148" y1="148" x2="148" y2="120" />
            {/* Wall panels between columns */}
            <line x1="30" y1="120" x2="170" y2="120" />
            {/* Side walls */}
            <line x1="30" y1="120" x2="30" y2="148" />
            <line x1="170" y1="120" x2="170" y2="148" />
            {/* Central door arch */}
            <path d="M92,148 L92,132 Q100,126 108,132 L108,148" />
          </g>

          {/* ── Tiered Roof (2–4s) ── */}
          <g className="ls-roof" strokeWidth="2.5">
            {/* Base (widest) roof tier — with upturned corners */}
            <path d="M18,120 Q100,108 182,120" />
            <path d="M18,120 Q14,122 10,118" />
            <path d="M182,120 Q186,122 190,118" />

            {/* Second roof tier */}
            <path d="M36,108 Q100,96 164,108" />
            <path d="M36,108 Q33,110 30,107" />
            <path d="M164,108 Q167,110 170,107" />

            {/* Top roof tier (narrowest) */}
            <path d="M58,96 Q100,84 142,96" />
            <path d="M58,96 Q55,98 52,95" />
            <path d="M142,96 Q145,98 148,95" />

            {/* Peak / finial */}
            <path d="M82,84 Q100,72 118,84" />
            <path d="M100,72 L100,64" />
            {/* Roof ridge line */}
            <line x1="60" y1="95" x2="140" y2="95" />
          </g>

          {/* ── Decorative Details (4–5s) ── */}
          <g className="ls-details" strokeWidth="1.5" stroke="#8B2500">
            {/* Ornamental peak finial */}
            <path d="M96,64 L100,56 L104,64" />
            <line x1="100" y1="56" x2="100" y2="52" />
            {/* Decorative carved panels on walls */}
            <rect x="38" y="124" width="12" height="18" rx="1" />
            <rect x="57" y="124" width="12" height="18" rx="1" />
            <rect x="131" y="124" width="12" height="18" rx="1" />
            <rect x="150" y="124" width="12" height="18" rx="1" />
            {/* Roof overhang details */}
            <line x1="20" y1="118" x2="180" y2="118" />
            <line x1="38" y1="106" x2="162" y2="106" />
          </g>
        </svg>

        {/* Title */}
        <h1
          className="ls-title"
          style={{
            margin: 0,
            fontSize: '36px',
            fontWeight: 900,
            color: '#c0392b',
            letterSpacing: '1px',
          }}
        >
          Bali Bagus
        </h1>

        {/* Subtitle */}
        <p
          style={{
            margin: '6px 0 0',
            fontSize: '11px',
            color: '#9c8877',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            opacity: 0,
            animation: 'ls-title-in 0.8s ease 2.3s forwards',
          }}
        >
          Bali Investment Intelligence
        </p>

        {/* Loading steps */}
        <div style={{ marginTop: '32px', minHeight: '80px', textAlign: 'center' }}>
          {LOADING_STEPS.map((step, i) => (
            <p
              key={step}
              className="ls-step"
              style={{
                margin: '4px 0',
                fontSize: '13px',
                color: '#6b5c4e',
                animationDelay: `${i * 1.25 + 0.3}s`,
                display: visibleSteps.includes(i) ? 'block' : 'none',
              }}
            >
              {step}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}
