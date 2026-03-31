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
}

export async function geocodeKeyword(keyword: string): Promise<GeoBounds | null> {
  if (!keyword.trim()) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(keyword)}&format=json&limit=1&countrycodes=vn`;
    const res = await fetch(url, {
      headers: { 'Accept-Language': 'vi' },
    });
    const data: NominatimResult[] = await res.json();
    if (!data || data.length === 0) return null;
    const [south, north, west, east] = data[0].boundingbox.map(Number);
    return {
      neLat: north,
      neLng: east,
      swLat: south,
      swLng: west,
    };
  } catch {
    return null;
  }
}
