import { getScoreColor } from '../data/zones';
import type { Zone } from '../data/zones';
import type { Weights } from '../App';

interface ScoredZone extends Zone {
  globalScore: number;
}

interface Props {
  weights: Weights;
  onWeightChange: (key: keyof Weights, val: number) => void;
  scoredZones: ScoredZone[];
  allScoredZones: ScoredZone[];
  selectedZones: string[];
  filterType: string;
  onFilterTypeChange: (val: string) => void;
  minScore: number;
  onMinScoreChange: (val: number) => void;
  onZoneFocus: (zone: Zone) => void;
  onRemoveCompare: (id: string) => void;
  onNavigateWorld: () => void;
  onNavigateNews: () => void;
  totalZones: number;
}

const ZONE_TYPES = ['all', 'Residential', 'Touristic', 'Agricultural', 'Commercial', 'Conservation'];

const SLIDER_CONFIGS = {
  zonage: {
    label: 'Zoning',
    explanation: 'Land use regulations (RTRW Bali / ATR-BPN). 0 = protected/conservation, 100 = commercial/touristic zone. Updated annually.',
    formula: 'Based on official zoning maps: RTRW Bali 2009-2029 + ATR-BPN land classification',
  },
  rendement: {
    label: 'Rental Yield',
    explanation: 'Gross annual return estimate: (ADR × occupancy × 365) ÷ total acquisition cost. Source: Inside Airbnb public data + agency estimates.',
    formula: '(ADR × occupancy × 365) ÷ total acquisition cost × 100',
  },
  foncier: {
    label: 'Land Price',
    explanation: 'Inverted score — lower entry cost = higher score. Includes appreciation trend upside. Source: Balitecture, Investland, Kibarer listings.',
    formula: '(1 − normalizedPrice) × 100 + trendBonus',
  },
  accessibilite: {
    label: 'Accessibility',
    explanation: 'Weighted drive time index to 6 hubs: Ngurah Rai Airport, Denpasar, Canggu, Seminyak, Ubud, Singaraja. Source: OpenStreetMap/OSRM.',
    formula: 'Σ(weight_i × 1/driveTime_i) normalized 0–100',
  },
  attractivite: {
    label: 'Attractiveness',
    explanation: 'POI density within 2km radius: restaurants, cafés, beach clubs, surf spots, spas, yoga. Source: Google Maps Places API.',
    formula: 'log(POI_count_2km) × category_weights, normalized 0–100',
  },
};

function SliderRow({
  sliderKey,
  value,
  onChange,
}: {
  sliderKey: keyof typeof SLIDER_CONFIGS;
  value: number;
  onChange: (v: number) => void;
}) {
  const config = SLIDER_CONFIGS[sliderKey];
  const pct = Math.round(value * 100);
  const color = '#c0392b';
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
        <span
          title={config.formula}
          style={{ fontSize: '13px', color: '#6b5c4e', fontWeight: 600, cursor: 'help', borderBottom: '1px dashed #e8e0d5' }}
        >
          {config.label} <span style={{ fontSize: '10px', color: '#9c8877', fontWeight: 400 }}>ⓘ</span>
        </span>
        <span style={{ fontSize: '12px', fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ fontSize: '10px', color: '#9c8877', marginBottom: '5px', lineHeight: 1.4 }}>
        {config.explanation}
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={pct}
        onChange={(e) => onChange(parseInt(e.target.value) / 100)}
        style={{
          width: '100%',
          accentColor: color,
          cursor: 'pointer',
          height: '4px',
        }}
      />
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = getScoreColor(score);
  return (
    <span style={{
      background: color + '1a',
      border: `1px solid ${color}55`,
      borderRadius: '4px',
      padding: '2px 6px',
      fontSize: '11px',
      fontWeight: 700,
      color,
    }}>
      {score}
    </span>
  );
}

