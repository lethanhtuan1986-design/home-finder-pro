import { useEffect, useMemo, Fragment } from 'react';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import { formatVNPrice, getImageUrl } from '@/services/index';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// Default center: Ho Chi Minh City
const DEFAULT_CENTER: LatLngTuple = [10.79, 106.71];
const DEFAULT_ZOOM = 13;

interface MapViewProps {
  advertisements?: any[];
  hoveredId?: string | null;
  loading?: boolean;
  onMarkerClick?: (id: string) => void;
}

// ==================== Coordinate Helper ====================

/** Safely extract [lat, lng] from apartment data, auto-swapping if lat > 90 */
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

// ==================== Sub-components ====================

function InvalidateMapSize() {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

function FitBounds({ points }: { points: LatLngTuple[] }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      return;
    }

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  }, [points, map]);

  return null;
}

function MapMarkers({ ads, hoveredId, onMarkerClick }: {
  ads: any[];
  hoveredId?: string | null;
  onMarkerClick?: (id: string) => void;
}) {
  return (
    <Fragment>
      {ads.map((ad) => {
        const coords = safeCoords(ad.apartmentUu);
        if (!coords) return null;

        const apt = ad.apartmentUu;
        const isHovered = hoveredId === ad.uuid;
        const imageUrl = ad.images?.[0] ? getImageUrl(ad.images[0]) : '/placeholder.svg';
        const addressParts = [apt?.ward?.fullName, apt?.province?.fullName].filter(Boolean).join(', ');

        return (
          <Marker
            key={ad.uuid}
            position={coords}
            icon={createPriceMarkerIcon(ad.price, isHovered)}
            zIndexOffset={isHovered ? 1000 : 0}
            eventHandlers={{
              click: () => onMarkerClick?.(ad.uuid),
            }}
          >
            <Tooltip permanent={false} direction="top" offset={[0, -10]}>
              <div className="text-xs font-medium">
                {addressParts || 'Không rõ vị trí'}
              </div>
            </Tooltip>
            <Popup closeButton={false} maxHeight={300}>
              <Link to={`/property/${ad.uuid}`} className="block w-[240px] no-underline text-inherit">
                <div className="relative w-full h-[130px] overflow-hidden rounded-t-lg">
                  <img
                    src={imageUrl}
                    alt={ad.title || ''}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                  />
                </div>
                <div className="p-2.5">
                  <p className="text-[13px] font-semibold truncate mb-1.5 text-foreground">
                    {ad.title || 'Không có tiêu đề'}
                  </p>
                  <p className="text-sm font-bold text-primary mb-1">
                    {formatVNPrice(ad.price)}/tháng
                  </p>
                  {ad.deposit > 0 && (
                    <p className="text-[11px] text-muted-foreground mb-1">
                      Cọc: {formatVNPrice(ad.deposit)}
                    </p>
                  )}
                  <div className="flex gap-2 items-center mb-1">
                    {apt?.apartmentSize > 0 && (
                      <span className="text-[11px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                        {apt.apartmentSize}m²
                      </span>
                    )}
                    {apt?.roomCount > 0 && (
                      <span className="text-[11px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
                        {apt.roomCount} phòng
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    📍 {addressParts || 'Không rõ vị trí'}
                  </p>
                </div>
              </Link>
            </Popup>
          </Marker>
        );
      })}
    </Fragment>
  );
}

// ==================== Main Component ====================

export const MapView = ({ advertisements = [], hoveredId, loading = false, onMarkerClick }: MapViewProps) => {
  const validAds = useMemo(
    () => advertisements.filter((ad) => safeCoords(ad?.apartmentUu) !== null),
    [advertisements],
  );

  const positions = useMemo<LatLngTuple[]>(
    () => validAds.map((ad) => safeCoords(ad.apartmentUu)!),
    [validAds],
  );

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border min-h-[400px]">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        zoomControl={false}
        style={{ width: '100%', height: '100%', minHeight: 400, zIndex: 0 }}
      >
        <InvalidateMapSize />
        <TileLayer
          attribution="Google"
          url="https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          maxZoom={20}
        />
        <FitBounds points={positions} />
        <MapMarkers ads={validAds} hoveredId={hoveredId} onMarkerClick={onMarkerClick} />
      </MapContainer>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm z-[1000] pointer-events-none">
          <div className="flex items-center gap-2 bg-card px-4 py-2.5 rounded-xl shadow-lg border border-border">
            <Loader2 size={18} className="animate-spin text-primary" />
            <span className="text-sm font-medium text-foreground">Đang tải bản đồ...</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && validAds.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/30 pointer-events-none z-[1000]">
          <p className="text-sm text-muted-foreground">Chưa có dữ liệu bản đồ</p>
        </div>
      )}
    </div>
  );
};
