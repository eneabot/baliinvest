export interface Zone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  scores: {
    zonage: number;
    rendement: number;
    foncier: number;
    accessibilite: number;
    attractivite: number;
  };
  raw: {
    zoneType: string;
    avgNightlyRate: number;
    occupancyRate: number;
    landPricePerAre: number;
    landPriceTrend: number;
    distanceAirport: number;
  };
  trendBonus: number;
  trendSignal: string;
  listingsCount: number;
}

export const zones: Zone[] = [
  { id:'canggu', name:'Canggu', lat:-8.6478, lng:115.1385, scores:{zonage:75,rendement:85,foncier:35,accessibilite:80,attractivite:90}, raw:{zoneType:'Residential',avgNightlyRate:185,occupancyRate:0.78,landPricePerAre:85000,landPriceTrend:8,distanceAirport:35}, trendBonus:5, trendSignal:'Listings growth +28%/yr — mature but still expanding', listingsCount:47},
  { id:'seminyak', name:'Seminyak', lat:-8.6901, lng:115.1612, scores:{zonage:80,rendement:80,foncier:25,accessibilite:90,attractivite:88}, raw:{zoneType:'Touristic',avgNightlyRate:210,occupancyRate:0.82,landPricePerAre:120000,landPriceTrend:5,distanceAirport:20}, trendBonus:3, trendSignal:'Mature zone, stable premium market', listingsCount:28},
  { id:'uluwatu', name:'Uluwatu', lat:-8.8291, lng:115.0849, scores:{zonage:70,rendement:72,foncier:55,accessibilite:60,attractivite:75}, raw:{zoneType:'Touristic',avgNightlyRate:165,occupancyRate:0.71,landPricePerAre:45000,landPriceTrend:12,distanceAirport:45}, trendBonus:12, trendSignal:'Surf tourism boom + Pecatu development corridor', listingsCount:35},
  { id:'ubud', name:'Ubud', lat:-8.5069, lng:115.2625, scores:{zonage:55,rendement:58,foncier:65,accessibilite:45,attractivite:80}, raw:{zoneType:'Residential',avgNightlyRate:140,occupancyRate:0.68,landPricePerAre:35000,landPriceTrend:6,distanceAirport:75}, trendBonus:3, trendSignal:'Stabilised wellness market, steady demand', listingsCount:22},
  { id:'pererenan', name:'Pererenan', lat:-8.6320, lng:115.1230, scores:{zonage:68,rendement:78,foncier:62,accessibilite:72,attractivite:70}, raw:{zoneType:'Residential',avgNightlyRate:155,occupancyRate:0.74,landPricePerAre:55000,landPriceTrend:15,distanceAirport:38}, trendBonus:13, trendSignal:'Canggu overflow — land prices doubled in 3 years', listingsCount:31},
  { id:'nusadua', name:'Nusa Dua', lat:-8.8007, lng:115.2314, scores:{zonage:85,rendement:65,foncier:30,accessibilite:85,attractivite:70}, raw:{zoneType:'Touristic',avgNightlyRate:250,occupancyRate:0.72,landPricePerAre:95000,landPriceTrend:4,distanceAirport:25}, trendBonus:2, trendSignal:'Established premium hotel zone', listingsCount:15},
  { id:'sanur', name:'Sanur', lat:-8.7057, lng:115.2630, scores:{zonage:72,rendement:60,foncier:45,accessibilite:82,attractivite:65}, raw:{zoneType:'Residential',avgNightlyRate:130,occupancyRate:0.65,landPricePerAre:65000,landPriceTrend:5,distanceAirport:30}, trendBonus:2, trendSignal:'Family market, stable and low-volatility', listingsCount:18},
  { id:'tabanan', name:'Tabanan Nord', lat:-8.5400, lng:115.0800, scores:{zonage:50,rendement:55,foncier:80,accessibilite:55,attractivite:45}, raw:{zoneType:'Agricultural',avgNightlyRate:95,occupancyRate:0.52,landPricePerAre:18000,landPriceTrend:18,distanceAirport:50}, trendBonus:10, trendSignal:'Emerging — very affordable land, high upside', listingsCount:12},
  { id:'amed', name:'Amed', lat:-8.3467, lng:115.6472, scores:{zonage:45,rendement:48,foncier:85,accessibilite:30,attractivite:55}, raw:{zoneType:'Residential',avgNightlyRate:85,occupancyRate:0.48,landPricePerAre:12000,landPriceTrend:20,distanceAirport:120}, trendBonus:8, trendSignal:'Growing diving hub, early-stage entry point', listingsCount:8},
  { id:'buleleng', name:'Buleleng / Singaraja', lat:-8.1122, lng:115.0892, scores:{zonage:40,rendement:35,foncier:90,accessibilite:35,attractivite:40}, raw:{zoneType:'Commercial',avgNightlyRate:65,occupancyRate:0.38,landPricePerAre:8000,landPriceTrend:25,distanceAirport:130}, trendBonus:15, trendSignal:'North Bali airport planned — speculative play', listingsCount:5},
  { id:'jimbaran', name:'Jimbaran', lat:-8.7868, lng:115.1580, scores:{zonage:78,rendement:70,foncier:40,accessibilite:88,attractivite:72}, raw:{zoneType:'Touristic',avgNightlyRate:195,occupancyRate:0.74,landPricePerAre:75000,landPriceTrend:7,distanceAirport:15}, trendBonus:5, trendSignal:'Airport proximity + seafood destination', listingsCount:20},
  { id:'keramas', name:'Keramas / Gianyar', lat:-8.5840, lng:115.3260, scores:{zonage:52,rendement:62,foncier:70,accessibilite:50,attractivite:58}, raw:{zoneType:'Residential',avgNightlyRate:110,occupancyRate:0.60,landPricePerAre:28000,landPriceTrend:14,distanceAirport:60}, trendBonus:9, trendSignal:'World-class surf breaks, early-stage development', listingsCount:14},
  { id:'lombok', name:'Lombok — Senggigi', lat:-8.4943, lng:116.0400, scores:{zonage:58,rendement:62,foncier:82,accessibilite:42,attractivite:64}, raw:{zoneType:'Touristic',avgNightlyRate:115,occupancyRate:0.60,landPricePerAre:16000,landPriceTrend:20,distanceAirport:85}, trendBonus:13, trendSignal:'Next Bali — early stage, land prices still very low', listingsCount:12},
  { id:'lombok-kuta', name:'Lombok — Kuta Mandalika', lat:-8.8876, lng:116.2882, scores:{zonage:65,rendement:68,foncier:78,accessibilite:45,attractivite:68}, raw:{zoneType:'Touristic',avgNightlyRate:125,occupancyRate:0.63,landPricePerAre:22000,landPriceTrend:28,distanceAirport:20}, trendBonus:15, trendSignal:'MotoGP circuit built — massive gov investment', listingsCount:18},
  { id:'lombok-gili', name:'Lombok — Gili Islands', lat:-8.3515, lng:116.0498, scores:{zonage:55,rendement:70,foncier:72,accessibilite:38,attractivite:78}, raw:{zoneType:'Touristic',avgNightlyRate:140,occupancyRate:0.68,landPricePerAre:28000,landPriceTrend:16,distanceAirport:110}, trendBonus:10, trendSignal:'World-class diving — high occupancy boutique villas', listingsCount:9},
  { id:'lombok-north', name:'Lombok — North Coast', lat:-8.2800, lng:116.3500, scores:{zonage:42,rendement:45,foncier:88,accessibilite:30,attractivite:52}, raw:{zoneType:'Residential',avgNightlyRate:80,occupancyRate:0.45,landPricePerAre:9000,landPriceTrend:22,distanceAirport:140}, trendBonus:9, trendSignal:'Untouched coast — ultra early stage, high risk/reward', listingsCount:5},
  { id:'nusa-lembongan', name:'Nusa Lembongan', lat:-8.6833, lng:115.4500, scores:{zonage:60,rendement:68,foncier:72,accessibilite:42,attractivite:74}, raw:{zoneType:'Touristic',avgNightlyRate:130,occupancyRate:0.65,landPricePerAre:25000,landPriceTrend:18,distanceAirport:85}, trendBonus:11, trendSignal:'Island premium — boutique villa boom', listingsCount:11},
  { id:'nusa-penida', name:'Nusa Penida', lat:-8.7278, lng:115.5444, scores:{zonage:48,rendement:55,foncier:78,accessibilite:35,attractivite:70}, raw:{zoneType:'Residential',avgNightlyRate:105,occupancyRate:0.60,landPricePerAre:18000,landPriceTrend:24,distanceAirport:95}, trendBonus:13, trendSignal:'Instagram hotspot — Kelingking Beach effect', listingsCount:7},
];

export function calculateScore(zone: Zone, weights: number[]): number {
  const [w1, w2, w3, w4, w5] = weights;
  if (zone.scores.zonage === 0) return 0;
  const base = w1 * zone.scores.zonage + w2 * zone.scores.rendement + w3 * zone.scores.foncier + w4 * zone.scores.accessibilite + w5 * zone.scores.attractivite;
  return Math.min(100, Math.round(base + zone.trendBonus));
}

export function getScoreColor(score: number): string {
  if (score >= 75) return '#22c55e';
  if (score >= 65) return '#eab308';
  if (score >= 50) return '#f97316';
  return '#ef4444';
}
