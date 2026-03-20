import { useState } from 'react';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  source: string;
  summary: string;
  url: string;
  category: 'Immobilier' | 'Financier' | 'Foncier' | 'Réglementation';
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: '1',
    title: 'Bali Villa Market Sees Record Investment in 2024 as Foreign Interest Surges',
    date: '2025-01-15',
    source: 'Bali Property Report',
    summary:
      'Foreign investment in Bali villa and land assets reached a five-year high in 2024, driven by nomadic remote workers and boutique hospitality projects in Canggu and Pererenan. Average transaction values rose 18% year-on-year.',
    url: 'https://www.balitecture.com/news/',
    category: 'Immobilier',
  },
  {
    id: '2',
    title: 'Indonesia Relaxes Long-Term Visa Rules for Property Investors',
    date: '2025-02-08',
    source: 'Jakarta Post',
    summary:
      'The Directorate General of Immigration announced extended stay permits for foreigners holding property interests via PT PMA structures. The second-home visa now covers a wider range of property types and can be renewed for up to 10 years.',
    url: 'https://www.thejakartapost.com/business/2025/02/08/indonesia-immigration.html',
    category: 'Réglementation',
  },
  {
    id: '3',
    title: 'Lombok Mandalika Circuit Drives Land Price Surge in Surrounding Districts',
    date: '2024-11-22',
    source: 'Lombok Property Insider',
    summary:
      'Land within 5 km of the Mandalika International Street Circuit has appreciated 35-40% since the inaugural MotoGP event. Government-backed infrastructure improvements are extending the hotspot toward Kuta and Seger Beach.',
    url: 'https://www.rumah123.com/panduan-properti/',
    category: 'Foncier',
  },
  {
    id: '4',
    title: 'Bank Indonesia Holds Benchmark Rate, Providing Stability for Property Financing',
    date: '2025-01-30',
    source: 'Reuters Indonesia',
    summary:
      'Bank Indonesia kept the BI Rate at 6.0% for the third consecutive meeting, signalling a stable macroeconomic environment. Real estate developers welcomed the decision, noting that KPR (mortgage) demand has been recovering since Q3 2024.',
    url: 'https://www.reuters.com/markets/asia/',
    category: 'Financier',
  },
  {
    id: '5',
    title: 'Canggu and Seminyak Face New Short-Term Rental Density Regulations',
    date: '2024-10-05',
    source: 'Bali Tourism Authority',
    summary:
      'Bali Provincial Government announced draft regulations capping new short-term rental permits in already-dense zones including Canggu, Seminyak, and Legian. New villa developments must comply with minimum green-space requirements of 40%.',
    url: 'https://www.baliprov.go.id/',
    category: 'Réglementation',
  },
  {
    id: '6',
    title: 'Nusa Penida Land Prices Double in Three Years on Instagram Tourism Wave',
    date: '2024-09-12',
    source: 'Inside Bali Real Estate',
    summary:
      'Driven by viral social media exposure of Kelingking Beach and Broken Beach, Nusa Penida has attracted speculative land buyers from Jakarta and Singapore. Median land prices reached IDR 2.8 billion per are in prime clifftop locations.',
    url: 'https://www.kibarer.com/news/',
    category: 'Foncier',
  },
  {
    id: '7',
    title: 'PT PMA Structure Remains Most Reliable Path for Foreign Property Ownership',
    date: '2025-03-01',
    source: 'Emerhub Indonesia',
    summary:
      'Legal advisors confirm that establishing a PT PMA (foreign-owned company) continues to be the most secure and flexible route for foreigners to hold land rights in Bali and Lombok. Recent updates allow single-shareholder PTAs in some sectors.',
    url: 'https://emerhub.com/indonesia/property/',
    category: 'Réglementation',
  },
  {
    id: '8',
    title: 'Rupiah Stabilizes Against USD, Boosting Dollar-Denominated Returns for Investors',
    date: '2025-02-20',
    source: 'Bloomberg Indonesia',
    summary:
      'IDR/USD stabilised at around 15,800 in early 2025 after volatility in late 2024. Analysts note that Bali properties priced in USD saw effective yield improvements for Indonesian Rupiah-based sellers, narrowing the valuation gap.',
    url: 'https://www.bloomberg.com/asia/',
    category: 'Financier',
  },
  {
    id: '9',
    title: 'North Bali Airport Environmental Study Approved — Buleleng Speculators Take Note',
    date: '2024-08-17',
    source: 'Kompas Property',
    summary:
      'The AMDAL (environmental impact assessment) for the planned Bali North Airport near Kubutambahan was approved by the Ministry of Environment. Construction is projected to begin in 2026, with land prices in Singaraja and surroundings already responding.',
    url: 'https://properti.kompas.com/',
    category: 'Foncier',
  },
  {
    id: '10',
    title: 'Bali 2045 Spatial Plan Designates New Touristic Corridors in Tabanan and East Bali',
    date: '2024-07-03',
    source: 'Bali Provincial Planning Agency (Bappeda)',
    summary:
      'The updated RTRW Bali 2025-2045 spatial plan introduces new tourism corridors along the Tabanan coast and the East Bali corridor from Klungkung to Karangasem. Rezoning could significantly increase land values in currently agricultural zones.',
    url: 'https://www.baliprov.go.id/tata-ruang/',
    category: 'Réglementation',
  },
  {
    id: '11',
    title: 'Short-Term Rental Yields in Uluwatu Reach 9-11% Gross as Surf Tourism Booms',
    date: '2024-12-10',
    source: 'Airbnb Insights Bali',
    summary:
      'Uluwatu and Bingin Beach posted average occupancy rates above 72% in 2024, with peak season (June–September) reaching 88%. New clifftop villas are commanding nightly rates of $180–$320 USD, making gross ROI calculations compelling for investors.',
    url: 'https://www.investinbali.com/uluwatu/',
    category: 'Immobilier',
  },
  {
    id: '12',
    title: 'Gili Trawangan Sees Boutique Villa Construction Boom After Lombok Earthquake Recovery',
    date: '2025-01-25',
    source: 'Lombok Tourism Board',
    summary:
      'Five years after the 2018 earthquake, Gili Trawangan and Gili Air have fully recovered and are experiencing a boutique hospitality investment wave. Small-footprint eco-villas (under 200m²) are selling out within months of listing.',
    url: 'https://www.lamudi.co.id/journal/',
    category: 'Immobilier',
  },
];

