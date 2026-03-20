import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getScoreColor } from '../data/zones';
import type { Zone } from '../data/zones';
import ZonePopup from './ZonePopup';
import ReactDOM from 'react-dom/client';

interface Props {
  zones: (Zone & { globalScore: number })[];
  weights: number[];
  selectedZones: string[];
  onZoneCompare: (id: string) => void;
  focusedZone: Zone | null;
  onFocusClear: () => void;
  onViewDetail?: (zone: Zone & { globalScore: number }) => void;
}

function MapCircles({ zones, weights, selectedZones, onZoneCompare, focusedZone, onFocusClear, onViewDetail }: Props) {
  const map = useMap();
  const circlesRef = useRef<Map<string, L.Circle>>(new Map());
  const labelsRef = useRef<Map<string, L.Marker>>(new Map());
  const popupRef = useRef<L.Popup | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  useEffect(() => {
    if (focusedZone) {
      map.setView([focusedZone.lat, focusedZone.lng], 12, { animate: true });
      onFocusClear();
    }
  }, [focusedZone]);

  // Update opacity when selectedZoneId changes
  useEffect(() => {
    circlesRef.current.forEach((circle, id) => {
      if (selectedZoneId === null) {
        circle.setStyle({ fillOpacity: 0.65, opacity: 1 });
      } else if (id === selectedZoneId) {
        circle.setStyle({ fillOpacity: 1.0, opacity: 1 });
      } else {
        circle.setStyle({ fillOpacity: 0.15, opacity: 0.3 });
      }
    });
  }, [selectedZoneId]);

  useEffect(() => {
    // Remove old circles and labels
    circlesRef.current.forEach((c) => c.remove());
    circlesRef.current.clear();
    labelsRef.current.forEach((m) => m.remove());
    labelsRef.current.clear();

    // Click on map background resets focus
    const handleMapClick = () => {
      setSelectedZoneId(null);
    };
    map.on('click', handleMapClick);

    zones.forEach((zone) => {
      const score = zone.globalScore;
      const color = getScoreColor(score);
      const isSelected = selectedZones.includes(zone.id);

      const circle = L.circle([zone.lat, zone.lng], {
        radius: 3500,
        fillColor: color,
        fillOpacity: 0.65,
        color: isSelected ? '#f59e0b' : 'white',
        weight: isSelected ? 3 : 1.5,
      });

      circle.bindTooltip(`
        <div style="background:#1a1f2e;color:#e2e8f0;border:1px solid #2d3748;padding:6px 10px;border-radius:6px;font-size:13px;">
          <strong style="color:${color}">${zone.name}</strong><br/>
          Score: <strong style="color:${color}">${score}/100</strong>
          ${zone.trendBonus > 8 ? ' 🔥' : ''}
        </div>
      `, {
        permanent: false,
        sticky: true,
        opacity: 1,
        className: 'custom-tooltip',
      });

      circle.on('click', (e) => {
        L.DomEvent.stopPropagation(e);

        // Update focus state
        setSelectedZoneId(zone.id);

        if (popupRef.current) {
          popupRef.current.remove();
        }

        const container = document.createElement('div');
        const root = ReactDOM.createRoot(container);
        root.render(
          <ZonePopup
            zone={zone}
            weights={weights}
            isSelected={selectedZones.includes(zone.id)}
            onCompare={() => {
              onZoneCompare(zone.id);
              if (popupRef.current) popupRef.current.remove();
            }}
            onViewDetail={onViewDetail ? () => {
              if (popupRef.current) popupRef.current.remove();
              onViewDetail(zone);
            } : undefined}
          />
        );

        const popup = L.popup({
          maxWidth: 400,
          minWidth: 340,
          className: 'zone-popup',
          closeButton: true,
          autoClose: true,
        })
          .setLatLng([zone.lat, zone.lng])
          .setContent(container);

        popup.addTo(map);
        popupRef.current = popup;
      });

      circle.addTo(map);
      circlesRef.current.set(zone.id, circle);

      // Listings count label using DivIcon
      const count = zone.listingsCount ?? 0;
      const labelIcon = L.divIcon({
        html: `<div style="
          color: white;
          font-size: 10px;
          font-weight: 700;
          text-align: center;
          line-height: 1;
          text-shadow: 0 1px 2px rgba(0,0,0,0.8);
          pointer-events: none;
          white-space: nowrap;
        ">${count}</div>`,
        className: '',
        iconSize: [24, 12],
        iconAnchor: [12, 6],
      });

      const labelMarker = L.marker([zone.lat, zone.lng], {
        icon: labelIcon,
        interactive: false,
        zIndexOffset: 1000,
      });

      labelMarker.addTo(map);
      labelsRef.current.set(zone.id, labelMarker);
    });

    return () => {
      map.off('click', handleMapClick);
      circlesRef.current.forEach((c) => c.remove());
      circlesRef.current.clear();
      labelsRef.current.forEach((m) => m.remove());
      labelsRef.current.clear();
    };
  }, [zones, selectedZones, weights]);

  return null;
}

export default function MapView({ zones, weights, selectedZones, onZoneCompare, focusedZone, onFocusClear, onViewDetail }: Props) {
  return (
    <MapContainer
      center={[-8.5, 115.25]}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <MapCircles
        zones={zones}
        weights={weights}
        selectedZones={selectedZones}
        onZoneCompare={onZoneCompare}
        focusedZone={focusedZone}
        onFocusClear={onFocusClear}
        onViewDetail={onViewDetail}
      />
    </MapContainer>
  );
}
