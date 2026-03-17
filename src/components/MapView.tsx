import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatVNPrice, getImageUrl } from '@/services/index';
import { Link } from 'react-router-dom';

interface MapViewProps {
  advertisements?: any[];
  hoveredId?: string | null;
  onMarkerClick?: (id: string) => void;
}

// Custom marker icon using primary color
const createMarkerIcon = (isHovered: boolean) => {
  const color = isHovered ? '#0f5132' : '#0d9668';
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="
      background: ${color};
      color: white;
      border-radius: 8px;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 700;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      transform: ${isHovered ? 'scale(1.15)' : 'scale(1)'};
      transition: transform 0.2s ease;
      border: 2px solid white;
    "></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
};

const createPriceMarkerIcon = (price: number, isHovered: boolean) => {
  const color = isHovered ? '#0f5132' : '#0d9668';
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

// Component to fit bounds when markers change
const FitBounds = ({ positions }: { positions: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(([lat, lng]) => [lat, lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [positions, map]);
  return null;
};

export const MapView = ({ advertisements = [], hoveredId, onMarkerClick }: MapViewProps) => {
  const validAds = advertisements.filter(
    (ad) => ad?.apartmentUu?.latitude != null && ad?.apartmentUu?.longitude != null
  );

  const positions: [number, number][] = validAds.map((ad) => [
    ad.apartmentUu.latitude,
    ad.apartmentUu.longitude,
  ]);

  // Default center: Ho Chi Minh City
  const defaultCenter: [number, number] = [10.790, 106.710];
  const center = positions.length > 0
    ? [
        positions.reduce((s, p) => s + p[0], 0) / positions.length,
        positions.reduce((s, p) => s + p[1], 0) / positions.length,
      ] as [number, number]
    : defaultCenter;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border min-h-[400px] leaflet-container-wrapper">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        className="w-full h-full min-h-[400px] z-0"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.length > 0 && <FitBounds positions={positions} />}
        {validAds.map((ad) => {
          const apt = ad.apartmentUu;
          const isHovered = hoveredId === ad.uuid;
          const imageUrl = ad.images?.[0] ? getImageUrl(ad.images[0]) : '/placeholder.svg';

          return (
            <Marker
              key={ad.uuid}
              position={[apt.latitude, apt.longitude]}
              icon={createPriceMarkerIcon(ad.price, isHovered)}
              zIndexOffset={isHovered ? 1000 : 0}
              eventHandlers={{
                click: () => onMarkerClick?.(ad.uuid),
              }}
            >
              <Popup className="leaflet-popup-custom" closeButton={false}>
                <Link to={`/property/${ad.uuid}`} className="block w-[220px] no-underline">
                  <img
                    src={imageUrl}
                    alt={ad.title || ''}
                    className="w-full h-[120px] object-cover rounded-t-lg"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
                  />
                  <div className="p-2">
                    <p className="text-sm font-semibold text-foreground truncate">{ad.title}</p>
                    <p className="text-primary font-bold text-sm">{formatVNPrice(ad.price)}/tháng</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {apt?.ward?.fullName || ''}{apt?.province?.fullName ? `, ${apt.province.fullName}` : ''}
                    </p>
                  </div>
                </Link>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {validAds.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/30 pointer-events-none z-10">
          <p className="text-sm text-muted-foreground">Chưa có dữ liệu bản đồ</p>
        </div>
      )}
    </div>
  );
};
