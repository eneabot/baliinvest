import { useState } from 'react';
import { getScoreColor } from '../data/zones';
import type { Zone } from '../data/zones';
import LandMarketPanel from './LandMarketPanel';
import { LISTINGS_LINKS } from './ZonePopup';

interface Props {
  zone: Zone & { globalScore: number };
  onBack: () => void;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = getScoreColor(value);
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '13px', color: '#94a3b8' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color }}>{value}/100</span>
      </div>
      <div style={{ height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${value}%`,
            height: '100%',
            background: color,
            borderRadius: '4px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  );
}

// Gradient palette for photo placeholders
const ZONE_GRADIENTS: Record<string, string> = {
  canggu: 'linear-gradient(135deg, #1a3a2a, #2d6a4f)',
  seminyak: 'linear-gradient(135deg, #2a1a3a, #6a2d6a)',
  uluwatu: 'linear-gradient(135deg, #1a2a3a, #2d4a6a)',
  ubud: 'linear-gradient(135deg, #1a3a1a, #4a7a2e)',
  pererenan: 'linear-gradient(135deg, #1e3a2a, #3d7a3a)',
  nusadua: 'linear-gradient(135deg, #1a2e3a, #1e5f7a)',
  sanur: 'linear-gradient(135deg, #1a3a3a, #2e7a6a)',
  tabanan: 'linear-gradient(135deg, #2a3a1a, #5a7a2a)',
  amed: 'linear-gradient(135deg, #1a2a3a, #3a5a7a)',
  buleleng: 'linear-gradient(135deg, #2a2a3a, #4a4a7a)',
  jimbaran: 'linear-gradient(135deg, #3a2a1a, #7a5a2e)',
  keramas: 'linear-gradient(135deg, #1a3a2e, #2e7a5a)',
  lombok: 'linear-gradient(135deg, #3a1a1a, #7a2e2e)',
  'lombok-kuta': 'linear-gradient(135deg, #3a1a2a, #7a2e5a)',
  'lombok-gili': 'linear-gradient(135deg, #1a2e3a, #2e5f7a)',
  'lombok-north': 'linear-gradient(135deg, #1a3a2e, #3a7a5a)',
  'nusa-lembongan': 'linear-gradient(135deg, #1a2a3a, #2a4a7a)',
  'nusa-penida': 'linear-gradient(135deg, #2a1a3a, #5a3a7a)',
};

export default function RegionPage({ zone, onBack }: Props) {
  const [ares, setAres] = useState(2);
  const [construction, setConstruction] = useState(150000);

  const revpar = Math.round(zone.raw.avgNightlyRate * zone.raw.occupancyRate * 365);
  const totalInvest = ares * zone.raw.landPricePerAre + construction;
  const roi = totalInvest > 0 ? ((revpar / totalInvest) * 100).toFixed(1) : '0';
  const payback = totalInvest > 0 ? Math.round(totalInvest / revpar) : 0;
  const scoreColor = getScoreColor(zone.globalScore);
  const isTrending = zone.trendBonus > 8;
  const gradient = ZONE_GRADIENTS[zone.id] || 'linear-gradient(135deg, #1a2a3a, #2d4a6a)';
  const specificLinks = LISTINGS_LINKS[zone.id] || [];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f1117',
        color: '#e2e8f0',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          background: '#0d1219',
          borderBottom: '1px solid #1e293b',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: '1px solid #2d3748',
            borderRadius: '6px',
            color: '#94a3b8',
            fontSize: '13px',
            padding: '6px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
          }}
        >
          ← Back
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#e2e8f0' }}>
              {zone.name}
            </h1>
            <span
              style={{
                background: '#1e293b',
                borderRadius: '5px',
                color: '#94a3b8',
                fontSize: '11px',
                padding: '2px 8px',
                fontWeight: 600,
              }}
            >
              {zone.raw.zoneType}
            </span>
            {isTrending && (
              <span
                style={{
                  background: '#22c55e1a',
                  border: '1px solid #22c55e55',
                  borderRadius: '12px',
                  color: '#22c55e',
                  fontSize: '10px',
                  padding: '2px 8px',
                  fontWeight: 600,
                }}
              >
                ▲ Trending
              </span>
            )}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '28px', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
            {zone.globalScore}
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 400 }}>/100</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '20px' }}>
        {/* Photo placeholder */}
        <div
          style={{
            width: '100%',
            height: '200px',
            background: gradient,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            border: '1px solid #1e293b',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🏝️</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#e2e8f0', letterSpacing: '1px' }}>
              {zone.name}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              {zone.raw.zoneType} · {zone.raw.distanceAirport} min to airport
            </div>
          </div>
          {/* Decorative overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Trend signal */}
        <div
          style={{
            background: '#131822',
            borderLeft: `3px solid ${scoreColor}`,
            padding: '10px 14px',
            borderRadius: '0 6px 6px 0',
            marginBottom: '20px',
            fontSize: '13px',
            color: '#cbd5e1',
            lineHeight: 1.5,
          }}
        >
          {zone.trendSignal}
        </div>

        {/* Two-column grid on desktop */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          {/* Score breakdown */}
          <div
            style={{
              background: '#131822',
              border: '1px solid #1e293b',
              borderRadius: '10px',
              padding: '16px',
            }}
          >
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#475569', marginBottom: '14px', fontWeight: 600 }}>
              Score Breakdown
            </div>
            <ScoreBar label="Zoning" value={zone.scores.zonage} />
            <ScoreBar label="Rental Yield" value={zone.scores.rendement} />
            <ScoreBar label="Land Price" value={zone.scores.foncier} />
            <ScoreBar label="Accessibility" value={zone.scores.accessibilite} />
            <ScoreBar label="Attractiveness" value={zone.scores.attractivite} />
            <div
              style={{
                marginTop: '12px',
                padding: '8px 12px',
                background: scoreColor + '1a',
                border: `1px solid ${scoreColor}44`,
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '13px', color: '#94a3b8' }}>Global Score</span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: scoreColor }}>
                {zone.globalScore}/100
              </span>
            </div>
          </div>

          {/* Market data */}
          <div
            style={{
              background: '#131822',
              border: '1px solid #1e293b',
              borderRadius: '10px',
              padding: '16px',
            }}
          >
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#475569', marginBottom: '14px', fontWeight: 600 }}>
              Market Data
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: '13px' }}>
              <span style={{ color: '#64748b' }}>Avg nightly rate</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>${zone.raw.avgNightlyRate}</span>

              <span style={{ color: '#64748b' }}>Occupancy rate</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{Math.round(zone.raw.occupancyRate * 100)}%</span>

              <span style={{ color: '#64748b' }}>Annual RevPAR</span>
              <span style={{ color: scoreColor, fontWeight: 700 }}>~${revpar.toLocaleString()}</span>

              <span style={{ color: '#64748b' }}>Land price</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>${zone.raw.landPricePerAre.toLocaleString()}/are</span>

              <span style={{ color: '#64748b' }}>Land appreciation</span>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>+{zone.raw.landPriceTrend}%/yr</span>

              <span style={{ color: '#64748b' }}>Airport access</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{zone.raw.distanceAirport} min</span>

              <span style={{ color: '#64748b' }}>Zone type</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{zone.raw.zoneType}</span>

              <span style={{ color: '#64748b' }}>Active listings</span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{zone.listingsCount}</span>

              <span style={{ color: '#64748b' }}>Trend bonus</span>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>+{zone.trendBonus} pts</span>
            </div>
          </div>
        </div>

        {/* ROI Estimator */}
        <div
          style={{
            background: '#131822',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#475569', marginBottom: '14px', fontWeight: 600 }}>
            ROI Estimator
          </div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '13px', color: '#94a3b8' }}>Land (ares):</label>
            <input
              type="number"
              value={ares}
              min={1}
              onChange={(e) => setAres(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: '60px',
                background: '#0f1117',
                border: '1px solid #2d3748',
                borderRadius: '4px',
                color: '#e2e8f0',
                padding: '5px 8px',
                fontSize: '13px',
              }}
            />
            <label style={{ fontSize: '13px', color: '#94a3b8' }}>Build cost ($):</label>
            <input
              type="number"
              value={construction}
              min={0}
              step={10000}
              onChange={(e) => setConstruction(Math.max(0, parseInt(e.target.value) || 0))}
              style={{
                width: '110px',
                background: '#0f1117',
                border: '1px solid #2d3748',
                borderRadius: '4px',
                color: '#e2e8f0',
                padding: '5px 8px',
                fontSize: '13px',
              }}
            />
          </div>
          <div
            style={{
              background: '#0f1117',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '13px',
              border: '1px solid #1e293b',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}
          >
            <span style={{ color: '#64748b' }}>Total investment</span>
            <span style={{ color: '#e2e8f0', fontWeight: 700 }}>${totalInvest.toLocaleString()}</span>

            <span style={{ color: '#64748b' }}>Gross revenue/yr</span>
            <span style={{ color: scoreColor, fontWeight: 700 }}>~${revpar.toLocaleString()}</span>

            <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '15px' }}>Gross ROI</span>
            <span style={{ color: '#f59e0b', fontWeight: 900, fontSize: '15px' }}>~{roi}%</span>

            <span style={{ color: '#64748b' }}>Payback period</span>
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>~{payback} years</span>
          </div>
        </div>

        {/* Land Market Panel */}
        <div
          style={{
            background: '#131822',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#475569', marginBottom: '14px', fontWeight: 600 }}>
            Land Market (Historical Transactions)
          </div>
          <LandMarketPanel zoneId={zone.id} />
        </div>

        {/* Land Listings */}
        <div
          style={{
            background: '#131822',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '16px',
          }}
        >
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#475569', marginBottom: '14px', fontWeight: 600 }}>
            Land Listings{zone.listingsCount > 0 ? ` (${zone.listingsCount} active)` : ''}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {specificLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#60a5fa',
                  fontSize: '13px',
                  textDecoration: 'none',
                  padding: '8px 12px',
                  background: '#0f1117',
                  borderRadius: '6px',
                  border: '1px solid #1e293b',
                }}
              >
                <span>{link.label}</span>
                <span style={{ color: '#475569' }}>↗</span>
              </a>
            ))}
            <a
              href={`https://www.rumah123.com/properti/dijual/tanah/?keyword=${encodeURIComponent(zone.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#94a3b8',
                fontSize: '13px',
                textDecoration: 'none',
                padding: '8px 12px',
                background: '#0f1117',
                borderRadius: '6px',
                border: '1px solid #1e293b',
              }}
            >
              <span>Search on Rumah123</span>
              <span style={{ color: '#475569' }}>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
