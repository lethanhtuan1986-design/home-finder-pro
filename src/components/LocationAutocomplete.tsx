import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { searchNominatim, NominatimResult, nominatimResultToBounds, GeoBounds, DEFAULT_RADIUS_KM } from "@/lib/geocoding";

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (result: NominatimResult, bounds: GeoBounds) => void;
  enrichSuffix?: string;
  radiusKm?: number;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

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
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const query = enrichSuffix ? `${value} ${enrichSuffix}`.trim() : value;
      const data = await searchNominatim(query, 5);
      setResults(data);
      setIsOpen(data.length > 0);
      setLoading(false);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, enrichSuffix]);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = useCallback(
    (result: NominatimResult) => {
      const shortName = result.display_name.split(",")[0]?.trim() || result.display_name;
      onChange(shortName);
      setIsOpen(false);
      setResults([]);
      const bounds = nominatimResultToBounds(result, radiusKm);
      onSelect(result, bounds);
    },
    [onChange, onSelect, radiusKm],
  );

  const handleClear = () => {
    onChange("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className={cn(
          "w-full pl-9 pr-8 h-11 rounded-xl bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
          inputClassName,
        )}
      />
      {loading && (
        <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
      )}
      {!loading && value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={14} />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-popover border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {results.map((result, idx) => (
            <button
              key={`${result.lat}-${result.lon}-${idx}`}
              onClick={() => handleSelect(result)}
              className="w-full flex items-start gap-2.5 px-3 py-2.5 text-left hover:bg-accent transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              <MapPin size={14} className="shrink-0 mt-0.5 text-primary" />
              <span className="text-sm text-foreground leading-snug line-clamp-2">
                {result.display_name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
