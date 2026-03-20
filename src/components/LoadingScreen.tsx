import { useEffect, useState } from 'react';

interface Props {
  onDone: () => void;
}

export default function LoadingScreen({ onDone }: Props) {
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar from 0 to 100 over 2 seconds
    const start = performance.now();
    const duration = 2000;
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);

    const fadeTimer = setTimeout(() => setFading(true), 2000);
    const doneTimer = setTimeout(() => onDone(), 2600);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <>
      <style>{`
        @keyframes drawBuilding {
          from { stroke-dashoffset: 600; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .loading-fade-out {
          transition: opacity 0.6s ease;
          opacity: 0 !important;
          pointer-events: none;
        }
      `}</style>

      <div
        className={fading ? 'loading-fade-out' : ''}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#0f1117',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 1,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Animated building SVG */}
        <svg
          viewBox="0 0 120 130"
          width="120"
          height="130"
          style={{ marginBottom: '28px', filter: 'drop-shadow(0 0 18px #f59e0b55)' }}
        >
          {/* Building outline — stroke-dashoffset animation draws it progressively */}
          <g
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="600"
            style={{
              animation: 'drawBuilding 1.8s ease-out forwards',
            }}
          >
            {/* Main building body */}
            <rect x="20" y="45" width="80" height="75" />
            {/* Roof / gable */}
            <polyline points="12,45 60,10 108,45" />
            {/* Door */}
            <rect x="48" y="90" width="24" height="30" rx="2" />
            {/* Windows row 1 */}
            <rect x="28" y="56" width="18" height="16" rx="2" />
            <rect x="74" y="56" width="18" height="16" rx="2" />
            {/* Windows row 2 */}
            <rect x="28" y="78" width="18" height="14" rx="2" />
            <rect x="74" y="78" width="18" height="14" rx="2" />
            {/* Chimney */}
            <rect x="78" y="18" width="10" height="18" />
          </g>
          {/* Subtle amber fill on body (no animation, just static) */}
          <rect x="20" y="45" width="80" height="75" fill="#f59e0b08" />
        </svg>

        {/* Title */}
        <h1
          style={{
            margin: 0,
            fontSize: '42px',
            fontWeight: 900,
            color: '#f59e0b',
            letterSpacing: '2px',
            textShadow: '0 0 30px #f59e0b66',
            animation: 'fadeInUp 0.7s ease 0.3s both',
          }}
        >
          Balibagus
        </h1>

        {/* Subtitle */}
        <p
          style={{
            margin: '8px 0 0',
            fontSize: '13px',
            color: '#64748b',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            animation: 'fadeInUp 0.7s ease 0.55s both',
          }}
        >
          Bali Investment Intelligence
        </p>

        {/* Progress bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '220px',
            animation: 'fadeInUp 0.5s ease 0.2s both',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '3px',
              background: '#1e293b',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #d97706, #f59e0b)',
                borderRadius: '2px',
                transition: 'width 0.05s linear',
                boxShadow: '0 0 8px #f59e0b88',
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
