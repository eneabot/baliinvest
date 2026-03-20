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
    { label: 'Canggu Land — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/bali/canggu?type=land' },
    { label: 'Canggu Land — Lamudi', url: 'https://www.lamudi.co.id/bali/canggu/land/buy/' },
  ],
  seminyak: [
    { label: 'Seminyak Land — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/bali/seminyak?type=land' },
    { label: 'Seminyak — Lamudi', url: 'https://www.lamudi.co.id/bali/seminyak/land/buy/' },
  ],
  uluwatu: [
    { label: 'Uluwatu Land — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/bali/uluwatu?type=land' },
    { label: 'Pecatu/Uluwatu — Lamudi', url: 'https://www.lamudi.co.id/bali/pecatu/land/buy/' },
  ],
  ubud: [
    { label: 'Ubud Land — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/bali/ubud?type=land' },
    { label: 'Ubud — Lamudi', url: 'https://www.lamudi.co.id/bali/ubud/land/buy/' },
  ],
  pererenan: [
    { label: 'Pererenan/Canggu — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/bali/canggu?type=land' },
    { label: 'Pererenan — Lamudi', url: 'https://www.lamudi.co.id/bali/canggu/land/buy/' },
  ],
  nusadua: [
    { label: 'Nusa Dua Land — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/bali/nusa-dua?type=land' },
    { label: 'Nusa Dua — Lamudi', url: 'https://www.lamudi.co.id/bali/nusa-dua/land/buy/' },
  ],
  sanur: [
    { label: 'Sanur Land — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/bali/sanur?type=land' },
    { label: 'Sanur — Lamudi', url: 'https://www.lamudi.co.id/bali/sanur/land/buy/' },
  ],
  tabanan: [
    { label: 'Tabanan Land — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/bali/tabanan?type=land' },
    { label: 'Tabanan — Lamudi', url: 'https://www.lamudi.co.id/bali/tabanan/land/buy/' },
  ],
  amed: [
    { label: 'Karangasem/Amed — Lamudi', url: 'https://www.lamudi.co.id/bali/karangasem/land/buy/' },
    { label: 'East Bali — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/bali?type=land&location=karangasem' },
  ],
  buleleng: [
    { label: 'Singaraja/Buleleng — Lamudi', url: 'https://www.lamudi.co.id/bali/buleleng/land/buy/' },
    { label: 'North Bali — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/bali?type=land&location=singaraja' },
  ],
  jimbaran: [
    { label: 'Jimbaran Land — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/bali/jimbaran?type=land' },
    { label: 'Jimbaran — Lamudi', url: 'https://www.lamudi.co.id/bali/jimbaran/land/buy/' },
  ],
  keramas: [
    { label: 'Gianyar/Keramas — Lamudi', url: 'https://www.lamudi.co.id/bali/gianyar/land/buy/' },
    { label: 'Keramas — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/bali?type=land&location=gianyar' },
  ],
  lombok: [
    { label: 'Senggigi/Lombok — Lamudi', url: 'https://www.lamudi.co.id/lombok-barat/land/buy/' },
    { label: 'Lombok Land — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/lombok?type=land' },
  ],
  'lombok-kuta': [
    { label: 'Mandalika/Kuta Lombok — Lamudi', url: 'https://www.lamudi.co.id/lombok-tengah/land/buy/' },
    { label: 'Kuta Lombok — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/lombok/kuta?type=land' },
  ],
  'lombok-gili': [
    { label: 'Gili Islands — Lamudi', url: 'https://www.lamudi.co.id/lombok-utara/land/buy/' },
    { label: 'Gili — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/lombok?type=land&location=gili' },
  ],
  'lombok-north': [
    { label: 'North Lombok — Lamudi', url: 'https://www.lamudi.co.id/lombok-utara/land/buy/' },
    { label: 'North Lombok — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/lombok?type=land' },
  ],
  'nusa-lembongan': [
    { label: 'Nusa Lembongan — Lamudi', url: 'https://www.lamudi.co.id/bali/klungkung/land/buy/' },
    { label: 'Nusa Islands — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/bali?type=land&location=klungkung' },
  ],
  'nusa-penida': [
    { label: 'Nusa Penida — Lamudi', url: 'https://www.lamudi.co.id/bali/klungkung/land/buy/' },
    { label: 'Nusa Penida — Dot Property', url: 'https://www.dotproperty.id/en/properties-for-sale/bali?type=land&location=nusa-penida' },
  ],
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = getScoreColor(value);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
      <span style={{ width: '110px', fontSize: '12px', color: '#6b5c4e', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: '6px', background: '#e8e0d5', borderRadius: '3px', overflow: 'hidden' }}>
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
      background: '#ffffff',
      color: '#1a1410',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '17px', color: '#1a1410', fontWeight: 700 }}>
            {zone.name}
          </h2>
          <span style={{ fontSize: '11px', color: '#9c8877', letterSpacing: '0.5px' }}>{zone.raw.zoneType}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '22px', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
            {zone.globalScore}<span style={{ fontSize: '12px', color: '#9c8877', fontWeight: 400 }}>/100</span>
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
        background: '#faf8f4',
        borderLeft: `3px solid ${scoreColor}`,
        padding: '6px 10px',
        borderRadius: '0 4px 4px 0',
        marginBottom: '14px',
        fontSize: '12px',
        color: '#6b5c4e',
        lineHeight: 1.4,
      }}>
        {zone.trendSignal}
      </div>

      {/* Scores */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9c8877', marginBottom: '8px', fontWeight: 600 }}>
          Score Breakdown
        </div>
        <ScoreBar label="Zoning" value={zone.scores.zonage} />
        <ScoreBar label="Rental Yield" value={zone.scores.rendement} />
        <ScoreBar label="Land Price" value={zone.scores.foncier} />
        <ScoreBar label="Accessibility" value={zone.scores.accessibilite} />
        <ScoreBar label="Attractiveness" value={zone.scores.attractivite} />
      </div>

      <div style={{ borderTop: '1px solid #e8e0d5', marginBottom: '14px' }} />

      {/* Market data */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9c8877', marginBottom: '8px', fontWeight: 600 }}>
          Market Data
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: '12px' }}>
          <span style={{ color: '#9c8877' }}>Avg nightly rate</span>
          <span style={{ color: '#1a1410', fontWeight: 600 }}>${zone.raw.avgNightlyRate}</span>
          <span style={{ color: '#9c8877' }}>Occupancy rate</span>
          <span style={{ color: '#1a1410', fontWeight: 600 }}>{Math.round(zone.raw.occupancyRate * 100)}%</span>
          <span style={{ color: '#9c8877' }}>Annual RevPAR</span>
          <span style={{ color: scoreColor, fontWeight: 600 }}>~${revpar.toLocaleString()}</span>
          <span style={{ color: '#9c8877' }}>Land price</span>
          <span style={{ color: '#1a1410', fontWeight: 600 }}>${zone.raw.landPricePerAre.toLocaleString()}/are</span>
          <span style={{ color: '#9c8877' }}>Land appreciation</span>
          <span style={{ color: '#22c55e', fontWeight: 600 }}>+{zone.raw.landPriceTrend}%/yr</span>
          <span style={{ color: '#9c8877' }}>Airport access</span>
          <span style={{ color: '#1a1410', fontWeight: 600 }}>{zone.raw.distanceAirport} min</span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e8e0d5', marginBottom: '14px' }} />

      {/* ROI Estimator */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9c8877', marginBottom: '8px', fontWeight: 600 }}>
          ROI Estimator
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '12px', color: '#6b5c4e' }}>Land (ares):</label>
          <input
            type="number"
            value={ares}
            min={1}
            onChange={(e) => setAres(Math.max(1, parseInt(e.target.value) || 1))}
            style={{
              width: '50px',
              background: '#faf8f4',
              border: '1px solid #e8e0d5',
              borderRadius: '4px',
              color: '#1a1410',
              padding: '3px 6px',
              fontSize: '12px',
            }}
          />
          <label style={{ fontSize: '12px', color: '#6b5c4e' }}>Build cost ($):</label>
          <input
            type="number"
            value={construction}
            min={0}
            step={10000}
            onChange={(e) => setConstruction(Math.max(0, parseInt(e.target.value) || 0))}
            style={{
              width: '90px',
              background: '#faf8f4',
              border: '1px solid #e8e0d5',
              borderRadius: '4px',
              color: '#1a1410',
              padding: '3px 6px',
              fontSize: '12px',
            }}
          />
        </div>
        <div style={{
          background: '#faf8f4',
          borderRadius: '6px',
          padding: '10px 12px',
          fontSize: '12px',
          border: '1px solid #e8e0d5',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#9c8877' }}>Total investment</span>
            <span style={{ color: '#1a1410', fontWeight: 700 }}>${totalInvest.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#9c8877' }}>Gross revenue/yr</span>
            <span style={{ color: scoreColor, fontWeight: 700 }}>~${revpar.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e8e0d5', paddingTop: '6px', marginTop: '2px' }}>
            <span style={{ color: '#c0392b', fontWeight: 700 }}>Gross ROI: ~{roi}%</span>
            <span style={{ color: '#6b5c4e' }}>Payback: ~{payback} yrs</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e8e0d5', marginBottom: '14px' }} />

      {/* Land Market Panel */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9c8877', marginBottom: '8px', fontWeight: 600 }}>
          Land Market (2020–2024)
        </div>
        <LandMarketPanel zoneId={zone.id} />
      </div>

      <div style={{ borderTop: '1px solid #e8e0d5', marginBottom: '14px' }} />

      {/* Land Listings */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9c8877', marginBottom: '8px', fontWeight: 600 }}>
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
                color: '#c0392b',
                fontSize: '12px',
                textDecoration: 'none',
                padding: '4px 8px',
                background: '#faf8f4',
                borderRadius: '4px',
                border: '1px solid #e8e0d5',
                transition: 'border-color 0.15s',
              }}
            >
              <span>{link.label}</span>
              <span style={{ color: '#9c8877', fontSize: '11px' }}>↗</span>
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
              fontSize: '12px',
              textDecoration: 'none',
              padding: '4px 8px',
              background: '#faf8f4',
              borderRadius: '4px',
              border: '1px solid #e8e0d5',
            }}
          >
            <span>Search on Rumah123</span>
            <span style={{ color: '#9c8877', fontSize: '11px' }}>↗</span>
          </a>
        </div>
      </div>

      {/* Compare button */}
      <button
        onClick={onCompare}
        style={{
          width: '100%',
          padding: '8px 16px',
          background: isSelected ? '#c0392b22' : '#faf8f4',
          border: `1px solid ${isSelected ? '#c0392b' : '#e8e0d5'}`,
          borderRadius: '6px',
          color: isSelected ? '#c0392b' : '#6b5c4e',
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
            border: '1px solid #c0392b',
            borderRadius: '6px',
            color: '#c0392b',
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
