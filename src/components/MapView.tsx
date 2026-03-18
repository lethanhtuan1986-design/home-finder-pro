import { useEffect, useRef, useMemo } from "react";
import L, { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import { formatVNPrice, getImageUrl } from "@/services/index";
import { Loader2 } from "lucide-react";
import type { MapLocationGroup } from "@/services/advertisement.service";

const DEFAULT_CENTER: LatLngTuple = [10.79, 106.71];
const DEFAULT_ZOOM = 13;

interface MapViewProps {
  locations?: MapLocationGroup[];
  hoveredId?: string | null;
  loading?: boolean;
  onMarkerClick?: (id: string) => void;
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

const createClusterIcon = (totalAds: number, minPrice: number, isHovered: boolean) => {
  const priceText = (minPrice / 1000000).toFixed(1).replace(".0", "") + "tr";
  const badge = totalAds > 1 ? `<span style="
    position:absolute;top:-6px;right:-8px;
    background:hsl(var(--destructive, 0 84% 60%));color:white;
    font-size:10px;font-weight:700;
    min-width:18px;height:18px;
    display:flex;align-items:center;justify-content:center;
    border-radius:9px;border:2px solid white;
    padding:0 4px;
  ">${totalAds}</span>` : "";

  return L.divIcon({
    className: "custom-map-marker",
    html: `<div style="
      position:relative;
      background: ${isHovered ? "hsl(var(--xanh-700))" : "hsl(var(--primary))"};
      color: white;
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      transform: ${isHovered ? "scale(1.18)" : "scale(1)"};
      transition: transform 0.2s ease, background 0.2s ease;
      border: 2px solid white;
      cursor: pointer;
    ">${priceText}${badge}</div>`,
    iconSize: [0, 0],
    iconAnchor: [20, 15],
  });
};

const buildPopupHtml = (loc: MapLocationGroup) => {
  const ads = loc.ads;
  const items = ads.slice(0, 3).map((ad) => {
    const imageUrl = ad.images?.[0] ? getImageUrl(ad.images[0]) : "/placeholder.svg";
    return `
      <a href="/property/${ad.uuid}" class="popup-room-item">
        <div class="popup-room-thumb">
          <img src="${imageUrl}" alt="" onerror="this.src='/placeholder.svg'" />
        </div>
        <div class="popup-room-info">
          <p class="popup-room-name">${ad.apartmentUu?.name || ad.title || "Phòng"}</p>
          <p class="popup-room-price">${formatVNPrice(ad.price)}/tháng</p>
        </div>
      </a>`;
  }).join("");

  const moreCount = ads.length - 3;
  const more = moreCount > 0 ? `<a href="/search?address=${encodeURIComponent(loc.address || '')}" class="popup-cta-btn">
    <span>+${moreCount} phòng khác</span>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  </a>` : "";

  return `
    <div class="popup-premium-container">
      <div class="popup-premium-header">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        <div>
          <p class="popup-premium-address">${loc.address || "Không rõ vị trí"}</p>
          <p class="popup-premium-count">${loc.totalAds} phòng có sẵn</p>
        </div>
      </div>
      <div class="popup-premium-list">${items}</div>
      ${more}
    </div>
  `;
};

export const MapView = ({ locations = [], hoveredId, loading = false, onMarkerClick }: MapViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

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

      const minPrice = Math.min(...loc.ads.map((a) => a.price));
      const isHovered = loc.ads.some((a) => hoveredId === a.uuid);
      const key = loc.point;

      const marker = L.marker(coords, {
        icon: createClusterIcon(loc.totalAds, minPrice, isHovered),
        zIndexOffset: isHovered ? 1000 : 0,
      });

      marker.bindTooltip(loc.address || "Không rõ vị trí", {
        direction: "top",
        offset: [0, -10],
        className: "map-tooltip",
      });

      marker.bindPopup(buildPopupHtml(loc), {
        closeButton: false,
        maxWidth: 320,
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

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
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

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border min-h-[400px]">
      <div ref={containerRef} style={{ width: "100%", height: "100%", minHeight: 400, zIndex: 0 }} />

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
