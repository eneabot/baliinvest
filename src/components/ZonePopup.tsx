import { useState } from 'react';
import { getScoreColor } from '../data/zones';
import type { Zone } from '../data/zones';
import LandMarketPanel from './LandMarketPanel';

interface Props {
  zone: Zone & { globalScore: number };
  weights?: number[];
  isSelected: boolean;
  onCompare: () => void;
  onViewDetail?: () => void;
}

export const LISTINGS_LINKS: Record<string, { label: string; url: string }[]> = {
  canggu: [
    { label: 'Balitecture — Canggu land', url: 'https://www.balitecture.com/property-type/land/?location=canggu' },
    { label: 'Kibarer — Canggu', url: 'https://www.kibarer.com/en/property/?location=canggu&type=land' },
  ],
  seminyak: [
    { label: 'Balitecture — Seminyak land', url: 'https://www.balitecture.com/property-type/land/?location=seminyak' },
  ],
  uluwatu: [
    { label: 'Balitecture — Uluwatu land', url: 'https://www.balitecture.com/property-type/land/?location=uluwatu' },
    { label: 'Investland — Uluwatu', url: 'https://investinbali.com/land-for-sale-in-uluwatu/' },
  ],
  ubud: [
    { label: 'Balitecture — Ubud land', url: 'https://www.balitecture.com/property-type/land/?location=ubud' },
  ],
  pererenan: [
    { label: 'Balitecture — Pererenan', url: 'https://www.balitecture.com/property-type/land/?location=pererenan' },
  ],
  nusadua: [
    { label: 'Balitecture — Nusa Dua land', url: 'https://www.balitecture.com/property-type/land/?location=nusa-dua' },
    { label: 'Kibarer — Nusa Dua', url: 'https://www.kibarer.com/en/property/?location=nusadua&type=land' },
  ],
  sanur: [
    { label: 'Balitecture — Sanur land', url: 'https://www.balitecture.com/property-type/land/?location=sanur' },
  ],
  tabanan: [
    { label: 'Rumah123 — Tabanan land', url: 'https://www.rumah123.com/properti/dijual/tanah/?keyword=tabanan' },
  ],
  amed: [
    { label: 'Lamudi — Karangasem (Amed area)', url: 'https://www.lamudi.co.id/karangasem/land/buy/' },
  ],
  buleleng: [
    { label: 'Rumah123 — Singaraja land', url: 'https://www.rumah123.com/properti/dijual/tanah/?keyword=singaraja' },
    { label: 'Lamudi — Buleleng', url: 'https://www.lamudi.co.id/buleleng/land/buy/' },
  ],
  jimbaran: [
    { label: 'Balitecture — Jimbaran land', url: 'https://www.balitecture.com/property-type/land/?location=jimbaran' },
    { label: 'Kibarer — Jimbaran', url: 'https://www.kibarer.com/en/property/?location=jimbaran&type=land' },
  ],
  keramas: [
    { label: 'Rumah123 — Keramas', url: 'https://www.rumah123.com/properti/dijual/tanah/?keyword=keramas' },
    { label: 'Rumah123 — Gianyar land', url: 'https://www.rumah123.com/properti/dijual/tanah/?keyword=gianyar' },
  ],
  lombok: [
    { label: 'Lombok property — Lamudi', url: 'https://www.lamudi.co.id/lombok/land/buy/' },
    { label: 'Invest Lombok', url: 'https://www.rumah123.com/properti/dijual/tanah/?keyword=lombok' },
  ],
  'lombok-kuta': [
    { label: 'Lombok Kuta — Lamudi', url: 'https://www.lamudi.co.id/lombok/land/buy/' },
    { label: 'Mandalika listings', url: 'https://www.rumah123.com/properti/dijual/tanah/?keyword=mandalika' },
  ],
  'lombok-gili': [
    { label: 'Gili Islands listings', url: 'https://www.lamudi.co.id/lombok/land/buy/' },
  ],
  'lombok-north': [
    { label: 'North Lombok land', url: 'https://www.rumah123.com/properti/dijual/tanah/?keyword=lombok+utara' },
  ],
  'nusa-lembongan': [
    { label: 'Nusa Lembongan land', url: 'https://www.balitecture.com/property-type/land/?location=nusa-lembongan' },
  ],
  'nusa-penida': [
    { label: 'Nusa Penida listings', url: 'https://www.rumah123.com/properti/dijual/tanah/?keyword=nusa+penida' },
  ],
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = getScoreColor(value);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
      <span style={{ width: '110px', fontSize: '12px', color: '#94a3b8', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: '6px', background: '#2d3748', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          width: `${value}%`,
          height: '100%',
          background: color,
          borderRadius: '3px',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <span style={{ fontSize: '12px', fontWeight: 700, color, minWidth: '24px', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

export default function ZonePopup({ zone, isSelected, onCompare, onViewDetail }: Props) {
  const [ares, setAres] = useState(2);
  const [construction, setConstruction] = useState(150000);

  const revpar = Math.round(zone.raw.avgNightlyRate * zone.raw.occupancyRate * 365);
  const totalInvest = ares * zone.raw.landPricePerAre + construction;
  const roi = totalInvest > 0 ? ((revpar / totalInvest) * 100).toFixed(1) : '0';
  const payback = totalInvest > 0 ? Math.round(totalInvest / revpar) : 0;
  const scoreColor = getScoreColor(zone.globalScore);
  const isTrending = zone.trendBonus > 8;

  const specificLinks = LISTINGS_LINKS[zone.id] || [];

  return (
    <div style={{
      padding: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: 'min(380px, 90vw)',
      maxHeight: '80vh',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '17px', color: '#e2e8f0', fontWeight: 700 }}>
            {zone.name}
          </h2>
          <span style={{ fontSize: '11px', color: '#64748b', letterSpacing: '0.5px' }}>{zone.raw.zoneType}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '22px', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
            {zone.globalScore}<span style={{ fontSize: '12px', color: '#64748b', fontWeight: 400 }}>/100</span>
          </div>
          {isTrending && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              marginTop: '3px',
              border: '1px solid #22c55e',
              borderRadius: '12px',
              padding: '2px 7px',
              fontSize: '10px',
              color: '#22c55e',
              fontWeight: 600,
              letterSpacing: '0.3px',
            }}>
              ▲ Trending
            </div>
          )}
        </div>
      </div>

      {/* Trend signal */}
      <div style={{
        background: '#0f1117',
        borderLeft: `3px solid ${scoreColor}`,
        padding: '6px 10px',
        borderRadius: '0 4px 4px 0',
        marginBottom: '14px',
        fontSize: '12px',
        color: '#cbd5e1',
        lineHeight: 1.4,
      }}>
        {zone.trendSignal}
      </div>

      {/* Scores */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
          Score Breakdown
        </div>
        <ScoreBar label="Zoning" value={zone.scores.zonage} />
        <ScoreBar label="Rental Yield" value={zone.scores.rendement} />
        <ScoreBar label="Land Price" value={zone.scores.foncier} />
        <ScoreBar label="Accessibility" value={zone.scores.accessibilite} />
        <ScoreBar label="Attractiveness" value={zone.scores.attractivite} />
      </div>

      <div style={{ borderTop: '1px solid #1e293b', marginBottom: '14px' }} />

      {/* Market data */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
          Market Data
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: '12px' }}>
          <span style={{ color: '#64748b' }}>Avg nightly rate</span>
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>${zone.raw.avgNightlyRate}</span>
          <span style={{ color: '#64748b' }}>Occupancy rate</span>
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{Math.round(zone.raw.occupancyRate * 100)}%</span>
          <span style={{ color: '#64748b' }}>Annual RevPAR</span>
          <span style={{ color: scoreColor, fontWeight: 600 }}>~${revpar.toLocaleString()}</span>
          <span style={{ color: '#64748b' }}>Land price</span>
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>${zone.raw.landPricePerAre.toLocaleString()}/are</span>
          <span style={{ color: '#64748b' }}>Land appreciation</span>
          <span style={{ color: '#22c55e', fontWeight: 600 }}>+{zone.raw.landPriceTrend}%/yr</span>
          <span style={{ color: '#64748b' }}>Airport access</span>
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{zone.raw.distanceAirport} min</span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #1e293b', marginBottom: '14px' }} />

      {/* ROI Estimator */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
          ROI Estimator
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '12px', color: '#94a3b8' }}>Land (ares):</label>
          <input
            type="number"
            value={ares}
            min={1}
            onChange={(e) => setAres(Math.max(1, parseInt(e.target.value) || 1))}
            style={{
              width: '50px',
              background: '#0f1117',
              border: '1px solid #2d3748',
              borderRadius: '4px',
              color: '#e2e8f0',
              padding: '3px 6px',
              fontSize: '12px',
            }}
          />
          <label style={{ fontSize: '12px', color: '#94a3b8' }}>Build cost ($):</label>
          <input
            type="number"
            value={construction}
            min={0}
            step={10000}
            onChange={(e) => setConstruction(Math.max(0, parseInt(e.target.value) || 0))}
            style={{
              width: '90px',
              background: '#0f1117',
              border: '1px solid #2d3748',
              borderRadius: '4px',
              color: '#e2e8f0',
              padding: '3px 6px',
              fontSize: '12px',
            }}
          />
        </div>
        <div style={{
          background: '#0f1117',
          borderRadius: '6px',
          padding: '10px 12px',
          fontSize: '12px',
          border: '1px solid #1e293b',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#64748b' }}>Total investment</span>
            <span style={{ color: '#e2e8f0', fontWeight: 700 }}>${totalInvest.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#64748b' }}>Gross revenue/yr</span>
            <span style={{ color: scoreColor, fontWeight: 700 }}>~${revpar.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1e293b', paddingTop: '6px', marginTop: '2px' }}>
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>Gross ROI: ~{roi}%</span>
            <span style={{ color: '#94a3b8' }}>Payback: ~{payback} yrs</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #1e293b', marginBottom: '14px' }} />

      {/* Land Market Panel */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
          Land Market (2020–2024)
        </div>
        <LandMarketPanel zoneId={zone.id} />
      </div>

      <div style={{ borderTop: '1px solid #1e293b', marginBottom: '14px' }} />

      {/* Land Listings */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#475569', marginBottom: '8px', fontWeight: 600 }}>
          Land Listings{zone.listingsCount > 0 ? ` (${zone.listingsCount} active)` : ''}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
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
                fontSize: '12px',
                textDecoration: 'none',
                padding: '4px 8px',
                background: '#0f1117',
                borderRadius: '4px',
                border: '1px solid #1e293b',
                transition: 'border-color 0.15s',
              }}
            >
              <span>{link.label}</span>
              <span style={{ color: '#475569', fontSize: '11px' }}>↗</span>
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
              fontSize: '12px',
              textDecoration: 'none',
              padding: '4px 8px',
              background: '#0f1117',
              borderRadius: '4px',
              border: '1px solid #1e293b',
            }}
          >
            <span>Search on Rumah123</span>
            <span style={{ color: '#475569', fontSize: '11px' }}>↗</span>
          </a>
        </div>
      </div>

      {/* Compare button */}
      <button
        onClick={onCompare}
        style={{
          width: '100%',
          padding: '8px 16px',
          background: isSelected ? '#f59e0b22' : '#1e293b',
          border: `1px solid ${isSelected ? '#f59e0b' : '#2d3748'}`,
          borderRadius: '6px',
          color: isSelected ? '#f59e0b' : '#94a3b8',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginBottom: '8px',
        }}
      >
        {isSelected ? '✓ In comparison' : '+ Compare zones'}
      </button>

      {/* View Full Detail button */}
      {onViewDetail && (
        <button
          onClick={onViewDetail}
          style={{
            width: '100%',
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid #d97706',
            borderRadius: '6px',
            color: '#d97706',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          View Full Detail →
        </button>
      )}
    </div>
  );
}
