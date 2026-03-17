import { useEffect, useRef, useMemo, useCallback } from "react";
import L, { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import { formatVNPrice, getImageUrl } from "@/services/index";
import { Loader2 } from "lucide-react";

const DEFAULT_CENTER: LatLngTuple = [10.79, 106.71];
const DEFAULT_ZOOM = 13;

interface MapViewProps {
  advertisements?: any[];
  hoveredId?: string | null;
  loading?: boolean;
  onMarkerClick?: (id: string) => void;
}

const safeCoords = (apt: any): LatLngTuple | null => {
  let lat = apt?.latitude;
  let lng = apt?.longitude;
  if (lat == null || lng == null || !isFinite(lat) || !isFinite(lng)) return null;
  if (lat === 0 && lng === 0) return null;
  if (Math.abs(lat) > 90 && Math.abs(lng) <= 90) {
    [lat, lng] = [lng, lat];
  }
  return [lat, lng];
};

const createPriceMarkerIcon = (price: number, isHovered: boolean) => {
  const priceText = (price / 1000000).toFixed(1).replace(".0", "") + "tr";
  return L.divIcon({
    className: "custom-map-marker",
    html: `<div style="
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
    ">${priceText}</div>`,
    iconSize: [0, 0],
    iconAnchor: [20, 15],
  });
};

const buildPopupHtml = (ad: any) => {
  const apt = ad.apartmentUu;
  const imageUrl = ad.images?.[0] ? getImageUrl(ad.images[0]) : "/placeholder.svg";
  const addressParts = [apt?.ward?.fullName, apt?.province?.fullName].filter(Boolean).join(", ");

  return `
    <a href="/property/${ad.uuid}" style="display:block;width:240px;text-decoration:none;color:inherit;">
      <div style="width:100%;height:130px;overflow:hidden;border-radius:8px 8px 0 0;">
        <img src="${imageUrl}" alt="${ad.title || ""}" 
          style="width:100%;height:100%;object-fit:cover;" 
          onerror="this.src='/placeholder.svg'" />
      </div>
      <div style="padding:10px;">
        <p style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin:0 0 6px;">
          ${ad.title || "Không có tiêu đề"}
        </p>
        <p style="font-size:14px;font-weight:700;color:hsl(var(--primary));margin:0 0 4px;">
          ${formatVNPrice(ad.price)}/tháng
        </p>
        ${ad.deposit > 0 ? `<p style="font-size:11px;color:#888;margin:0 0 4px;">Cọc: ${formatVNPrice(ad.deposit)}</p>` : ""}
        <div style="display:flex;gap:6px;margin:0 0 4px;">
          ${apt?.apartmentSize > 0 ? `<span style="font-size:11px;background:#f3f4f6;padding:2px 6px;border-radius:4px;">${apt.apartmentSize}m²</span>` : ""}
          ${apt?.roomCount > 0 ? `<span style="font-size:11px;background:#f3f4f6;padding:2px 6px;border-radius:4px;">${apt.roomCount} phòng</span>` : ""}
        </div>
        <p style="font-size:11px;color:#888;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          📍 ${addressParts || "Không rõ vị trí"}
        </p>
      </div>
    </a>
  `;
};

export const MapView = ({ advertisements = [], hoveredId, loading = false, onMarkerClick }: MapViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  const validAds = useMemo(() => advertisements.filter((ad) => safeCoords(ad?.apartmentUu) !== null), [advertisements]);

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

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    const points: LatLngTuple[] = [];

    validAds.forEach((ad) => {
      const coords = safeCoords(ad.apartmentUu)!;
      points.push(coords);

      const isHovered = hoveredId === ad.uuid;
      const marker = L.marker(coords, {
        icon: createPriceMarkerIcon(ad.price, isHovered),
        zIndexOffset: isHovered ? 1000 : 0,
      });

      const apt = ad.apartmentUu;
      const addressParts = [apt?.ward?.fullName, apt?.province?.fullName].filter(Boolean).join(", ");

      marker.bindTooltip(addressParts || "Không rõ vị trí", {
        direction: "top",
        offset: [0, -10],
        className: "map-tooltip",
      });

      marker.bindPopup(buildPopupHtml(ad), {
        closeButton: false,
        maxWidth: 260,
      });

      marker.on("click", () => onMarkerClick?.(ad.uuid));
      marker.addTo(map);
      markersRef.current.set(ad.uuid, marker);
    });

    // Fit bounds
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  }, [validAds, hoveredId, onMarkerClick]);

  // Invalidate on resize
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

      {!loading && validAds.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/30 pointer-events-none z-[1000]">
          <p className="text-sm text-muted-foreground">Chưa có dữ liệu bản đồ</p>
        </div>
      )}
    </div>
  );
};
