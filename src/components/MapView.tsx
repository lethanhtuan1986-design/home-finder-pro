import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import L, { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import { formatVNPrice, getImageUrl } from "@/services/index";
import { Loader2, LocateFixed } from "lucide-react";
import type { MapLocationGroup } from "@/services/advertisement.service";

const DEFAULT_CENTER: LatLngTuple = [10.79, 106.71];
const DEFAULT_ZOOM = 13;

interface SearchOverlay {
  centerLat: number;
  centerLng: number;
  radiusKm: number;
}

interface MapViewProps {
  locations?: MapLocationGroup[];
  hoveredId?: string | null;
  loading?: boolean;
  onMarkerClick?: (id: string) => void;
  onBoundsChange?: (bounds: { neLat: number; neLng: number; swLat: number; swLng: number }) => void;
  useGeolocation?: boolean;
  searchOverlay?: SearchOverlay | null;
}

const parsePoint = (point: string): LatLngTuple | null => {
  try {
    const parsed = JSON.parse(point);
    if (Array.isArray(parsed) && parsed.length >= 2) {
      const [lat, lng] = parsed.map(Number);
      if (isFinite(lat) && isFinite(lng) && !(lat === 0 && lng === 0)) {
        return [lat, lng];
      }
    }
  } catch {}
  return null;
};

const buildingSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`;

const shortenAddress = (address: string): string => {
  if (!address) return "Không rõ";
  const parts = address.split(",").map(s => s.trim());
  const short = parts[0] || address;
  return short.length > 22 ? short.slice(0, 20) + "…" : short;
};

const createClusterIcon = (totalAds: number, address: string, isHovered: boolean) => {
  const label = shortenAddress(address);
  const badge = totalAds > 1 ? `<span class="marker-badge">${totalAds}</span>` : "";

  return L.divIcon({
    className: "custom-map-marker",
    html: `<div class="marker-pin ${isHovered ? "marker-pin--active" : ""}">
      <span class="marker-pin__icon">${buildingSvg}</span>
      <span class="marker-pin__label">${label}</span>
      ${badge}
      <span class="marker-pin__arrow"></span>
    </div>`,
    iconSize: [0, 0],
    iconAnchor: [50, 48],
  });
};

const mapPinSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`;

const buildPopupHtml = (loc: MapLocationGroup) => {
  const ads = loc.ads;
  const items = ads.map((ad) => {
    const imageUrl = ad.images?.[0] ? getImageUrl(ad.images[0]) : "/placeholder.svg";
    return `
      <a href="/advertisement/${ad.uuid}" class="popup-room-item" style="display:flex;gap:10px;padding:8px;text-decoration:none;color:inherit;border-radius:8px;transition:background 0.15s ease;">
        <div style="width:72px;height:54px;border-radius:10px;overflow:hidden;flex-shrink:0;background:hsl(var(--muted));">
          <img src="${imageUrl}" alt="" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'" />
        </div>
        <div style="min-width:0;flex:1;display:flex;flex-direction:column;justify-content:center;gap:2px;">
          <p style="font-size:13px;font-weight:600;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:hsl(var(--foreground));">
            ${ad.apartmentUu?.name || ad.title || "Phòng"}
          </p>
          <p style="font-size:14px;font-weight:700;color:hsl(var(--primary));margin:0;">
            ${formatVNPrice(ad.price)}/tháng
          </p>
        </div>
      </a>`;
  }).join("");

  return `
    <div class="popup-premium-container">
      <div style="padding:10px 12px;background:hsl(var(--xanh-50));border-bottom:1px solid hsl(var(--border));display:flex;align-items:center;gap:6px;">
        <span style="color:hsl(var(--primary));flex-shrink:0;">${mapPinSvg}</span>
        <div style="min-width:0;">
          <p style="font-size:13px;font-weight:600;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:hsl(var(--foreground));">${loc.address || "Không rõ vị trí"}</p>
          <p style="font-size:11px;color:hsl(var(--muted-foreground));margin:2px 0 0;">${loc.totalAds} phòng tại đây</p>
        </div>
      </div>
      <div class="popup-room-list" style="padding:4px;">${items}</div>
    </div>
  `;
};

export const MapView = ({ locations = [], hoveredId, loading = false, onMarkerClick, onBoundsChange, searchOverlay }: MapViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const circleRef = useRef<L.Circle | null>(null);
  const initialFitDoneRef = useRef(false);
  const [locating, setLocating] = useState(false);

  const validLocations = useMemo(() =>
    locations.filter((loc) => parsePoint(loc.point) !== null),
    [locations]
  );

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    L.tileLayer("https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
      attribution: "Google",
      maxZoom: 20,
    }).addTo(map);

    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 200);

    // Emit bounds on move
    if (onBoundsChange) {
      const emitBounds = () => {
        const b = map.getBounds();
        onBoundsChange({
          neLat: b.getNorthEast().lat,
          neLng: b.getNorthEast().lng,
          swLat: b.getSouthWest().lat,
          swLng: b.getSouthWest().lng,
        });
      };
      map.on("moveend", emitBounds);
      map.on("zoomend", emitBounds);
      setTimeout(emitBounds, 300);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    const points: LatLngTuple[] = [];

    validLocations.forEach((loc) => {
      const coords = parsePoint(loc.point)!;
      points.push(coords);

      const isHovered = loc.ads.some((a) => hoveredId === a.uuid);
      const key = loc.point;

      const marker = L.marker(coords, {
        icon: createClusterIcon(loc.totalAds, loc.address, isHovered),
        zIndexOffset: isHovered ? 1000 : 0,
      });

      marker.bindTooltip(loc.address || "Không rõ vị trí", {
        direction: "top",
        offset: [0, -10],
        className: "map-tooltip",
      });

      marker.bindPopup(buildPopupHtml(loc), {
        closeButton: false,
        maxWidth: 300,
        className: "leaflet-popup-premium",
      });

      marker.on("click", () => {
        if (loc.ads.length === 1) {
          onMarkerClick?.(loc.ads[0].uuid);
        }
      });

      marker.addTo(map);
      markersRef.current.set(key, marker);
    });

    // Auto fitBounds on first data load only
    if (!initialFitDoneRef.current && points.length > 0) {
      initialFitDoneRef.current = true;
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [validLocations, hoveredId, onMarkerClick]);

  // Resize observer
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const observer = new ResizeObserver(() => map.invalidateSize());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Search area circle overlay
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove previous circle
    if (circleRef.current) {
      circleRef.current.remove();
      circleRef.current = null;
    }

    if (!searchOverlay) return;

    const { centerLat, centerLng, radiusKm } = searchOverlay;
    const circle = L.circle([centerLat, centerLng], {
      radius: radiusKm * 1000,
      color: 'hsl(160, 84%, 39%)',
      weight: 2,
      dashArray: '8, 6',
      fillColor: 'hsl(160, 84%, 39%)',
      fillOpacity: 0.12,
      interactive: false,
    });

    circle.addTo(map);
    circleRef.current = circle;

    // Auto fit bounds to circle
    map.fitBounds(circle.getBounds(), { padding: [40, 40], maxZoom: 15, animate: true });
  }, [searchOverlay]);


  const handleMyLocation = useCallback(() => {
    const map = mapRef.current;
    if (!map || !navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.flyTo([pos.coords.latitude, pos.coords.longitude], 15, { duration: 1.5 });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border min-h-[400px]">
      <div ref={containerRef} style={{ width: "100%", height: "100%", minHeight: 400, zIndex: 0 }} />

      {/* My Location Button */}
      <button
        onClick={handleMyLocation}
        disabled={locating}
        className="absolute bottom-20 right-3 z-[1000] w-10 h-10 rounded-xl bg-card border border-border shadow-lg flex items-center justify-center hover:bg-secondary transition-colors disabled:opacity-60"
        title="Vị trí của tôi"
      >
        <LocateFixed size={18} className={`text-primary ${locating ? "animate-pulse" : ""}`} />
      </button>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-[1000] pointer-events-none">
          <div className="flex items-center gap-2 bg-card px-4 py-2.5 rounded-xl shadow-lg border border-border">
            <Loader2 size={18} className="animate-spin text-primary" />
            <span className="text-sm font-medium text-foreground">Đang tải bản đồ...</span>
          </div>
        </div>
      )}

      {!loading && validLocations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/30 pointer-events-none z-[1000]">
          <p className="text-sm text-muted-foreground">Chưa có dữ liệu bản đồ</p>
        </div>
      )}
    </div>
  );
};
