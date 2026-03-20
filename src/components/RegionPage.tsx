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
        <span style={{ fontSize: '13px', color: '#6b5c4e' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color }}>{value}/100</span>
      </div>
      <div style={{ height: '8px', background: '#e8e0d5', borderRadius: '4px', overflow: 'hidden' }}>
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
  canggu: 'linear-gradient(135deg, #c8e6c9, #a5d6a7)',
  seminyak: 'linear-gradient(135deg, #f8bbd9, #f48fb1)',
  uluwatu: 'linear-gradient(135deg, #bbdefb, #90caf9)',
  ubud: 'linear-gradient(135deg, #dcedc8, #aed581)',
  pererenan: 'linear-gradient(135deg, #c8e6c9, #80cbc4)',
  nusadua: 'linear-gradient(135deg, #b3e5fc, #4fc3f7)',
  sanur: 'linear-gradient(135deg, #b2ebf2, #80deea)',
  tabanan: 'linear-gradient(135deg, #dcedc8, #c5e1a5)',
  amed: 'linear-gradient(135deg, #bbdefb, #90caf9)',
  buleleng: 'linear-gradient(135deg, #ede7f6, #ce93d8)',
  jimbaran: 'linear-gradient(135deg, #ffe0b2, #ffcc80)',
  keramas: 'linear-gradient(135deg, #c8e6c9, #a5d6a7)',
  lombok: 'linear-gradient(135deg, #ffcdd2, #ef9a9a)',
  'lombok-kuta': 'linear-gradient(135deg, #fce4ec, #f48fb1)',
  'lombok-gili': 'linear-gradient(135deg, #e0f7fa, #80deea)',
  'lombok-north': 'linear-gradient(135deg, #e8f5e9, #a5d6a7)',
  'nusa-lembongan': 'linear-gradient(135deg, #e3f2fd, #90caf9)',
  'nusa-penida': 'linear-gradient(135deg, #ede7f6, #b39ddb)',
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
  const gradient = ZONE_GRADIENTS[zone.id] || 'linear-gradient(135deg, #e8f5e9, #b2dfdb)';
  const specificLinks = LISTINGS_LINKS[zone.id] || [];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#faf8f4',
        color: '#1a1410',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflowY: 'auto',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          background: '#f0ebe3',
          borderBottom: '1px solid #e8e0d5',
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
            border: '1px solid #e8e0d5',
            borderRadius: '6px',
            color: '#6b5c4e',
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
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1a1410' }}>
              {zone.name}
            </h1>
            <span
              style={{
                background: '#f0ebe3',
                border: '1px solid #e8e0d5',
                borderRadius: '5px',
                color: '#6b5c4e',
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
            <span style={{ fontSize: '13px', color: '#9c8877', fontWeight: 400 }}>/100</span>
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
            border: '1px solid #e8e0d5',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🏝️</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#1a1410', letterSpacing: '1px' }}>
              {zone.name}
            </div>
            <div style={{ fontSize: '12px', color: '#6b5c4e', marginTop: '4px' }}>
              {zone.raw.zoneType} · {zone.raw.distanceAirport} min to airport
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 0%, rgba(192,57,43,0.06) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Trend signal */}
        <div
          style={{
            background: '#ffffff',
            borderTop: '1px solid #e8e0d5',
            borderRight: '1px solid #e8e0d5',
            borderBottom: '1px solid #e8e0d5',
            borderLeft: `3px solid ${scoreColor}`,
            padding: '10px 14px',
            borderRadius: '0 6px 6px 0',
            marginBottom: '20px',
            fontSize: '13px',
            color: '#6b5c4e',
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
              background: '#ffffff',
              border: '1px solid #e8e0d5',
              borderRadius: '10px',
              padding: '16px',
            }}
          >
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9c8877', marginBottom: '14px', fontWeight: 600 }}>
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
              <span style={{ fontSize: '13px', color: '#6b5c4e' }}>Global Score</span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: scoreColor }}>
                {zone.globalScore}/100
              </span>
            </div>
          </div>

          {/* Market data */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e8e0d5',
              borderRadius: '10px',
              padding: '16px',
            }}
          >
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9c8877', marginBottom: '14px', fontWeight: 600 }}>
              Market Data
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', fontSize: '13px' }}>
              <span style={{ color: '#9c8877' }}>Avg nightly rate</span>
              <span style={{ color: '#1a1410', fontWeight: 600 }}>${zone.raw.avgNightlyRate}</span>

              <span style={{ color: '#9c8877' }}>Occupancy rate</span>
              <span style={{ color: '#1a1410', fontWeight: 600 }}>{Math.round(zone.raw.occupancyRate * 100)}%</span>

              <span style={{ color: '#9c8877' }}>Annual RevPAR</span>
              <span style={{ color: scoreColor, fontWeight: 700 }}>~${revpar.toLocaleString()}</span>

              <span style={{ color: '#9c8877' }}>Land price</span>
              <span style={{ color: '#1a1410', fontWeight: 600 }}>${zone.raw.landPricePerAre.toLocaleString()}/are</span>

              <span style={{ color: '#9c8877' }}>Land appreciation</span>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>+{zone.raw.landPriceTrend}%/yr</span>

              <span style={{ color: '#9c8877' }}>Airport access</span>
              <span style={{ color: '#1a1410', fontWeight: 600 }}>{zone.raw.distanceAirport} min</span>

              <span style={{ color: '#9c8877' }}>Zone type</span>
              <span style={{ color: '#1a1410', fontWeight: 600 }}>{zone.raw.zoneType}</span>

              <span style={{ color: '#9c8877' }}>Active listings</span>
              <span style={{ color: '#1a1410', fontWeight: 600 }}>{zone.listingsCount}</span>

              <span style={{ color: '#9c8877' }}>Trend bonus</span>
              <span style={{ color: '#c0392b', fontWeight: 600 }}>+{zone.trendBonus} pts</span>
            </div>
          </div>
        </div>

        {/* ROI Estimator */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e8e0d5',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9c8877', marginBottom: '14px', fontWeight: 600 }}>
            ROI Estimator
          </div>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontSize: '13px', color: '#6b5c4e' }}>Land (ares):</label>
            <input
              type="number"
              value={ares}
              min={1}
              onChange={(e) => setAres(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: '60px',
                background: '#faf8f4',
                border: '1px solid #e8e0d5',
                borderRadius: '4px',
                color: '#1a1410',
                padding: '5px 8px',
                fontSize: '13px',
              }}
            />
            <label style={{ fontSize: '13px', color: '#6b5c4e' }}>Build cost ($):</label>
            <input
              type="number"
              value={construction}
              min={0}
              step={10000}
              onChange={(e) => setConstruction(Math.max(0, parseInt(e.target.value) || 0))}
              style={{
                width: '110px',
                background: '#faf8f4',
                border: '1px solid #e8e0d5',
                borderRadius: '4px',
                color: '#1a1410',
                padding: '5px 8px',
                fontSize: '13px',
              }}
            />
          </div>
          <div
            style={{
              background: '#faf8f4',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '13px',
              border: '1px solid #e8e0d5',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}
          >
            <span style={{ color: '#9c8877' }}>Total investment</span>
            <span style={{ color: '#1a1410', fontWeight: 700 }}>${totalInvest.toLocaleString()}</span>

            <span style={{ color: '#9c8877' }}>Gross revenue/yr</span>
            <span style={{ color: scoreColor, fontWeight: 700 }}>~${revpar.toLocaleString()}</span>

            <span style={{ color: '#c0392b', fontWeight: 700, fontSize: '15px' }}>Gross ROI</span>
            <span style={{ color: '#c0392b', fontWeight: 900, fontSize: '15px' }}>~{roi}%</span>

            <span style={{ color: '#9c8877' }}>Payback period</span>
            <span style={{ color: '#6b5c4e', fontWeight: 600 }}>~{payback} years</span>
          </div>
        </div>

        {/* Land Market Panel */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e8e0d5',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9c8877', marginBottom: '14px', fontWeight: 600 }}>
            Land Market (Historical Transactions)
          </div>
          <LandMarketPanel zoneId={zone.id} />
        </div>

        {/* Land Listings */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e8e0d5',
            borderRadius: '10px',
            padding: '16px',
          }}
        >
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9c8877', marginBottom: '14px', fontWeight: 600 }}>
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
                  color: '#c0392b',
                  fontSize: '13px',
                  textDecoration: 'none',
                  padding: '8px 12px',
                  background: '#faf8f4',
                  borderRadius: '6px',
                  border: '1px solid #e8e0d5',
                }}
              >
                <span>{link.label}</span>
                <span style={{ color: '#9c8877' }}>↗</span>
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
                color: '#6b5c4e',
                fontSize: '13px',
                textDecoration: 'none',
                padding: '8px 12px',
                background: '#faf8f4',
                borderRadius: '6px',
                border: '1px solid #e8e0d5',
              }}
            >
              <span>Search on Rumah123</span>
              <span style={{ color: '#9c8877' }}>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