function ForecastPanel({ zones }: { zones: ScoredZone[] }) {
  const withForecast = zones.map((z) => {
    const trend = z.raw.landPriceTrend / 100;
    const f2027 = Math.min(100, z.globalScore * (1 + trend));
    const f2028 = Math.min(100, f2027 * (1 + trend * 0.8));
    const f2029 = Math.min(100, f2028 * (1 + trend * 0.6));
    return {
      ...z,
      f2029: Math.round(f2029),
      upside: Math.round(f2029 - z.globalScore),
    };
  });

  const top3 = [...withForecast]
    .sort((a, b) => b.upside - a.upside)
    .slice(0, 3);

  const rankLabels = ['01', '02', '03'];

  const shortSignal = (z: ScoredZone & { upside: number; f2029: number }) => {
    const map: Record<string, string> = {
      'lombok-kuta': '▲ MotoGP catalyst',
      'lombok': '▲ Early-stage entry',
      'lombok-gili': '▲ Boutique diving',
      'lombok-north': '▲ Frontier market',
      'buleleng': '▲ Airport speculative',
      'pererenan': '▲ Canggu overflow',
      'amed': '▲ Diving hub',
      'nusa-penida': '▲ Tourism surge',
      'tabanan': '▲ Low-cost land',
      'nusa-lembongan': '▲ Island premium',
      'keramas': '▲ Surf corridor',
      'uluwatu': '▲ Surf boom',
    };
    return map[z.id] || '▲ Growth signal';
  };

  return (
    <div style={{
      background: '#f0ebe3',
      border: '1px solid #e8e0d5',
      borderRadius: '8px',
      padding: '12px',
      marginBottom: '10px',
    }}>
      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9c8877', marginBottom: '8px', fontWeight: 600 }}>
        3-Year Forecast
      </div>
      <div style={{ borderBottom: '1px solid #e8e0d5', marginBottom: '8px' }} />
      {top3.map((z, i) => (
        <div key={z.id} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '6px',
          padding: '6px 8px',
          background: '#ffffff',
          borderRadius: '5px',
          border: '1px solid #e8e0d5',
        }}>
          <span style={{ fontSize: '10px', color: '#9c8877', fontWeight: 700, flexShrink: 0, fontFamily: 'monospace' }}>{rankLabels[i]}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', color: '#1a1410', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {z.name}
            </div>
            <div style={{ fontSize: '10px', color: '#22c55e' }}>{shortSignal(z)}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700 }}>+{z.upside} pts</div>
            <div style={{ fontSize: '10px', color: '#9c8877' }}>{z.globalScore}→{z.f2029}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ComparisonTable({
  zones,
  selectedIds,
  onRemove,
}: {
  zones: ScoredZone[];
  selectedIds: string[];
  onRemove: (id: string) => void;
}) {
  const selected = zones.filter((z) => selectedIds.includes(z.id));
  if (selected.length < 2) return null;

  const dims: { key: keyof Zone['scores']; label: string }[] = [
    { key: 'zonage', label: 'Zoning' },
    { key: 'rendement', label: 'Yield' },
    { key: 'foncier', label: 'Land' },
    { key: 'accessibilite', label: 'Access' },
    { key: 'attractivite', label: 'POI' },
  ];

  const best: Record<string, number> = {};
  dims.forEach(({ key }) => {
    best[key] = Math.max(...selected.map((z) => z.scores[key]));
  });
  const bestGlobal = Math.max(...selected.map((z) => z.globalScore));
  const winner = selected.reduce((a, b) => (a.globalScore >= b.globalScore ? a : b));

  return (
    <div style={{
      marginTop: '10px',
      background: '#f0ebe3',
      border: '1px solid #e8e0d5',
      borderRadius: '8px',
      padding: '10px',
    }}>
      <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9c8877', marginBottom: '8px', fontWeight: 600 }}>
        Zone Comparison
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `70px ${selected.map(() => '1fr').join(' ')}`, gap: '4px', marginBottom: '6px' }}>
        <div />
        {selected.map((z) => (
          <div key={z.id} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#1a1410', fontWeight: 600, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{z.name}</div>
            <button
              onClick={() => onRemove(z.id)}
              style={{ background: 'none', border: 'none', color: '#9c8877', cursor: 'pointer', fontSize: '10px', padding: 0 }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div style={{ borderBottom: '1px solid #e8e0d5', marginBottom: '4px' }} />

      <div style={{ display: 'grid', gridTemplateColumns: `70px ${selected.map(() => '1fr').join(' ')}`, gap: '4px', marginBottom: '4px' }}>
        <span style={{ fontSize: '10px', color: '#6b5c4e', alignSelf: 'center' }}>Global</span>
        {selected.map((z) => (
          <div key={z.id} style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: z.globalScore === bestGlobal ? '#22c55e' : '#6b5c4e' }}>
              {z.globalScore}
            </span>
          </div>
        ))}
      </div>

      {dims.map(({ key, label }) => (
        <div key={key} style={{
          display: 'grid',
          gridTemplateColumns: `70px ${selected.map(() => '1fr').join(' ')}`,
          gap: '4px',
          marginBottom: '3px',
        }}>
          <span style={{ fontSize: '10px', color: '#6b5c4e', alignSelf: 'center' }}>{label}</span>
          {selected.map((z) => (
            <div key={z.id} style={{ textAlign: 'center' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: z.scores[key] === best[key] ? 700 : 400,
                color: z.scores[key] === best[key] ? '#22c55e' : '#6b5c4e',
              }}>
                {z.scores[key]}
              </span>
            </div>
          ))}
        </div>
      ))}

      <div style={{
        marginTop: '8px',
        padding: '5px 8px',
        background: '#22c55e1a',
        border: '1px solid #22c55e55',
        borderRadius: '4px',
        fontSize: '11px',
        color: '#22c55e',
        textAlign: 'center',
        fontWeight: 700,
      }}>
        Recommended: {winner.name} — {winner.globalScore}/100
      </div>
    </div>
  );
}

export default function LeftPanel({
  weights,
  onWeightChange,
  scoredZones: _scoredZones,
  allScoredZones,
  selectedZones,
  filterType,
  onFilterTypeChange,
  minScore,
  onMinScoreChange,
  onZoneFocus,
  onRemoveCompare,
  onNavigateWorld,
  onNavigateNews,
  totalZones,
}: Props) {
  const top5 = [...allScoredZones]
    .sort((a, b) => b.globalScore - a.globalScore)
    .slice(0, 5);

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={{
      width: '25%',
      minWidth: '240px',
      maxWidth: '340px',
      height: '100vh',
      background: '#faf8f4',
      borderRight: '1px solid #e8e0d5',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px 10px',
        borderBottom: '1px solid #e8e0d5',
        background: '#f0ebe3',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#c0392b', letterSpacing: '-0.3px' }}>
              🏝️ Bali Bagus
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#9c8877', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Bali Investment Intelligence
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '10px', color: '#6b5c4e' }}>
              {totalZones} zones
            </p>
            {/* Last updated + Refresh */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' }}>
              <span style={{ fontSize: '10px', color: '#9c8877' }}>
                Last updated: {today}
              </span>
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'none',
                  border: '1px solid #e8e0d5',
                  borderRadius: '4px',
                  color: '#9c8877',
                  fontSize: '10px',
                  padding: '1px 5px',
                  cursor: 'pointer',
                  lineHeight: 1.5,
                }}
                title="Refresh data"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
            <button
              onClick={onNavigateWorld}
              style={{
                background: 'none',
                border: '1px solid #e8e0d5',
                borderRadius: '5px',
                color: '#6b5c4e',
                fontSize: '10px',
                padding: '4px 7px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                letterSpacing: '0.3px',
              }}
            >
              🌍 World
            </button>
            <button
              onClick={onNavigateNews}
              style={{
                background: 'none',
                border: '1px solid #e8e0d5',
                borderRadius: '5px',
                color: '#6b5c4e',
                fontSize: '10px',
                padding: '4px 7px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                letterSpacing: '0.3px',
              }}
            >
              📰 News
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>

        {/* Weights sliders */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e8e0d5',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '10px',
        }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9c8877', marginBottom: '10px', fontWeight: 600 }}>
            Scoring Weights
          </div>
          {(Object.keys(SLIDER_CONFIGS) as (keyof typeof SLIDER_CONFIGS)[]).map((key) => (
            <SliderRow
              key={key}
              sliderKey={key}
              value={weights[key as keyof Weights]}
              onChange={(v) => onWeightChange(key as keyof Weights, v)}
            />
          ))}
          <div style={{ textAlign: 'right', fontSize: '10px', color: '#9c8877', marginTop: '2px', fontFamily: 'monospace' }}>
            Σ = {Math.round((weights.zonage + weights.rendement + weights.foncier + weights.accessibilite + weights.attractivite) * 100)}%
          </div>
        </div>

        {/* Filters */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e8e0d5',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '10px',
        }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9c8877', marginBottom: '10px', fontWeight: 600 }}>
            Filters
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '11px', color: '#6b5c4e', display: 'block', marginBottom: '4px' }}>
              Zone Type
            </label>
            <select
              value={filterType}
              onChange={(e) => onFilterTypeChange(e.target.value)}
              style={{
                width: '100%',
                background: '#faf8f4',
                border: '1px solid #e8e0d5',
                borderRadius: '4px',
                color: '#1a1410',
                padding: '5px 6px',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {ZONE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === 'all' ? 'All Types' : t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label style={{ fontSize: '11px', color: '#6b5c4e' }}>Min Score</label>
              <span style={{ fontSize: '11px', fontWeight: 700, color: getScoreColor(minScore), fontFamily: 'monospace' }}>{minScore}</span>
            </div>
            <input
              type="range"
              min={0}
              max={90}
              value={minScore}
              onChange={(e) => onMinScoreChange(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#c0392b', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Top zones ranking */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e8e0d5',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '10px',
        }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9c8877', marginBottom: '10px', fontWeight: 600 }}>
            Top Zones
          </div>
          {top5.map((zone, idx) => (
            <div
              key={zone.id}
              onClick={() => onZoneFocus(zone)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                marginBottom: '3px',
                background: selectedZones.includes(zone.id) ? '#c0392b11' : '#faf8f4',
                border: `1px solid ${selectedZones.includes(zone.id) ? '#c0392b33' : '#e8e0d5'}`,
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: '10px', color: '#9c8877', width: '14px', flexShrink: 0, fontFamily: 'monospace' }}>0{idx + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '12px', color: '#1a1410', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {zone.name}
                  {zone.trendBonus > 8 && (
                    <span style={{
                      marginLeft: '6px',
                      fontSize: '9px',
                      color: '#22c55e',
                      border: '1px solid #22c55e55',
                      borderRadius: '8px',
                      padding: '1px 5px',
                      fontWeight: 500,
                    }}>▲</span>
                  )}
                </div>
                <div style={{ fontSize: '9px', color: '#9c8877', marginTop: '1px' }}>{zone.raw.zoneType}</div>
              </div>
              <ScoreBadge score={zone.globalScore} />
            </div>
          ))}
        </div>

        {/* 3-Year Forecast */}
        <ForecastPanel zones={allScoredZones} />

        {/* Comparison panel */}
        {selectedZones.length >= 2 && (
          <ComparisonTable
            zones={allScoredZones}
            selectedIds={selectedZones}
            onRemove={onRemoveCompare}
          />
        )}

        {selectedZones.length === 1 && (
          <div style={{
            background: '#ffffff',
            border: '1px dashed #e8e0d5',
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center',
            fontSize: '11px',
            color: '#9c8877',
          }}>
            Select a 2nd zone on the map to compare
          </div>
        )}

      </div>
    </div>
  );
}
