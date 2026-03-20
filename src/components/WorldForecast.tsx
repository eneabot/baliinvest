import { useState } from 'react';

interface CountryTrend {
  country: string;
  flag: string;
  region: string;
  socialScore: number;
  hashtagVolume: number;
  growthRate: number;
  topHashtags: string[];
  insight: string;
  signal: 'rising' | 'peak' | 'stable' | 'emerging';
  investmentZones: string[];
}

const WORLD_TRENDS: CountryTrend[] = [
  { country: 'Indonesia', flag: '🇮🇩', region: 'Southeast Asia', socialScore: 92, hashtagVolume: 284000, growthRate: 38, topHashtags: ['#bali', '#lombok', '#villalife', '#investasiproperti'], insight: 'Bali & Lombok dominate STR investment content. MotoGP Mandalika driving Lombok surge.', signal: 'rising', investmentZones: ['Canggu', 'Uluwatu', 'Lombok Kuta'] },
  { country: 'Portugal', flag: '🇵🇹', region: 'Southern Europe', socialScore: 85, hashtagVolume: 156000, growthRate: 22, topHashtags: ['#algarve', '#lisbonrealestate', '#goldenvisaportugal', '#nhr'], insight: 'Post-NHR era still driving interest. Algarve content up 22% MoM despite policy changes.', signal: 'peak', investmentZones: ['Algarve', 'Lisbon', 'Porto'] },
  { country: 'Thailand', flag: '🇹🇭', region: 'Southeast Asia', socialScore: 78, hashtagVolume: 198000, growthRate: 31, topHashtags: ['#phuketproperty', '#kosamui', '#thaivillalife', '#digitalnomadbangkok'], insight: 'Phuket STR content surging post-COVID recovery. Samui emerging as next hotspot.', signal: 'rising', investmentZones: ['Phuket', 'Koh Samui', 'Chiang Mai'] },
  { country: 'UAE', flag: '🇦🇪', region: 'Middle East', socialScore: 88, hashtagVolume: 312000, growthRate: 15, topHashtags: ['#dubaipropertyinvestment', '#dubairealestate', '#abudhabiproperty'], insight: 'Dubai market at peak buzz. Signs of plateau — early investors already positioned.', signal: 'peak', investmentZones: ['Dubai Marina', 'Palm Jumeirah', 'Abu Dhabi'] },
  { country: 'Georgia', flag: '🇬🇪', region: 'Caucasus', socialScore: 71, hashtagVolume: 89000, growthRate: 67, topHashtags: ['#tbilisirealestate', '#georgiavisafree', '#batumi', '#georgiadigitalnomad'], insight: 'Fastest growing market in data. Visa-free access + low prices driving nomad interest.', signal: 'emerging', investmentZones: ['Tbilisi', 'Batumi', 'Gudauri'] },
  { country: 'Mexico', flag: '🇲🇽', region: 'Latin America', socialScore: 82, hashtagVolume: 241000, growthRate: 28, topHashtags: ['#tulum', '#mexicorealestate', '#playadelcarmen', '#rivieramaya'], insight: 'Tulum STR content massive. Regulatory risk increasing — smart money moving to Mérida.', signal: 'rising', investmentZones: ['Tulum', 'Playa del Carmen', 'Mérida'] },
  { country: 'Vietnam', flag: '🇻🇳', region: 'Southeast Asia', socialScore: 65, hashtagVolume: 112000, growthRate: 44, topHashtags: ['#danangproperty', '#hanoirealestate', '#hochiminh', '#vietnaminvest'], insight: 'Da Nang emerging strongly. Regulatory clarity improving for foreign buyers.', signal: 'emerging', investmentZones: ['Da Nang', 'Phu Quoc', 'Hoi An'] },
  { country: 'Greece', flag: '🇬🇷', region: 'Southern Europe', socialScore: 74, hashtagVolume: 134000, growthRate: 19, topHashtags: ['#santorinirealestate', '#mykonosproperty', '#greecegoldenvisaend', '#crete'], insight: 'Golden visa ended for islands but mainland + Crete still active. Steady not explosive.', signal: 'stable', investmentZones: ['Crete', 'Thessaloniki', 'Peloponnese'] },
  { country: 'Colombia', flag: '🇨🇴', region: 'Latin America', socialScore: 58, hashtagVolume: 76000, growthRate: 52, topHashtags: ['#medellinproperty', '#cartagena', '#colombiainvest', '#remotework'], insight: 'Medellín digital nomad hub creating STR demand. Ultra-early stage, high upside.', signal: 'emerging', investmentZones: ['Medellín', 'Cartagena', 'Santa Marta'] },
  { country: 'Morocco', flag: '🇲🇦', region: 'North Africa', socialScore: 62, hashtagVolume: 95000, growthRate: 35, topHashtags: ['#marrakechproperty', '#riyadmarrakech', '#agadir', '#moroccodigitalnomad'], insight: 'Marrakech riad investment content growing. African gateway positioning.', signal: 'rising', investmentZones: ['Marrakech', 'Agadir', 'Essaouira'] },
];

