import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatVNPrice, getImageUrl } from '@/services/index';
import { Loader2 } from 'lucide-react';

// Default center: Ho Chi Minh City
const DEFAULT_CENTER: L.LatLngTuple = [10.79, 106.71];
const DEFAULT_ZOOM = 13;

interface MapViewProps {
  advertisements?: any[];
  hoveredId?: string | null;
  loading?: boolean;
  onMarkerClick?: (id: string) => void;
}

// ==================== Marker Icon ====================

const createPriceMarkerIcon = (price: number, isHovered: boolean) => {
  const priceText = (price / 1000000).toFixed(1).replace('.0', '') + 'tr';
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="
      background: ${isHovered ? 'hsl(var(--xanh-700))' : 'hsl(var(--primary))'};
      color: white;
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      transform: ${isHovered ? 'scale(1.18)' : 'scale(1)'};
      transition: transform 0.2s ease, background 0.2s ease;
      border: 2px solid white;
      cursor: pointer;
    ">${priceText}</div>`,
    iconSize: [0, 0],
    iconAnchor: [20, 15],
  });
};

// ==================== Popup Content ====================

const createPopupContent = (ad: any): string => {
  const apt = ad.apartmentUu;
  const imageUrl = ad.images?.[0] ? getImageUrl(ad.images[0]) : '/placeholder.svg';
  const location = apt?.ward?.fullName || '';
  const province = apt?.province?.fullName || '';
  const addressParts = [location, province].filter(Boolean).join(', ');
  const deposit = ad.deposit ? `Cọc: ${formatVNPrice(ad.deposit)}` : '';

  return `
    <div class="leaflet-popup-card">
      <a href="/property/${ad.uuid}" style="display:block;width:240px;text-decoration:none;color:inherit;">
        <div style="position:relative;width:100%;height:130px;overflow:hidden;border-radius:10px 10px 0 0;">
          <img
            src="${imageUrl}"
            alt="${ad.title || ''}"
            style="width:100%;height:100%;object-fit:cover;"
            onerror="this.src='/placeholder.svg'"
          />
        </div>
        <div style="padding:10px 12px;">
          <p style="font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:0 0 6px;color:var(--foreground,#1a1a1a);">
            ${ad.title || 'Không có tiêu đề'}
          </p>
          <p style="font-size:14px;font-weight:700;color:hsl(160,84%,30%);margin:0 0 4px;">
            ${formatVNPrice(ad.price)}/tháng
          </p>
          ${deposit ? `<p style="font-size:11px;color:#666;margin:0 0 4px;">${deposit}</p>` : ''}
          <div style="display:flex;gap:8px;align-items:center;margin-bottom:4px;">
            ${apt?.apartmentSize ? `<span style="font-size:11px;color:#888;background:#f5f5f5;padding:2px 6px;border-radius:4px;">${apt.apartmentSize}m²</span>` : ''}
            ${apt?.roomCount ? `<span style="font-size:11px;color:#888;background:#f5f5f5;padding:2px 6px;border-radius:4px;">${apt.roomCount} phòng</span>` : ''}
          </div>
          <p style="font-size:11px;color:#999;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:0;">
            📍 ${addressParts || 'Không rõ vị trí'}
          </p>
        </div>
      </a>
    </div>
  `;
};

// ==================== Component ====================

export const MapView = ({ advertisements = [], hoveredId, loading = false, onMarkerClick }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const prevAdsRef = useRef<string>('');

  // Filter valid ads with safe coordinate checks
  const validAds = useMemo(
    () =>
      advertisements.filter((ad) => {
        const lat = ad?.apartmentUu?.latitude;
        const lng = ad?.apartmentUu?.longitude;
        return lat != null && lng != null && isFinite(lat) && isFinite(lng) && !(lat === 0 && lng === 0);
      }),
    [advertisements],
  );

  const positions = useMemo<L.LatLngTuple[]>(
    () => validAds.map((ad) => [ad.apartmentUu.latitude, ad.apartmentUu.longitude] as L.LatLngTuple),
    [validAds],
  );

  // ---- Initialize map (once) ----
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ---- Dark mode ----
  useEffect(() => {
    if (!containerRef.current) return;

    const applyDarkFilter = () => {
      const isDark = document.documentElement.classList.contains('dark');
      const tiles = containerRef.current?.querySelector('.leaflet-tile-pane') as HTMLElement | null;
      if (tiles) {
        tiles.style.filter = isDark
          ? 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)'
          : 'none';
      }
    };

    const observer = new MutationObserver(applyDarkFilter);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Wait for tiles to render then apply
    const tryApply = () => {
      if (containerRef.current?.querySelector('.leaflet-tile-pane')) {
        applyDarkFilter();
      } else {
        requestAnimationFrame(tryApply);
      }
    };
    tryApply();

    return () => observer.disconnect();
  }, []);

  // ---- Sync markers (only when ad list actually changes) ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Dedupe: skip if same ad set
    const adsKey = validAds.map((a) => a.uuid).join(',');
    if (adsKey === prevAdsRef.current) return;
    prevAdsRef.current = adsKey;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    // Add markers
    validAds.forEach((ad) => {
      const apt = ad.apartmentUu;
      const marker = L.marker([apt.latitude, apt.longitude], {
        icon: createPriceMarkerIcon(ad.price, false),
      });

      marker.bindPopup(createPopupContent(ad), {
        closeButton: false,
        className: 'leaflet-popup-custom',
        maxHeight: 300,
      });
      marker.on('click', () => onMarkerClick?.(ad.uuid));
      marker.addTo(map);
      markersRef.current.set(ad.uuid, marker);
    });

    // Fit bounds or reset to default
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    } else {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  }, [validAds, positions, onMarkerClick]);

  // ---- Hover highlight (cheap icon swap, no marker recreation) ----
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const ad = validAds.find((a) => a.uuid === id);
      if (!ad) return;
      const isHovered = hoveredId === id;
      marker.setIcon(createPriceMarkerIcon(ad.price, isHovered));
      marker.setZIndexOffset(isHovered ? 1000 : 0);
      if (isHovered) {
        marker.openPopup();
      }
    });
  }, [hoveredId, validAds]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border min-h-[400px]">
      <div ref={containerRef} className="w-full h-full min-h-[400px]" style={{ zIndex: 0 }} />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-20 pointer-events-none">
          <div className="flex items-center gap-2 bg-card px-4 py-2.5 rounded-xl shadow-lg border border-border">
            <Loader2 size={18} className="animate-spin text-primary" />
            <span className="text-sm font-medium text-foreground">Đang tải bản đồ...</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && validAds.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/30 pointer-events-none z-10">
          <p className="text-sm text-muted-foreground">Chưa có dữ liệu bản đồ</p>
        </div>
      )}
    </div>
  );
};
