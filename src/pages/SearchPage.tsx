import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { AdvertisementCard } from "@/components/AdvertisementCard";
import { Footer } from "@/components/Footer";
import { FloatingCallButton } from "@/components/FloatingCallButton";
import { filterPrices, filterApartmentSizes } from "@/lib/filter-options";
import advertisementService, {
  GetAdvertisementsForMapRequest,
  AdvertisementData,
  MapLocationGroup,
} from "@/services/advertisement.service";
import provinceService, { ProvinceItem } from "@/services/province.service";
import apartmentTypeService, { ApartmentTypeItem } from "@/services/apartmentType.service";
import { httpRequest } from "@/services/index";
import { useTranslation } from "react-i18next";
import { Search, Map as MapIcon, List, Loader2, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapView } from "@/components/MapView";
import { geocodeKeyword, GeoBounds } from "@/lib/geocoding";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PAGE_SIZE = 20;

const SORT_OPTIONS = [
  { value: "0", label: "Mới nhất" },
  { value: "1", label: "Giá thấp → cao" },
  { value: "2", label: "Giá cao → thấp" },
  { value: "3", label: "Xem nhiều nhất" },
  { value: "4", label: "Đánh giá cao nhất" },
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const listRef = useRef<HTMLDivElement>(null);

  // View mode: list or map
  const [viewMode, setViewMode] = useState<"list" | "map">(
    searchParams.get("view") === "map" ? "map" : "list"
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Map bounding box (only used when in map mode and user pans)
  const [mapBounds, setMapBounds] = useState<{
    neLat: number; neLng: number; swLat: number; swLng: number;
  } | null>(null);

  // Filter states from URL
  const [provinceId, setProvinceId] = useState(searchParams.get("provinceId") || "");
  const [wardId, setWardId] = useState(searchParams.get("wardId") || "");
  const [apartmentTypeUuid, setApartmentTypeUuid] = useState(searchParams.get("apartmentTypeUuid") || "");
  const [priceFrom, setPriceFrom] = useState(searchParams.get("priceFrom") || "");
  const [priceTo, setPriceTo] = useState(searchParams.get("priceTo") || "");
  const [apartmentSizeFrom, setApartmentSizeFrom] = useState(searchParams.get("apartmentSizeFrom") || "");
  const [apartmentSizeTo, setApartmentSizeTo] = useState(searchParams.get("apartmentSizeTo") || "");
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  const [typeOrder, setTypeOrder] = useState(searchParams.get("typeOrder") || "0");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Mobile map: toggle list/map
  const [mobileShowList, setMobileShowList] = useState(false);

  // Debounce keyword
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  const selectedPriceUuid =
    filterPrices.find((fp) => String(fp.value || "") === priceFrom && String(fp.valueTo || "") === priceTo)?.uuid || "";
  const selectedSizeUuid =
    filterApartmentSizes.find(
      (fs) => String(fs.value || "") === apartmentSizeFrom && String(fs.valueTo || "") === apartmentSizeTo,
    )?.uuid || "";

  // Dropdown data
  const { data: provinces = [] } = useQuery<ProvinceItem[]>({
    queryKey: ["dropdown-province"],
    queryFn: () => httpRequest({ isCatalog: true, http: provinceService.listProvince({ keyword: "" }) }),
  });

  const { data: wards = [], isLoading: wardsLoading } = useQuery<
    { code: string; fullName: string; fullNameEn: string }[]
  >({
    queryKey: ["dropdown-ward", provinceId],
    queryFn: () => httpRequest({ isCatalog: true, http: provinceService.listWard({ keyword: "", provinceCode: provinceId }) }),
    enabled: !!provinceId,
  });

  const { data: apartmentTypes = [] } = useQuery<ApartmentTypeItem[]>({
    queryKey: ["dropdown-apartment-type"],
    queryFn: () =>
      httpRequest({
        isCatalog: true,
        http: apartmentTypeService.listApartmentType({ isPaging: 0, typeFinding: 0, page: 1, pageSize: 100, keyword: "", status: 1 }),
      }),
  });

  // Geocode keyword for bounding box (used in list mode or initial map)
  const { data: geoBounds } = useQuery<GeoBounds | null>({
    queryKey: ["geocode", debouncedKeyword],
    queryFn: () => geocodeKeyword(debouncedKeyword),
    enabled: !!debouncedKeyword,
    staleTime: 1000 * 60 * 10,
  });

  // Build single shared request
  const buildRequest = useCallback((): GetAdvertisementsForMapRequest => {
    const req: GetAdvertisementsForMapRequest = {
      isPaging: 1,
      page: 1,
      pageSize: PAGE_SIZE,
      isHot: 0,
      typeOrder: Number(typeOrder),
    };
    if (debouncedKeyword) req.keyword = debouncedKeyword;
    if (provinceId) req.provinceId = provinceId;
    if (wardId) req.wardId = wardId;
    if (apartmentTypeUuid) req.apartmentTypeUuid = apartmentTypeUuid;
    if (priceFrom) req.priceFrom = Number(priceFrom);
    if (priceTo) req.priceTo = Number(priceTo);
    if (apartmentSizeFrom) req.apartmentSizeFrom = Number(apartmentSizeFrom);
    if (apartmentSizeTo) req.apartmentSizeTo = Number(apartmentSizeTo);

    // In map mode, use map bounds from pan; otherwise use geocoded bounds
    if (viewMode === "map" && mapBounds) {
      req.neLat = mapBounds.neLat;
      req.neLng = mapBounds.neLng;
      req.swLat = mapBounds.swLat;
      req.swLng = mapBounds.swLng;
    } else if (geoBounds) {
      req.neLat = geoBounds.neLat;
      req.neLng = geoBounds.neLng;
      req.swLat = geoBounds.swLat;
      req.swLng = geoBounds.swLng;
    }
    return req;
  }, [debouncedKeyword, provinceId, wardId, apartmentTypeUuid, priceFrom, priceTo, apartmentSizeFrom, apartmentSizeTo, typeOrder, viewMode, mapBounds, geoBounds]);

  // Single shared API call
  const {
    data: apiData,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: [
      "search-advertisements",
      debouncedKeyword,
      provinceId,
      wardId,
      apartmentTypeUuid,
      priceFrom,
      priceTo,
      apartmentSizeFrom,
      apartmentSizeTo,
      typeOrder,
      viewMode === "map" ? mapBounds?.neLat : geoBounds?.neLat,
      viewMode === "map" ? mapBounds?.swLat : geoBounds?.swLat,
      viewMode,
    ],
    queryFn: () => httpRequest({ http: advertisementService.getForMap(buildRequest()) }),
  });

  // Parse response - API returns { items: MapLocationGroup[], pagination }
  const mapLocations = useMemo<MapLocationGroup[]>(() => {
    return (apiData as any)?.items || [];
  }, [apiData]);

  const advertisements = useMemo<AdvertisementData[]>(() => {
    return mapLocations.flatMap((loc) => loc.ads || []);
  }, [mapLocations]);

  const totalCount = advertisements.length;
  const error = queryError ? t("search.serverError") : null;

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedKeyword) params.set("q", debouncedKeyword);
    if (provinceId) params.set("provinceId", provinceId);
    if (wardId) params.set("wardId", wardId);
    if (apartmentTypeUuid) params.set("apartmentTypeUuid", apartmentTypeUuid);
    if (priceFrom) params.set("priceFrom", priceFrom);
    if (priceTo) params.set("priceTo", priceTo);
    if (apartmentSizeFrom) params.set("apartmentSizeFrom", apartmentSizeFrom);
    if (apartmentSizeTo) params.set("apartmentSizeTo", apartmentSizeTo);
    if (typeOrder !== "0") params.set("typeOrder", typeOrder);
    if (viewMode === "map") params.set("view", "map");
    setSearchParams(params, { replace: true });
  }, [debouncedKeyword, provinceId, wardId, apartmentTypeUuid, priceFrom, priceTo, apartmentSizeFrom, apartmentSizeTo, typeOrder, viewMode, setSearchParams]);

  const handlePriceSelect = (uuid: string) => {
    if (uuid === "__all__" || uuid === selectedPriceUuid) {
      setPriceFrom(""); setPriceTo("");
    } else {
      const fp = filterPrices.find((p) => p.uuid === uuid);
      if (fp) { setPriceFrom(fp.value ? String(fp.value) : ""); setPriceTo(fp.valueTo ? String(fp.valueTo) : ""); }
    }
  };

  const handleSizeSelect = (uuid: string) => {
    if (uuid === "__all__" || uuid === selectedSizeUuid) {
      setApartmentSizeFrom(""); setApartmentSizeTo("");
    } else {
      const fs = filterApartmentSizes.find((s) => s.uuid === uuid);
      if (fs) { setApartmentSizeFrom(fs.value ? String(fs.value) : ""); setApartmentSizeTo(fs.valueTo ? String(fs.valueTo) : ""); }
    }
  };

  const handleBoundsChange = useCallback((b: { neLat: number; neLng: number; swLat: number; swLng: number }) => {
    setMapBounds(b);
  }, []);

  const toggleView = () => {
    const next = viewMode === "list" ? "map" : "list";
    setViewMode(next);
    if (next === "list") setMapBounds(null);
  };

  const activeFilterCount = [apartmentTypeUuid, selectedPriceUuid, selectedSizeUuid, provinceId, wardId].filter(Boolean).length;

  // ====== LIST VIEW ======
  const renderListView = () => (
    <div className="flex-1">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex-1 min-w-0" ref={listRef}>
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
              {error}
            </div>
          )}

          {loading && advertisements.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border">
                  <Skeleton className="aspect-[3/2] w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {advertisements.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {advertisements.map((ad, i) => (
                <div key={ad.uuid}>
                  <AdvertisementCard data={ad} index={i} />
                </div>
              ))}
            </div>
          )}

          {!loading && advertisements.length === 0 && (
            <EmptyState
              icon={Search}
              title={t("search.noResult")}
              description={t("search.noResultHint")}
              actionLabel={t("nav.searchNow")}
              actionTo="/search"
            />
          )}
        </div>
      </div>
      <FloatingCallButton />
      <Footer />
    </div>
  );

  // ====== MAP VIEW ======
  const renderMapView = () => (
    <div className="flex-1 flex overflow-hidden">
      {/* Left: Room list sidebar */}
      <div
        className={cn(
          "flex flex-col border-r border-border bg-card",
          isMobile
            ? "w-full absolute inset-0 top-16 z-30"
            : "w-[380px] shrink-0",
        )}
        style={isMobile ? { display: !mobileShowList ? "none" : "flex" } : undefined}
      >
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {loading && advertisements.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          )}
          {advertisements.map((ad, i) => (
            <div
              key={ad.uuid}
              onMouseEnter={() => setHoveredId(ad.uuid)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <AdvertisementCard data={ad} index={i} />
            </div>
          ))}
          {!loading && advertisements.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search size={32} className="text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">{t("search.noResult")}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("search.noResultMapHint")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Map */}
      <div className="flex-1 relative">
        <MapView
          locations={mapLocations}
          hoveredId={hoveredId}
          loading={loading && mapLocations.length === 0}
          onMarkerClick={(id) => navigate(`/advertisement/${id}`)}
          onBoundsChange={handleBoundsChange}
        />

        {/* Mobile: toggle list button */}
        {isMobile && (
          <button
            onClick={() => setMobileShowList(!mobileShowList)}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-primary text-primary-foreground px-4 py-2.5 rounded-full shadow-lg text-sm font-medium"
          >
            {mobileShowList ? t("search.showMap") : t("search.showList")}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className={cn("min-h-screen bg-background flex flex-col pt-16", viewMode === "map" && "h-screen")}>
      <SEO title={t("search.title")} description={t("search.desc")} />
      <Navbar />

      {/* Sticky top search & filter bar */}
      <div className="sticky top-16 z-40 border-b border-border bg-card/95 backdrop-blur-xl shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2">
          {/* Row 1: keyword + quick filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex-1 min-w-[200px] max-w-md relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t("search.keywordPlaceholder")}
                className="custom-input w-full pl-9 h-11"
              />
            </div>

            {apartmentTypes.length > 0 && (
              <Select
                value={apartmentTypeUuid || "__all__"}
                onValueChange={(val) => setApartmentTypeUuid(val === "__all__" ? "" : val)}
              >
                <SelectTrigger className="w-auto shrink-0 h-11">
                  <SelectValue placeholder={t("hero.roomType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t("hero.allTypes")}</SelectItem>
                  {apartmentTypes.map((at) => (
                    <SelectItem key={at.uuid} value={at.uuid}>{at.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={selectedPriceUuid || "__all__"} onValueChange={handlePriceSelect}>
              <SelectTrigger className="w-auto shrink-0 h-11">
                <SelectValue placeholder={t("hero.priceRange")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{t("hero.allPrices")}</SelectItem>
                {filterPrices.map((fp) => (
                  <SelectItem key={fp.uuid} value={fp.uuid}>{fp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSizeUuid || "__all__"} onValueChange={handleSizeSelect}>
              <SelectTrigger className="w-auto shrink-0 h-11">
                <SelectValue placeholder={t("hero.areaSize")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{t("hero.allSizes")}</SelectItem>
                {filterApartmentSizes.map((fs) => (
                  <SelectItem key={fs.uuid} value={fs.uuid}>{fs.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 2: toolbar buttons + result count */}
          <div className="flex items-center gap-2">
            {/* Toggle list/map */}
            <button
              onClick={toggleView}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors h-9"
            >
              {viewMode === "list" ? <MapIcon size={16} /> : <List size={16} />}
              {viewMode === "list" ? t("search.map") : t("search.list")}
            </button>

            <Select value={typeOrder} onValueChange={setTypeOrder}>
              <SelectTrigger className="w-auto shrink-0 h-9 text-sm">
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown size={14} />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              onClick={() => setAdvancedOpen(true)}
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors h-9",
                activeFilterCount > 0
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "border border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <SlidersHorizontal size={14} />
              {t("hero.advancedFilters")}
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 ml-auto shrink-0">
              <p className="text-sm text-foreground font-medium whitespace-nowrap">
                {totalCount} {t("search.found")}
              </p>
              {loading && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced filter dialog */}
      <Dialog open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t("hero.advancedFilters")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t("search.area")}</label>
              <Select
                value={provinceId || "__all__"}
                onValueChange={(val) => { setProvinceId(val === "__all__" ? "" : val); setWardId(""); }}
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder={t("search.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t("search.all")}</SelectItem>
                  {provinces.map((p) => (
                    <SelectItem key={p.code} value={p.code}>{p.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t("hero.ward")}</label>
              <Select
                value={wardId || "__all__"}
                onValueChange={(val) => setWardId(val === "__all__" ? "" : val)}
                disabled={!provinceId || (wardsLoading && wards.length === 0)}
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder={!provinceId ? t("hero.selectAreaFirst") : wardsLoading ? t("search.loading") : t("search.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t("search.all")}</SelectItem>
                  {wards.map((w) => (
                    <SelectItem key={w.code} value={w.code}>{w.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t("hero.priceRange")}</label>
              <Select value={selectedPriceUuid || "__all__"} onValueChange={handlePriceSelect}>
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder={t("hero.allPrices")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t("hero.allPrices")}</SelectItem>
                  {filterPrices.map((fp) => (
                    <SelectItem key={fp.uuid} value={fp.uuid}>{fp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">{t("hero.areaSize")}</label>
              <Select value={selectedSizeUuid || "__all__"} onValueChange={handleSizeSelect}>
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder={t("hero.allSizes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t("hero.allSizes")}</SelectItem>
                  {filterApartmentSizes.map((fs) => (
                    <SelectItem key={fs.uuid} value={fs.uuid}>{fs.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <button
              onClick={() => setAdvancedOpen(false)}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              {t("search.applyFilters")}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main content: list or map */}
      {viewMode === "list" ? renderListView() : renderMapView()}
    </div>
  );
};

export default SearchPage;
