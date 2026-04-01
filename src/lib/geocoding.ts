export interface NominatimResult {
  lat: string;
  lon: string;
  boundingbox: [string, string, string, string]; // [south, north, west, east]
  display_name: string;
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
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(keyword)}&format=json&limit=${limit}&countrycodes=vn`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'vi' },
    });
    return await res.json();
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
