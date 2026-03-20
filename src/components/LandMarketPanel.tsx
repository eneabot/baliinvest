import { getZoneTransactions } from '../data/landTransactions';

interface Props {
  zoneId: string;
}

export default function LandMarketPanel({ zoneId }: Props) {
  const data = getZoneTransactions(zoneId);

  if (!data || data.transactions.length === 0) {
    return (
      <div style={{ fontSize: '12px', color: '#475569', padding: '8px 0' }}>
        No transaction data available for this zone
      </div>
    );
  }

  const { transactions } = data;
  const maxAvg = Math.max(...transactions.map((t) => t.avgPricePerSqm));

  return (
    <div>
      {/* Table */}
      <div style={{ overflowX: 'auto', marginBottom: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr>
              {['Year', 'Transactions', 'Avg $/m²', 'Range (min–max)'].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '4px 6px',
                    color: '#475569',
                    fontWeight: 600,
                    borderBottom: '1px solid #1e293b',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.year}>
                <td style={{ padding: '4px 6px', color: '#94a3b8', fontFamily: 'monospace' }}>
                  {t.year}
                </td>
                <td style={{ padding: '4px 6px', color: '#e2e8f0', fontWeight: 600 }}>
                  {t.count}
                </td>
                <td style={{ padding: '4px 6px', color: '#f59e0b', fontWeight: 700 }}>
                  ${t.avgPricePerSqm}
                </td>
                <td style={{ padding: '4px 6px', color: '#64748b', whiteSpace: 'nowrap' }}>
                  ${t.minPrice}–${t.maxPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inline CSS bar chart — avg price trend */}
      <div>
        <div style={{ fontSize: '10px', color: '#475569', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Avg Price Trend ($/m²)
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '48px' }}>
          {transactions.map((t) => {
            const heightPct = maxAvg > 0 ? (t.avgPricePerSqm / maxAvg) * 100 : 0;
            return (
              <div
                key={t.year}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  height: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: `${heightPct}%`,
                    background: 'linear-gradient(180deg, #f59e0b, #d97706)',
                    borderRadius: '2px 2px 0 0',
                    minHeight: '4px',
                    transition: 'height 0.3s ease',
                  }}
                  title={`${t.year}: $${t.avgPricePerSqm}/m²`}
                />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: '4px', marginTop: '3px' }}>
          {transactions.map((t) => (
            <div
              key={t.year}
              style={{ flex: 1, textAlign: 'center', fontSize: '9px', color: '#334155' }}
            >
              {t.year}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