type SortKey = 'socialScore' | 'growthRate' | 'signal';

const SIGNAL_ORDER = { emerging: 0, rising: 1, stable: 2, peak: 3 };

const SIGNAL_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  emerging: { color: '#a855f7', bg: '#a855f71a', label: 'Emerging' },
  rising: { color: '#22c55e', bg: '#22c55e1a', label: 'Rising' },
  stable: { color: '#94a3b8', bg: '#94a3b81a', label: 'Stable' },
  peak: { color: '#eab308', bg: '#eab3081a', label: 'Peak' },
};

interface Props {
  onBack: () => void;
}

export default function WorldForecast({ onBack }: Props) {
  const [sortBy, setSortBy] = useState<SortKey>('socialScore');

  const emerging = WORLD_TRENDS.filter((t) => t.signal === 'emerging')
    .sort((a, b) => b.growthRate - a.growthRate)
    .slice(0, 3);

  const sorted = [...WORLD_TRENDS].sort((a, b) => {
    if (sortBy === 'socialScore') return b.socialScore - a.socialScore;
    if (sortBy === 'growthRate') return b.growthRate - a.growthRate;
    return SIGNAL_ORDER[a.signal] - SIGNAL_ORDER[b.signal];
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f1117',
      color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      overflowY: 'auto',
    }}>
      {/* Top nav bar */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#0d1219',
        borderBottom: '1px solid #1e293b',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: '1px solid #1e293b',
            borderRadius: '5px',
            color: '#64748b',
            fontSize: '12px',
            padding: '5px 10px',
            cursor: 'pointer',
          }}
        >
          ← Back to Map
        </button>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#d97706' }}>
            🌍 World Forecast
          </div>
          <div style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            Real estate buzz analysis · Social signal index
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>

        {/* Disclaimer */}
        <div style={{
          background: '#1a1a0d',
          border: '1px solid #44440022',
          borderLeft: '3px solid #eab308',
          borderRadius: '0 6px 6px 0',
          padding: '8px 14px',
          fontSize: '11px',
          color: '#94844b',
          marginBottom: '24px',
          lineHeight: 1.5,
        }}>
          Data simulated from public social trend indicators. Not financial advice. For research purposes only.
        </div>

        {/* Emerging Markets highlight */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#475569', marginBottom: '12px', fontWeight: 600 }}>
            Top Emerging Markets
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {emerging.map((t) => (
              <div key={t.country} style={{
                background: '#0d1219',
                border: '1px solid #a855f733',
                borderRadius: '10px',
                padding: '16px',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0, right: 0,
                  background: '#a855f7',
                  fontSize: '9px',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: '0 10px 0 6px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                }}>
                  EMERGING
                </div>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>{t.flag}</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', marginBottom: '2px' }}>{t.country}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>{t.region}</div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#a855f7' }}>{t.growthRate}%</div>
                    <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase' }}>MoM Growth</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#e2e8f0' }}>{t.socialScore}</div>
                    <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase' }}>Buzz Score</div>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.5 }}>{t.insight}</div>
                <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {t.investmentZones.map((z) => (
                    <span key={z} style={{
                      fontSize: '10px',
                      background: '#a855f71a',
                      border: '1px solid #a855f733',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      color: '#c084fc',
                    }}>{z}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sort controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#475569', fontWeight: 600 }}>
            All Markets — {WORLD_TRENDS.length} countries tracked
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#475569' }}>Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              style={{
                background: '#0d1219',
                border: '1px solid #1e293b',
                borderRadius: '4px',
                color: '#94a3b8',
                padding: '4px 8px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              <option value="socialScore">Social Score</option>
              <option value="growthRate">Growth Rate</option>
              <option value="signal">Signal Stage</option>
            </select>
          </div>
        </div>

        {/* Country table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {sorted.map((t) => {
            const sig = SIGNAL_STYLES[t.signal];
            return (
              <div key={t.country} style={{
                background: '#0d1219',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                  {/* Flag + name */}
                  <div style={{ minWidth: '140px', flexShrink: 0 }}>
                    <div style={{ fontSize: '20px', lineHeight: 1 }}>{t.flag}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#f1f5f9', marginTop: '3px' }}>{t.country}</div>
                    <div style={{ fontSize: '10px', color: '#475569' }}>{t.region}</div>
                  </div>

                  {/* Social score bar */}
                  <div style={{ flex: 1, minWidth: '120px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#475569', marginBottom: '4px' }}>
                      <span>Social Score</span>
                      <span style={{ color: '#94a3b8', fontWeight: 700 }}>{t.socialScore}</span>
                    </div>
                    <div style={{ height: '5px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${t.socialScore}%`,
                        height: '100%',
                        background: sig.color,
                        borderRadius: '3px',
                      }} />
                    </div>
                    <div style={{ marginTop: '6px', fontSize: '10px', color: '#475569' }}>
                      {(t.hashtagVolume / 1000).toFixed(0)}k hashtags/mo
                    </div>
                  </div>

                  {/* Growth rate */}
                  <div style={{ flexShrink: 0, textAlign: 'center', minWidth: '60px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: t.growthRate > 40 ? '#a855f7' : t.growthRate > 25 ? '#22c55e' : '#94a3b8' }}>
                      +{t.growthRate}%
                    </div>
                    <div style={{ fontSize: '9px', color: '#475569', textTransform: 'uppercase' }}>MoM</div>
                  </div>

                  {/* Signal badge */}
                  <div style={{ flexShrink: 0, paddingTop: '2px' }}>
                    <span style={{
                      background: sig.bg,
                      border: `1px solid ${sig.color}44`,
                      borderRadius: '12px',
                      padding: '3px 10px',
                      fontSize: '11px',
                      color: sig.color,
                      fontWeight: 600,
                    }}>
                      {sig.label}
                    </span>
                  </div>
                </div>

                {/* Hashtags + insight */}
                <div style={{ marginTop: '10px', borderTop: '1px solid #0f1117', paddingTop: '10px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                    {t.topHashtags.map((h) => (
                      <span key={h} style={{
                        fontSize: '10px',
                        background: '#1e293b',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        color: '#64748b',
                        fontFamily: 'monospace',
                      }}>{h}</span>
                    ))}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '8px' }}>
                    {t.insight}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {t.investmentZones.map((z) => (
                      <span key={z} style={{
                        fontSize: '10px',
                        background: sig.bg,
                        border: `1px solid ${sig.color}33`,
                        borderRadius: '4px',
                        padding: '2px 7px',
                        color: sig.color,
                      }}>{z}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '32px',
          paddingTop: '16px',
          borderTop: '1px solid #1e293b',
          fontSize: '10px',
          color: '#334155',
          textAlign: 'center',
          lineHeight: 1.6,
        }}>
          Social signal scores simulated from public trend data.<br />
          Not financial advice. Balibagus · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
