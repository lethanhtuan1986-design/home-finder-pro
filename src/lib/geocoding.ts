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

export async function searchNominatim(keyword: string, limit: number = 5): Promise<NominatimResult[]> {
  if (!keyword.trim()) return [];
  try {
    // Lấy nhiều hơn limit để có dư địa sắp xếp ưu tiên address
    const fetchLimit = Math.max(limit * 2, 10);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(keyword)}&format=json&limit=${fetchLimit}&countrycodes=vn&addressdetails=1`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'vi' },
    });
    const data: NominatimResult[] = await res.json();
    // Ưu tiên kết quả dạng address (số nhà, đường, building, place...)
    const sorted = [...data].sort((a, b) => getAddressRank(a) - getAddressRank(b));
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
