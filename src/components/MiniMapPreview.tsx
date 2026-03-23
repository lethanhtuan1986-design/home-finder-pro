import { useEffect, useRef } from "react";
import L, { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2 } from "lucide-react";
import type { MapLocationGroup } from "@/services/advertisement.service";

const DEFAULT_CENTER: LatLngTuple = [10.79, 106.71];

const parsePoint = (point: string): LatLngTuple | null => {
  try {
    const parsed = JSON.parse(point);
    if (Array.isArray(parsed) && parsed.length >= 2) {
      const [lat, lng] = parsed.map(Number);
      if (isFinite(lat) && isFinite(lng) && !(lat === 0 && lng === 0)) return [lat, lng];
    }
  } catch {}
  return null;
};

interface MiniMapPreviewProps {
  locations?: MapLocationGroup[];
  loading?: boolean;
}

export const MiniMapPreview = ({ locations = [], loading = false }: MiniMapPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
    });

    L.tileLayer("https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", { maxZoom: 20 }).addTo(map);
    mapRef.current = map;

    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const validLocs = locations.filter((l) => parsePoint(l.point));
    const points = validLocs.map((l) => parsePoint(l.point)!);

    // Clear old markers
    map.eachLayer((layer) => { if (layer instanceof L.CircleMarker) map.removeLayer(layer); });

    points.forEach((p) => {
      L.circleMarker(p, { radius: 4, fillColor: "hsl(var(--primary))", fillOpacity: 0.8, color: "white", weight: 1 }).addTo(map);
    });

    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [10, 10], maxZoom: 14 });
    }
  }, [locations]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60">
          <Loader2 size={18} className="animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};
