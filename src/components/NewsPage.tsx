import { useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  title: string;
  date: string;
  source: string;
  summary: string;
  url: string;
  category: 'Immobilier' | 'Financier' | 'Foncier' | 'Réglementation';
}

// ─── Static fallback data ────────────────────────────────────────────────────
const STATIC_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Bali Villa Market Sees Record Investment in 2024 as Foreign Interest Surges',
    date: '2025-01-15',
    source: 'Bali Property Report',
    summary: 'Foreign investment in Bali villa and land assets reached a five-year high in 2024, driven by nomadic remote workers and boutique hospitality projects in Canggu and Pererenan.',
    url: 'https://www.balitecture.com/news/',
    category: 'Immobilier',
  },
  {
    id: '2',
    title: 'Indonesia Relaxes Long-Term Visa Rules for Property Investors',
    date: '2025-02-08',
    source: 'Jakarta Post',
    summary: 'The Directorate General of Immigration announced extended stay permits for foreigners holding property interests via PT PMA structures.',
    url: 'https://www.thejakartapost.com/business/2025/02/08/indonesia-immigration.html',
    category: 'Réglementation',
  },
  {
    id: '3',
    title: 'Lombok Mandalika Circuit Drives Land Price Surge in Surrounding Districts',
    date: '2024-11-22',
    source: 'Lombok Property Insider',
    summary: 'Land within 5 km of the Mandalika International Street Circuit has appreciated 35-40% since the inaugural MotoGP event.',
    url: 'https://www.rumah123.com/panduan-properti/',
    category: 'Foncier',
  },
  {
    id: '4',
    title: 'Bank Indonesia Holds Benchmark Rate, Providing Stability for Property Financing',
    date: '2025-01-30',
    source: 'Reuters Indonesia',
    summary: 'Bank Indonesia kept the BI Rate at 6.0% for the third consecutive meeting, signalling a stable macroeconomic environment.',
    url: 'https://www.reuters.com/markets/asia/',
    category: 'Financier',
  },
  {
    id: '5',
    title: 'Canggu and Seminyak Face New Short-Term Rental Density Regulations',
    date: '2024-10-05',
    source: 'Bali Tourism Authority',
    summary: 'Bali Provincial Government announced draft regulations capping new short-term rental permits in already-dense zones.',
    url: 'https://www.baliprov.go.id/',
    category: 'Réglementation',
  },
  {
    id: '6',
    title: 'Nusa Penida Land Prices Double in Three Years on Instagram Tourism Wave',
    date: '2024-09-12',
    source: 'Inside Bali Real Estate',
    summary: 'Driven by viral social media exposure of Kelingking Beach and Broken Beach, Nusa Penida has attracted speculative land buyers.',
    url: 'https://www.kibarer.com/news/',
    category: 'Foncier',
  },
  {
    id: '7',
    title: 'PT PMA Structure Remains Most Reliable Path for Foreign Property Ownership',
    date: '2025-03-01',
    source: 'Emerhub Indonesia',
    summary: 'Legal advisors confirm that establishing a PT PMA continues to be the most secure route for foreigners to hold land rights in Bali and Lombok.',
    url: 'https://emerhub.com/indonesia/property/',
    category: 'Réglementation',
  },
  {
    id: '8',
    title: 'Rupiah Stabilizes Against USD, Boosting Dollar-Denominated Returns',
    date: '2025-02-20',
    source: 'Bloomberg Indonesia',
    summary: 'IDR/USD stabilised at around 15,800 in early 2025. Bali properties priced in USD saw effective yield improvements.',
    url: 'https://www.bloomberg.com/asia/',
    category: 'Financier',
  },
  {
    id: '9',
    title: 'North Bali Airport Environmental Study Approved — Buleleng Speculators Take Note',
    date: '2024-08-17',
    source: 'Kompas Property',
    summary: 'The AMDAL for the planned Bali North Airport near Kubutambahan was approved. Construction projected to begin in 2026.',
    url: 'https://properti.kompas.com/',
    category: 'Foncier',
  },
  {
    id: '10',
    title: 'Bali 2045 Spatial Plan Designates New Touristic Corridors in Tabanan and East Bali',
    date: '2024-07-03',
    source: 'Bali Provincial Planning Agency',
    summary: 'The updated RTRW Bali 2025-2045 introduces new tourism corridors along the Tabanan coast and the East Bali corridor.',
    url: 'https://www.baliprov.go.id/tata-ruang/',
    category: 'Réglementation',
  },
  {
    id: '11',
    title: 'Short-Term Rental Yields in Uluwatu Reach 9-11% Gross as Surf Tourism Booms',
    date: '2024-12-10',
    source: 'Airbnb Insights Bali',
    summary: 'Uluwatu and Bingin Beach posted average occupancy rates above 72% in 2024, with peak season reaching 88%.',
    url: 'https://www.investinbali.com/uluwatu/',
    category: 'Immobilier',
  },
  {
    id: '12',
    title: 'Gili Trawangan Sees Boutique Villa Construction Boom After Lombok Earthquake Recovery',
    date: '2025-01-25',
    source: 'Lombok Tourism Board',
    summary: 'Five years after the 2018 earthquake, Gili Trawangan and Gili Air are experiencing a boutique hospitality investment wave.',
    url: 'https://www.lamudi.co.id/journal/',
    category: 'Immobilier',
  },
];

