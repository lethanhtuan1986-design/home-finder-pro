import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  searchNominatim,
  NominatimResult,
  nominatimResultToBounds,
  latLngToBounds,
  GeoBounds,
  DEFAULT_RADIUS_KM,
} from "@/lib/geocoding";
import { useGooglePlaces, PlacePrediction } from "@/hooks/useGooglePlaces";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (
    result: NominatimResult | PlacePrediction,
    bounds: GeoBounds,
  ) => void;
  enrichSuffix?: string;
  radiusKm?: number;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

interface DropdownItem {
  id: string;
  main: string;
  secondary: string;
  source: "google" | "nominatim";
  raw: PlacePrediction | NominatimResult;
}

const NOMINATIM_DEBOUNCE_MS = 500;

export const LocationAutocomplete = ({
  value,
  onChange,
  onSelect,
  enrichSuffix = "",
  radiusKm = DEFAULT_RADIUS_KM,
  placeholder = "Tìm kiếm địa điểm...",
  className,
  inputClassName,
}: LocationAutocompleteProps) => {
  const google = useGooglePlaces();
  const [items, setItems] = useState<DropdownItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [nominatimLoading, setNominatimLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const lastQueryRef = useRef<string>("");

  const useGoogle = google.ready;
  const loading = useGoogle ? google.loading : nominatimLoading;

  // ---- Google: map predictions → items
  useEffect(() => {
    if (!useGoogle) return;
    const mapped: DropdownItem[] = google.predictions.map((p) => ({
      id: p.place_id,
      main: p.main_text,
      secondary: p.secondary_text,
      source: "google",
      raw: p,
    }));
    setItems(mapped);
    if (mapped.length > 0 && lastQueryRef.current.length > 0) setIsOpen(true);
  }, [google.predictions, useGoogle]);

  // ---- Trigger search (Google or Nominatim fallback)
  useEffect(() => {
    lastQueryRef.current = value;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setItems([]);
      setIsOpen(false);
      setNominatimLoading(false);
      if (useGoogle) google.clear();
      return;
    }

    if (useGoogle) {
      // Hook tự debounce 500ms
      google.search(value);
      return;
    }

    // Nominatim fallback
    debounceRef.current = setTimeout(async () => {
      setNominatimLoading(true);
      const query = enrichSuffix ? `${value} ${enrichSuffix}`.trim() : value;
      const data = await searchNominatim(query, 5);
      const mapped: DropdownItem[] = data.map((r, idx) => {
        const parts = r.display_name.split(",").map((s) => s.trim());
        return {
          id: `${r.lat}-${r.lon}-${idx}`,
          main: parts[0] || r.display_name,
          secondary: parts.slice(1).join(", "),
          source: "nominatim",
          raw: r,
        };
      });
      setItems(mapped);
      setIsOpen(mapped.length > 0);
      setNominatimLoading(false);
    }, NOMINATIM_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, enrichSuffix, useGoogle]);

  // ---- Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = useCallback(
    async (item: DropdownItem) => {
      onChange(item.main);
      setIsOpen(false);

      if (item.source === "google") {
        const pred = item.raw as PlacePrediction;
        setDetailsLoading(true);
        const details = await google.getDetails(pred.place_id);
        setDetailsLoading(false);
        if (!details) return;
        const bounds = latLngToBounds(details.lat, details.lng, radiusKm);
        onSelect(pred, bounds);
      } else {
        const r = item.raw as NominatimResult;
        const bounds = nominatimResultToBounds(r, radiusKm);
        onSelect(r, bounds);
      }
      setItems([]);
    },
    [google, onChange, onSelect, radiusKm],
  );

  const handleClear = () => {
    onChange("");
    setItems([]);
    setIsOpen(false);
    if (useGoogle) google.clear();
  };

  const showSpinner = loading || detailsLoading;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => items.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className={cn(
          "w-full pl-9 pr-9 h-11 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow",
          inputClassName,
        )}
      />
      {showSpinner && (
        <Loader2
          size={14}
          className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
        />
      )}
      {!showSpinner && value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Xoá"
        >
          <X size={14} />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-popover border border-border rounded-2xl shadow-xl max-h-80 overflow-y-auto animate-in fade-in-0 slide-in-from-top-1">
          {items.length > 0 ? (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-accent focus:bg-accent focus:outline-none transition-colors first:rounded-t-2xl last:rounded-b-2xl"
              >
                <span className="shrink-0 mt-0.5 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <MapPin size={14} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground leading-snug truncate">
                    {item.main}
                  </span>
                  {item.secondary && (
                    <span className="block text-xs text-muted-foreground leading-snug truncate mt-0.5">
                      {item.secondary}
                    </span>
                  )}
                </span>
              </button>
            ))
          ) : (
            !loading &&
            value.trim() && (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                Không tìm thấy địa điểm
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
