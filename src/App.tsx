import { useState, useCallback } from 'react';
import { zones, calculateScore } from './data/zones';
import type { Zone } from './data/zones';
import MapView from './components/MapView';
import LeftPanel from './components/LeftPanel';
import LoadingScreen from './components/LoadingScreen';
import WorldForecast from './components/WorldForecast';

export interface Weights {
  zonage: number;
  rendement: number;
  foncier: number;
  accessibilite: number;
  attractivite: number;
}

const DEFAULT_WEIGHTS: Weights = {
  zonage: 0.20,
  rendement: 0.30,
  foncier: 0.20,
  accessibilite: 0.15,
  attractivite: 0.15,
};

export default function App() {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [minScore, setMinScore] = useState<number>(0);
  const [focusedZone, setFocusedZone] = useState<Zone | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<'map' | 'world'>('map');

  const weightsArray = [
    weights.zonage,
    weights.rendement,
    weights.foncier,
    weights.accessibilite,
    weights.attractivite,
  ];

  const scoredZones = zones.map((z) => ({
    ...z,
    globalScore: calculateScore(z, weightsArray),
  }));

  const filteredZones = scoredZones.filter((z) => {
    if (filterType !== 'all' && z.raw.zoneType !== filterType) return false;
    if (z.globalScore < minScore) return false;
    return true;
  });

  const handleWeightChange = useCallback((key: keyof Weights, newVal: number) => {
    setWeights((prev) => {
      const old = prev[key];
      const diff = newVal - old;
      if (diff === 0) return prev;

      const otherKeys = (Object.keys(prev) as (keyof Weights)[]).filter((k) => k !== key);
      const otherSum = otherKeys.reduce((s, k) => s + prev[k], 0);

      const updated = { ...prev, [key]: newVal };

      if (otherSum > 0) {
        const scale = (1 - newVal) / otherSum;
        otherKeys.forEach((k) => {
          updated[k] = Math.max(0, Math.round(prev[k] * scale * 100) / 100);
        });
      } else {
        const share = (1 - newVal) / otherKeys.length;
        otherKeys.forEach((k) => {
          updated[k] = Math.max(0, Math.round(share * 100) / 100);
        });
      }

      // Fix rounding to ensure sum = 1
      const total = (Object.values(updated) as number[]).reduce((s, v) => s + v, 0);
      const delta = 1 - total;
      if (Math.abs(delta) > 0.001) {
        const lastKey = otherKeys[otherKeys.length - 1];
        updated[lastKey] = Math.max(0, Math.round((updated[lastKey] + delta) * 100) / 100);
      }

      return updated;
    });
  }, []);

  const handleZoneCompare = useCallback((zoneId: string) => {
    setSelectedZones((prev) => {
      if (prev.includes(zoneId)) {
        return prev.filter((id) => id !== zoneId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), zoneId];
      }
      return [...prev, zoneId];
    });
  }, []);

  const handleZoneFocus = useCallback((zone: Zone) => {
    setFocusedZone(zone);
  }, []);

  if (currentPage === 'world') {
    return <WorldForecast onBack={() => setCurrentPage('map')} />;
  }

  return (
    <>
      {isLoading && <LoadingScreen onDone={() => setIsLoading(false)} />}
      <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#0f1117' }}>
        <LeftPanel
          weights={weights}
          onWeightChange={handleWeightChange}
          scoredZones={filteredZones}
          allScoredZones={scoredZones}
          selectedZones={selectedZones}
          filterType={filterType}
          onFilterTypeChange={setFilterType}
          minScore={minScore}
          onMinScoreChange={setMinScore}
          onZoneFocus={handleZoneFocus}
          onRemoveCompare={(id) => setSelectedZones((prev) => prev.filter((x) => x !== id))}
          onNavigateWorld={() => setCurrentPage('world')}
          totalZones={zones.length}
        />
        <div style={{ flex: 1, position: 'relative' }}>
          <MapView
            zones={filteredZones}
            weights={weightsArray}
            selectedZones={selectedZones}
            onZoneCompare={handleZoneCompare}
            focusedZone={focusedZone}
            onFocusClear={() => setFocusedZone(null)}
          />
        </div>
      </div>
    </>
  );
}