// ─── RSS feeds (via rss2json) ─────────────────────────────────────────────────
const RSS_FEEDS = [
  { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.thebalireview.com/feed/', source: 'The Bali Review' },
  { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.baliplus.com/feed/', source: 'Bali Plus' },
  { url: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.jakartapost.com/rss/property.xml', source: 'Jakarta Post Property' },
];

function categorize(title: string, desc: string): NewsItem['category'] {
  const text = (title + ' ' + desc).toLowerCase();
  if (/law|regulation|visa|rule|policy|permit/.test(text)) return 'Réglementation';
  if (/rate|bank|loan|credit/.test(text)) return 'Financier';
  if (/land|tanah|foncier/.test(text)) return 'Foncier';
  if (/invest|property|villa/.test(text)) return 'Immobilier';
  if (/price/.test(text)) return 'Financier';
  return 'Immobilier';
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ').trim();
}

interface Rss2JsonItem {
  title: string;
  pubDate: string;
  link: string;
  description: string;
  author?: string;
}

interface Rss2JsonResponse {
  status: string;
  items?: Rss2JsonItem[];
}

async function fetchFeed(feedUrl: string, source: string): Promise<NewsItem[]> {
  const resp = await fetch(feedUrl);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data: Rss2JsonResponse = await resp.json();
  if (data.status !== 'ok' || !data.items) throw new Error('Feed error');

  return data.items.slice(0, 6).map((item, i) => {
    const desc = stripHtml(item.description || '').slice(0, 300);
    return {
      id: `${source}-${i}`,
      title: stripHtml(item.title),
      date: item.pubDate ? item.pubDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
      source,
      summary: desc,
      url: item.link,
      category: categorize(item.title, desc),
    };
  });
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Immobilier', 'Financier', 'Foncier', 'Réglementation'] as const;
type FilterCategory = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<string, string> = {
  Immobilier: '#3b82f6',
  Financier: '#22c55e',
  Foncier: '#c0392b',
  Réglementation: '#a78bfa',
};

interface Props {
  onBack: () => void;
}

export default function NewsPage({ onBack }: Props) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('All');
  const [newsItems, setNewsItems] = useState<NewsItem[]>(STATIC_NEWS);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    let cancelled = false;

    async function loadFeeds() {
      setLoading(true);
      const results: NewsItem[] = [];

      await Promise.allSettled(
        RSS_FEEDS.map(async (feed) => {
          try {
            const items = await fetchFeed(feed.url, feed.source);
            if (!cancelled) results.push(...items);
          } catch {
            // silently skip failed feed
          }
        })
      );

      if (!cancelled) {
        if (results.length > 0) {
          // Sort by date desc
          results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setNewsItems(results);
        }
        // If all failed, keep static items
        setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        setLoading(false);
      }
    }

    loadFeeds();
    return () => { cancelled = true; };
  }, []);

  const filtered =
    activeCategory === 'All'
      ? newsItems
      : newsItems.filter((n) => n.category === activeCategory);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

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
      {/* Header */}
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
          ← Back to Map
        </button>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#c0392b' }}>
            📰 Real Estate &amp; Finance News
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#9c8877', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
              Bali &amp; Indonesia · 2024–2025
            </p>
            {lastUpdated && (
              <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#9c8877' }}>
                Last updated: {lastUpdated}
              </p>
            )}
          </div>
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
          const color = cat === 'All' ? '#c0392b' : CATEGORY_COLORS[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: isActive ? color + '22' : 'transparent',
                border: `1px solid ${isActive ? color : '#e8e0d5'}`,
                borderRadius: '20px',
                color: isActive ? color : '#6b5c4e',
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

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: '#9c8877' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #e8e0d5',
            borderTop: '3px solid #c0392b',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ margin: 0, fontSize: '13px' }}>Fetching latest news…</p>
        </div>
      )}

      {/* Article grid */}
      {!loading && (
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
                  background: '#ffffff',
                  border: '1px solid #e8e0d5',
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
                  <span style={{ fontSize: '11px', color: '#9c8877' }}>{formatDate(item.date)}</span>
                </div>

                {/* Title */}
                <h2
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#1a1410',
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
                    color: '#9c8877',
                  }}
                >
                  <span
                    style={{
                      background: '#f0ebe3',
                      borderRadius: '4px',
                      padding: '2px 7px',
                      fontWeight: 600,
                      color: '#6b5c4e',
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
                    color: '#6b5c4e',
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
      )}
    </div>
  );
}
