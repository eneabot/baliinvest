export interface YearlyTransaction {
  year: number;
  count: number;
  avgPricePerSqm: number;
  medianPricePerSqm: number;
  minPrice: number;
  maxPrice: number;
}

export interface ZoneLandTransactions {
  zoneId: string;
  transactions: YearlyTransaction[];
}

// Helper: generate 5-year data with trend
function genYears(
  base: { count: number; avg: number; median: number; min: number; max: number },
  trendPct: number // annual growth % e.g. 8 for +8%/yr
): YearlyTransaction[] {
  const years = [2020, 2021, 2022, 2023, 2024];
  // 2020 is the base year, apply trend forward
  return years.map((year, i) => {
    const mult = Math.pow(1 + trendPct / 100, i);
    const jitter = 1 + (Math.sin(year * 7 + base.count) * 0.03); // tiny deterministic jitter
    return {
      year,
      count: Math.round(base.count * (1 + i * 0.05)), // slight volume growth too
      avgPricePerSqm: Math.round(base.avg * mult * jitter),
      medianPricePerSqm: Math.round(base.median * mult * jitter),
      minPrice: Math.round(base.min * mult),
      maxPrice: Math.round(base.max * mult * jitter),
    };
  });
}

// Prices in USD/m² (1 are = 100 m², so landPricePerAre/100 = $/m²)
// Canggu: landPricePerAre=85000 → ~$850/m²  (premium), trend=8%
// Seminyak: 120000 → ~$1200/m², trend=5%
// Uluwatu: 45000 → $450/m², trend=12%
// Ubud: 35000 → $350/m², trend=6%
// Pererenan: 55000 → $550/m², trend=15%
// Nusa Dua: 95000 → $950/m², trend=4%
// Sanur: 65000 → $650/m², trend=5%
// Tabanan: 18000 → $180/m², trend=18%
// Amed: 12000 → $120/m², trend=20%
// Buleleng: 8000 → $80/m², trend=25%
// Jimbaran: 75000 → $750/m², trend=7%
// Keramas: 28000 → $280/m², trend=14%
// Lombok: 16000 → $160/m², trend=20%
// Lombok-Kuta: 22000 → $220/m², trend=28%
// Lombok-Gili: 28000 → $280/m², trend=16%
// Lombok-North: 9000 → $90/m², trend=22%
// Nusa Lembongan: 25000 → $250/m², trend=18%
// Nusa Penida: 18000 → $180/m², trend=24%

export const landTransactionsData: ZoneLandTransactions[] = [
  {
    zoneId: 'canggu',
    transactions: genYears({ count: 95, avg: 850, median: 820, min: 600, max: 1400 }, 8),
  },
  {
    zoneId: 'seminyak',
    transactions: genYears({ count: 72, avg: 1200, median: 1150, min: 900, max: 1900 }, 5),
  },
  {
    zoneId: 'uluwatu',
    transactions: genYears({ count: 55, avg: 450, median: 420, min: 280, max: 750 }, 12),
  },
  {
    zoneId: 'ubud',
    transactions: genYears({ count: 42, avg: 350, median: 320, min: 200, max: 580 }, 6),
  },
  {
    zoneId: 'pererenan',
    transactions: genYears({ count: 60, avg: 550, median: 520, min: 350, max: 900 }, 15),
  },
  {
    zoneId: 'nusadua',
    transactions: genYears({ count: 28, avg: 950, median: 910, min: 700, max: 1600 }, 4),
  },
  {
    zoneId: 'sanur',
    transactions: genYears({ count: 35, avg: 650, median: 620, min: 450, max: 1050 }, 5),
  },
  {
    zoneId: 'tabanan',
    transactions: genYears({ count: 22, avg: 180, median: 160, min: 90, max: 320 }, 18),
  },
  {
    zoneId: 'amed',
    transactions: genYears({ count: 10, avg: 120, median: 105, min: 55, max: 210 }, 20),
  },
  {
    zoneId: 'buleleng',
    transactions: genYears({ count: 8, avg: 80, median: 70, min: 35, max: 150 }, 25),
  },
  {
    zoneId: 'jimbaran',
    transactions: genYears({ count: 38, avg: 750, median: 710, min: 520, max: 1250 }, 7),
  },
  {
    zoneId: 'keramas',
    transactions: genYears({ count: 25, avg: 280, median: 255, min: 150, max: 480 }, 14),
  },
  {
    zoneId: 'lombok',
    transactions: genYears({ count: 20, avg: 160, median: 145, min: 75, max: 290 }, 20),
  },
  {
    zoneId: 'lombok-kuta',
    transactions: genYears({ count: 30, avg: 220, median: 200, min: 110, max: 420 }, 28),
  },
  {
    zoneId: 'lombok-gili',
    transactions: genYears({ count: 15, avg: 280, median: 260, min: 150, max: 480 }, 16),
  },
  {
    zoneId: 'lombok-north',
    transactions: genYears({ count: 6, avg: 90, median: 80, min: 38, max: 165 }, 22),
  },
  {
    zoneId: 'nusa-lembongan',
    transactions: genYears({ count: 18, avg: 250, median: 230, min: 130, max: 430 }, 18),
  },
  {
    zoneId: 'nusa-penida',
    transactions: genYears({ count: 12, avg: 180, median: 165, min: 85, max: 320 }, 24),
  },
];

export function getZoneTransactions(zoneId: string): ZoneLandTransactions | undefined {
  return landTransactionsData.find((d) => d.zoneId === zoneId);
}
