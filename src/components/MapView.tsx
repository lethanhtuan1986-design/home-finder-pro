interface MapViewProps {
  hoveredId?: string | null;
  onMarkerClick?: (id: string) => void;
}

export const MapView = ({ hoveredId, onMarkerClick }: MapViewProps) => {
  return (
    <div className="relative w-full h-full bg-secondary/30 rounded-2xl overflow-hidden border border-border min-h-[400px]">
      {/* Mock map background */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Mock roads */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 130 130" preserveAspectRatio="none">
        <line x1="0" y1="50" x2="130" y2="50" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
        <line x1="65" y1="0" x2="65" y2="130" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
        <line x1="0" y1="80" x2="130" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
        <line x1="30" y1="0" x2="30" y2="130" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
      </svg>

      <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs text-muted-foreground border border-border">
        Bản đồ · TP. Hồ Chí Minh
      </div>
    </div>
  );
};
