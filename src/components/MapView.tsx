import { Property, formatPriceShort } from '@/lib/mock-data';
import { useState } from 'react';

interface MapViewProps {
  properties: Property[];
  hoveredId?: string | null;
  onMarkerClick?: (id: string) => void;
}

export const MapView = ({ properties, hoveredId, onMarkerClick }: MapViewProps) => {
  const centerLat = 10.790;
  const centerLng = 106.710;
  const scale = 800;

  const toX = (lng: number) => (lng - centerLng + 0.08) * scale;
  const toY = (lat: number) => (centerLat - lat + 0.06) * scale;

  return (
    <div className="relative w-full h-full bg-xanh-50 rounded-2xl overflow-hidden border border-border min-h-[400px]">
      {/* Mock map background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Mock roads */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 130 130" preserveAspectRatio="none">
        <line x1="0" y1="50" x2="130" y2="50" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
        <line x1="65" y1="0" x2="65" y2="130" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
        <line x1="0" y1="80" x2="130" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
        <line x1="30" y1="0" x2="30" y2="130" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
      </svg>

      {/* Property markers */}
      {properties.map(p => {
        const x = toX(p.lng);
        const y = toY(p.lat);
        const isHovered = hoveredId === p.id;

        return (
          <button
            key={p.id}
            onClick={() => onMarkerClick?.(p.id)}
            className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 ${
              isHovered ? 'z-20 scale-110' : 'z-10'
            }`}
            style={{ left: `${Math.min(Math.max(x / 1.3, 10), 90)}%`, top: `${Math.min(Math.max(y / 1.1, 10), 85)}%` }}
          >
            <div className={`map-marker ${isHovered ? 'animate-pulse-marker bg-xanh-700' : ''}`}>
              {formatPriceShort(p.price)}
            </div>
            <div className="w-2 h-2 bg-primary rounded-full mx-auto -mt-0.5" />
          </button>
        );
      })}

      <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-muted-foreground border border-border">
        Bản đồ · TP. Hồ Chí Minh
      </div>
    </div>
  );
};
