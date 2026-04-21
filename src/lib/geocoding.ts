export interface NominatimResult {
  lat: string;
  lon: string;
  boundingbox: [string, string, string, string]; // [south, north, west, east]
  display_name: string;
  class?: string;
  type?: string;
  address?: Record<string, string>;
}

// Ưu tiên các loại kết quả mang tính "địa chỉ" cụ thể (đường, số nhà, toà nhà...)
const ADDRESS_PRIORITY: Record<string, number> = {
  highway: 0, // đường — ưu tiên cao nhất
  building: 1,
  house: 1,
  place: 2,
  amenity: 3,
  shop: 3,
  tourism: 3,
  leisure: 4,
  boundary: 5,
};

function getAddressRank(r: NominatimResult): number {
  const cls = r.class ?? "";
  // Đường (highway) luôn lên đầu
  if (cls === "highway") return -2;
  // Có số nhà — ưu tiên kế tiếp
  if (r.address?.house_number) return -1;
  return ADDRESS_PRIORITY[cls] ?? 99;
}

export interface GeoBounds {
  neLat: number;
  neLng: number;
  swLat: number;
  swLng: number;
  centerLat: number;
  centerLng: number;
}

export const RADIUS_OPTIONS = [
  { value: 1, label: '+1 km' },
  { value: 2, label: '+2 km' },
  { value: 3, label: '+3 km' },
  { value: 5, label: '+5 km' },
  { value: 10, label: '+10 km' },
  { value: 20, label: '+20 km' },
];

export const DEFAULT_RADIUS_KM = 5;

export interface UserLocation {
  lat: number;
  lng: number;
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

let cachedUserLocation: UserLocation | null = null;
let pendingLocationPromise: Promise<UserLocation | null> | null = null;

export function getUserLocation(timeoutMs: number = 5000): Promise<UserLocation | null> {
  if (cachedUserLocation) return Promise.resolve(cachedUserLocation);
  if (pendingLocationPromise) return pendingLocationPromise;
  if (typeof navigator === "undefined" || !navigator.geolocation) return Promise.resolve(null);

  pendingLocationPromise = new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), timeoutMs);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timer);
        cachedUserLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        resolve(cachedUserLocation);
      },
      () => {
        clearTimeout(timer);
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 5 * 60 * 1000 },
    );
  }).finally(() => {
    pendingLocationPromise = null;
  }) as Promise<UserLocation | null>;

  return pendingLocationPromise;
}

export async function searchNominatim(keyword: string, limit: number = 5): Promise<NominatimResult[]> {
  if (!keyword.trim()) return [];
  try {
    // Lấy nhiều hơn limit để có dư địa sắp xếp ưu tiên address & gần vị trí
    const fetchLimit = Math.max(limit * 4, 20);
    const userLoc = cachedUserLocation ?? (await getUserLocation(2500));

    let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(keyword)}&format=json&limit=${fetchLimit}&countrycodes=vn&addressdetails=1`;

    // Bias kết quả quanh vị trí user (~50km box, không bounded để vẫn nhận kết quả ngoài vùng)
    if (userLoc) {
      const delta = 0.5; // ~50km
      const left = userLoc.lng - delta;
      const right = userLoc.lng + delta;
      const top = userLoc.lat + delta;
      const bottom = userLoc.lat - delta;
      url += `&viewbox=${left},${top},${right},${bottom}&bounded=0`;
    }

    const res = await fetch(url, {
      headers: { 'Accept-Language': 'vi' },
    });
    const data: NominatimResult[] = await res.json();

    // Sắp xếp: ưu tiên loại địa chỉ (đường > số nhà > ...) rồi đến khoảng cách tới user
    const sorted = [...data].sort((a, b) => {
      const rankDiff = getAddressRank(a) - getAddressRank(b);
      if (rankDiff !== 0) return rankDiff;
      if (!userLoc) return 0;
      const da = haversineKm(userLoc.lat, userLoc.lng, Number(a.lat), Number(a.lon));
      const db = haversineKm(userLoc.lat, userLoc.lng, Number(b.lat), Number(b.lon));
      return da - db;
    });
    return sorted.slice(0, limit);
  } catch {
    return [];
  }
}

export function nominatimResultToBounds(result: NominatimResult, radiusKm: number = DEFAULT_RADIUS_KM): GeoBounds {
  const [south, north, west, east] = result.boundingbox.map(Number);
  const latBuffer = radiusKm / 111;
  const centerLat = (south + north) / 2;
  const centerLng = (west + east) / 2;
  const lngBuffer = radiusKm / (111 * Math.cos((centerLat * Math.PI) / 180));
  return {
    neLat: north + latBuffer,
    neLng: east + lngBuffer,
    swLat: south - latBuffer,
    swLng: west - lngBuffer,
    centerLat,
    centerLng,
  };
}

export async function geocodeKeyword(keyword: string, radiusKm: number = DEFAULT_RADIUS_KM): Promise<GeoBounds | null> {
  const results = await searchNominatim(keyword, 1);
  if (results.length === 0) return null;
  return nominatimResultToBounds(results[0], radiusKm);
}
