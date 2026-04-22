/// <reference types="google.maps" />
import { useCallback, useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "@/lib/google-maps-loader";

export interface PlacePrediction {
  place_id: string;
  description: string;
  main_text: string;
  secondary_text: string;
}

interface PlaceDetails {
  lat: number;
  lng: number;
  address: string;
}

const DEBOUNCE_MS = 500;

export function useGooglePlaces() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);

  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const lastReqIdRef = useRef(0);

  const ensureSessionToken = useCallback(() => {
    if (!window.google?.maps?.places) return null;
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    }
    return sessionTokenRef.current;
  }, []);

  // Init SDK once
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps().then((g) => {
      if (cancelled || !g?.maps?.places) return;
      autocompleteServiceRef.current = new g.maps.places.AutocompleteService();
      // PlacesService cần 1 HTMLDivElement (hoặc Map). Dùng div ẩn.
      const host = document.createElement("div");
      placesServiceRef.current = new g.maps.places.PlacesService(host);
      ensureSessionToken();
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [ensureSessionToken]);

  const search = useCallback(
    (input: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      const trimmed = input.trim();
      if (!trimmed) {
        setPredictions([]);
        setLoading(false);
        return;
      }
      if (!autocompleteServiceRef.current) return;

      setLoading(true);
      const reqId = ++lastReqIdRef.current;

      debounceRef.current = setTimeout(() => {
        const token = ensureSessionToken();
        autocompleteServiceRef.current!.getPlacePredictions(
          {
            input: trimmed,
            componentRestrictions: { country: "vn" },
            language: "vi",
            sessionToken: token ?? undefined,
          },
          (results, status) => {
            // Bỏ qua nếu đã có request mới hơn
            if (reqId !== lastReqIdRef.current) return;
            setLoading(false);
            if (
              status !== window.google.maps.places.PlacesServiceStatus.OK ||
              !results
            ) {
              setPredictions([]);
              return;
            }
            setPredictions(
              results.map((r) => ({
                place_id: r.place_id,
                description: r.description,
                main_text: r.structured_formatting?.main_text || r.description,
                secondary_text: r.structured_formatting?.secondary_text || "",
              })),
            );
          },
        );
      }, DEBOUNCE_MS);
    },
    [ensureSessionToken],
  );

  const getDetails = useCallback(
    (placeId: string): Promise<PlaceDetails | null> => {
      return new Promise((resolve) => {
        if (!placesServiceRef.current || !window.google?.maps?.places) {
          resolve(null);
          return;
        }
        const token = ensureSessionToken();
        placesServiceRef.current.getDetails(
          {
            placeId,
            fields: ["geometry"], // tối thiểu hoá phí
            sessionToken: token ?? undefined,
          },
          (place, status) => {
            // Kết thúc phiên: tạo token mới cho lần gõ tiếp theo
            sessionTokenRef.current = null;
            if (
              status !== window.google.maps.places.PlacesServiceStatus.OK ||
              !place?.geometry?.location
            ) {
              resolve(null);
              return;
            }
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            resolve({ lat, lng, address: "" });
          },
        );
      });
    },
    [ensureSessionToken],
  );

  const clear = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setPredictions([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { ready, loading, predictions, search, getDetails, clear };
}