const CATEGORIES = ['All', 'Immobilier', 'Financier', 'Foncier', 'Réglementation'] as const;
type FilterCategory = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<string, string> = {
  Immobilier: '#3b82f6',
  Financier: '#22c55e',
  Foncier: '#f59e0b',
  Réglementation: '#a78bfa',
};

interface Props {
  onBack: () => void;
}

export default function NewsPage({ onBack }: Props) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('All');

  const filtered =
    activeCategory === 'All'
      ? NEWS_ITEMS
      : NEWS_ITEMS.filter((n) => n.category === activeCategory);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f1117',
        color: '#e2e8f0',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
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
          ← Back to Map
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#f59e0b' }}>
            📰 Real Estate &amp; Finance News
          </h1>
          <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#475569', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            Bali &amp; Indonesia · 2024–2025
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '14px 20px 0',
          overflowX: 'auto',
          flexShrink: 0,
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const color = cat === 'All' ? '#d97706' : CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: isActive ? color + '22' : 'transparent',
                border: `1px solid ${isActive ? color : '#2d3748'}`,
                borderRadius: '20px',
                color: isActive ? color : '#64748b',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 400,
                padding: '5px 14px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Article grid */}
      <div
        style={{
          padding: '16px 20px 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
          gap: '14px',
        }}
      >
        {filtered.map((item) => {
          const catColor = CATEGORY_COLORS[item.category];
          return (
            <div
              key={item.id}
              style={{
                background: '#131822',
                border: '1px solid #1e293b',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'border-color 0.15s',
              }}
            >
              {/* Top row: category badge + date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    background: catColor + '22',
                    border: `1px solid ${catColor}55`,
                    borderRadius: '12px',
                    color: catColor,
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '3px 9px',
                    letterSpacing: '0.3px',
                  }}
                >
                  {item.category}
                </span>
                <span style={{ fontSize: '11px', color: '#475569' }}>{formatDate(item.date)}</span>
              </div>

              {/* Title */}
              <h2
                style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#e2e8f0',
                  lineHeight: 1.45,
                }}
              >
                {item.title}
              </h2>

              {/* Source badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '11px',
                  color: '#64748b',
                }}
              >
                <span
                  style={{
                    background: '#1e293b',
                    borderRadius: '4px',
                    padding: '2px 7px',
                    fontWeight: 600,
                  }}
                >
                  {item.source}
                </span>
              </div>

              {/* Summary */}
              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  color: '#94a3b8',
                  lineHeight: 1.6,
                  flex: 1,
                }}
              >
                {item.summary}
              </p>

              {/* Read link */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: catColor,
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  alignSelf: 'flex-start',
                }}
              >
                Read article →
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
