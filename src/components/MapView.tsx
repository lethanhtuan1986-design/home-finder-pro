import { useEffect, useRef, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatVNPrice, getImageUrl } from '@/services/index';

interface MapViewProps {
  advertisements?: any[];
  hoveredId?: string | null;
  onMarkerClick?: (id: string) => void;
}

const createPriceMarkerIcon = (price: number, isHovered: boolean) => {
  const color = isHovered ? 'hsl(162, 80%, 24%)' : 'hsl(160, 84%, 30%)';
  const priceText = (price / 1000000).toFixed(1).replace('.0', '') + 'tr';
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="
      background: ${color};
      color: white;
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      transform: ${isHovered ? 'scale(1.15)' : 'scale(1)'};
      transition: transform 0.2s ease;
      border: 2px solid white;
      cursor: pointer;
    ">${priceText}</div>`,
    iconSize: [0, 0],
    iconAnchor: [20, 15],
  });
};

const createPopupContent = (ad: any): string => {
  const apt = ad.apartmentUu;
  const imageUrl = ad.images?.[0] ? getImageUrl(ad.images[0]) : '/placeholder.svg';
  const location = apt?.ward?.fullName || apt?.district?.fullName || '';
  const province = apt?.province?.fullName ? `, ${apt.province.fullName}` : '';

  return `
    <a href="/property/${ad.uuid}" style="display:block;width:220px;text-decoration:none;color:inherit;">
      <img
        src="${imageUrl}"
        alt="${ad.title || ''}"
        style="width:100%;height:120px;object-fit:cover;border-radius:8px 8px 0 0;"
        onerror="this.src='/placeholder.svg'"
      />
      <div style="padding:8px;">
        <p style="font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:0 0 4px;">${ad.title || ''}</p>
        <p style="font-size:13px;font-weight:700;color:hsl(160,84%,30%);margin:0 0 2px;">${formatVNPrice(ad.price)}/tháng</p>
        ${apt?.apartmentSize ? `<p style="font-size:11px;color:#888;margin:0 0 2px;">${apt.apartmentSize}m²</p>` : ''}
        <p style="font-size:11px;color:#888;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:0;">${location}${province}</p>
      </div>
    </a>
  `;
};

export const MapView = ({ advertisements = [], hoveredId, onMarkerClick }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  const validAds = useMemo(
    () => advertisements.filter((ad) => ad?.apartmentUu?.latitude != null && ad?.apartmentUu?.longitude != null),
    [advertisements]
  );

  const positions = useMemo<[number, number][]>(
    () => validAds.map((ad) => [ad.apartmentUu.latitude, ad.apartmentUu.longitude]),
    [validAds]
  );

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [10.79, 106.71],
      zoom: 13,
      scrollWheelZoom: true,
      zoomControl: false,
    });

    // Add zoom control at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Apply dark mode filter
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      const tiles = containerRef.current?.querySelector('.leaflet-tile-pane') as HTMLElement | null;
      if (tiles) {
        tiles.style.filter = isDark
          ? 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)'
          : 'none';
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Initial check
    const isDark = document.documentElement.classList.contains('dark');
    const checkTiles = () => {
      const tiles = containerRef.current?.querySelector('.leaflet-tile-pane') as HTMLElement | null;
      if (tiles) {
        tiles.style.filter = isDark
          ? 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)'
          : 'none';
      } else {
        requestAnimationFrame(checkTiles);
      }
    };
    checkTiles();

    return () => observer.disconnect();
  }, []);

  // Sync markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Add new markers
    validAds.forEach((ad) => {
      const apt = ad.apartmentUu;
      const isHovered = hoveredId === ad.uuid;
      const marker = L.marker([apt.latitude, apt.longitude], {
        icon: createPriceMarkerIcon(ad.price, isHovered),
        zIndexOffset: isHovered ? 1000 : 0,
      });

      marker.bindPopup(createPopupContent(ad), { closeButton: false, className: 'leaflet-popup-custom' });
      marker.on('click', () => onMarkerClick?.(ad.uuid));
      marker.addTo(map);
      markersRef.current.set(ad.uuid, marker);
    });

    // Fit bounds
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(([lat, lng]) => [lat, lng] as L.LatLngTuple));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [validAds, hoveredId, onMarkerClick, positions]);

  // Update hovered marker icon without full re-render
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const ad = validAds.find((a) => a.uuid === id);
      if (ad) {
        const isHovered = hoveredId === id;
        marker.setIcon(createPriceMarkerIcon(ad.price, isHovered));
        marker.setZIndexOffset(isHovered ? 1000 : 0);
      }
    });
  }, [hoveredId, validAds]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border min-h-[400px]">
      <div ref={containerRef} className="w-full h-full min-h-[400px]" style={{ zIndex: 0 }} />
      {validAds.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/30 pointer-events-none z-10">
          <p className="text-sm text-muted-foreground">Chưa có dữ liệu bản đồ</p>
        </div>
      )}
    </div>
  );
};
