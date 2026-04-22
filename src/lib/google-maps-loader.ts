/**
 * Loader cho Google Maps JS SDK (chỉ load 1 lần, dedupe nhiều caller song song).
 * Trả về `null` nếu thiếu VITE_GOOGLE_MAPS_API_KEY → caller sẽ fallback sang Nominatim.
 */

declare global {
  interface Window {
    google?: typeof google;
    __googleMapsCallback__?: () => void;
  }
}

let loadPromise: Promise<typeof google | null> | null = null;
let warnedMissingKey = false;

export function getGoogleMapsKey(): string | undefined {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() || undefined;
}

export function loadGoogleMaps(): Promise<typeof google | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.google?.maps?.places) return Promise.resolve(window.google);
  if (loadPromise) return loadPromise;

  const key = getGoogleMapsKey();
  if (!key) {
    if (!warnedMissingKey) {
      warnedMissingKey = true;
      // eslint-disable-next-line no-console
      console.warn(
        "[google-maps] Thiếu VITE_GOOGLE_MAPS_API_KEY — fallback Nominatim cho autocomplete.",
      );
    }
    return Promise.resolve(null);
  }

  loadPromise = new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-google-maps-loader="1"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google ?? null));
      existing.addEventListener("error", () => resolve(null));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      key,
    )}&libraries=places&language=vi&region=VN&loading=async`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsLoader = "1";
    script.onload = () => resolve(window.google ?? null);
    script.onerror = () => {
      // eslint-disable-next-line no-console
      console.error("[google-maps] Lỗi tải Google Maps SDK.");
      resolve(null);
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
