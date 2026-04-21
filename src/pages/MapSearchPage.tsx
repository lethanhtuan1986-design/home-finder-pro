import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { nominatimResultToBounds, RADIUS_OPTIONS, DEFAULT_RADIUS_KM, NominatimResult, GeoBounds, getUserLocation } from "@/lib/geocoding";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { AdvertisementCard } from "@/components/AdvertisementCard";
import { MapView } from "@/components/MapView";
import { filterPrices, filterApartmentSizes } from "@/lib/filter-options";
import advertisementService, {
  GetAdvertisementsForMapRequest,
  AdvertisementData,
} from "@/services/advertisement.service";
import provinceService, { ProvinceItem } from "@/services/province.service";
import apartmentTypeService, {
  ApartmentTypeItem,
} from "@/services/apartmentType.service";
import { httpRequest } from "@/services/index";
import { useTranslation } from "react-i18next";
import { Search, SlidersHorizontal, Loader2, X, ArrowLeft } from "lucide-react";
import { LocationAutocomplete } from "@/components/LocationAutocomplete";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const parsePoint = (point: string): [number, number] | null => {
  try {
    const parsed = JSON.parse(point);
    if (Array.isArray(parsed) && parsed.length >= 2) {
      const [lat, lng] = parsed.map(Number);
      if (isFinite(lat) && isFinite(lng) && !(lat === 0 && lng === 0))
        return [lat, lng];
    }
  } catch {}
  return null;
};

const MapSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [mobileShowList, setMobileShowList] = useState(false);

  // Map bounding box state (from viewport)
  const [bounds, setBounds] = useState<{
    neLat: number;
    neLng: number;
    swLat: number;
    swLng: number;
  } | null>(null);
  const [debouncedBounds, setDebouncedBounds] = useState(bounds);

  // Filter states from URL
  const [provinceId, setProvinceId] = useState(
    searchParams.get("provinceId") || "",
  );
  const [wardId, setWardId] = useState(searchParams.get("wardId") || "");
  const [apartmentTypeUuid, setApartmentTypeUuid] = useState(
    searchParams.get("apartmentTypeUuid") || "",
  );
  const [priceFrom, setPriceFrom] = useState(
    searchParams.get("priceFrom") || "",
  );
  const [priceTo, setPriceTo] = useState(searchParams.get("priceTo") || "");
  const [apartmentSizeFrom, setApartmentSizeFrom] = useState(
    searchParams.get("apartmentSizeFrom") || "",
  );
  const [apartmentSizeTo, setApartmentSizeTo] = useState(
    searchParams.get("apartmentSizeTo") || "",
  );
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);

  // Yêu cầu vị trí người dùng sớm để bias kết quả tìm kiếm
  useEffect(() => {
    getUserLocation().catch(() => {});
  }, []);

  // Debounce map viewport bounds (300ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedBounds(bounds), 300);
    return () => clearTimeout(timer);
  }, [bounds]);

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number; zoom: number } | null>(null);

  const selectedPriceUuid =
    filterPrices.find(
      (fp) =>
        String(fp.value || "") === priceFrom &&
        String(fp.valueTo || "") === priceTo,
    )?.uuid || "";
  const selectedSizeUuid =
    filterApartmentSizes.find(
      (fs) =>
        String(fs.value || "") === apartmentSizeFrom &&
        String(fs.valueTo || "") === apartmentSizeTo,
    )?.uuid || "";

  // API data
  const { data: provinces = [] } = useQuery<ProvinceItem[]>({
    queryKey: ["dropdown-province"],
    queryFn: () =>
      httpRequest({
        isCatalog: true,
        http: provinceService.listProvince({ keyword: "" }),
      }),
  });

  const { data: wards = [], isLoading: wardsLoading } = useQuery<
    { code: string; fullName: string; fullNameEn: string }[]
  >({
    queryKey: ["dropdown-ward", provinceId],
    queryFn: () =>
      httpRequest({
        isCatalog: true,
        http: provinceService.listWard({
          keyword: "",
          provinceCode: provinceId,
        }),
      }),
    enabled: !!provinceId,
  });

  const { data: apartmentTypes = [] } = useQuery<ApartmentTypeItem[]>({
    queryKey: ["dropdown-apartment-type"],
    queryFn: () =>
      httpRequest({
        isCatalog: true,
        http: apartmentTypeService.listApartmentType({
          isPaging: 0,
          typeFinding: 0,
          page: 1,
          pageSize: 100,
          keyword: "",
          status: 1,
        }),
      }),
  });

  // Build enriched suffix for autocomplete
  const enrichSuffix = useMemo(() => {
    const parts: string[] = [];
    if (wardId) {
      const ward = wards.find((w) => w.code === wardId);
      if (ward) parts.push(ward.fullName);
    }
    if (provinceId) {
      const province = provinces.find((p) => p.code === provinceId);
      if (province) parts.push(province.fullName);
    }
    return parts.join(" ");
  }, [provinceId, wardId, provinces, wards]);

  // Handle autocomplete selection: pan map + update search overlay
  const handleLocationSelect = useCallback((result: NominatimResult, bounds: GeoBounds) => {
    setMapCenter({ lat: bounds.centerLat, lng: bounds.centerLng, zoom: 14 });
  }, []);

  const buildMapRequest = (): GetAdvertisementsForMapRequest => {
    const req: GetAdvertisementsForMapRequest = { isPaging: 1, page: 1, pageSize: 100, isHot: 0, typeOrder: 0 };
    if (keyword) req.keyword = keyword;
    if (provinceId) req.provinceId = provinceId;
    if (wardId) req.wardId = wardId;
    if (apartmentTypeUuid) req.apartmentTypeUuid = apartmentTypeUuid;
    if (priceFrom) req.priceFrom = Number(priceFrom);
    if (priceTo) req.priceTo = Number(priceTo);
    if (apartmentSizeFrom) req.apartmentSizeFrom = Number(apartmentSizeFrom);
    if (apartmentSizeTo) req.apartmentSizeTo = Number(apartmentSizeTo);
    // Always use current map viewport bounds
    if (debouncedBounds) {
      req.neLat = debouncedBounds.neLat;
      req.neLng = debouncedBounds.neLng;
      req.swLat = debouncedBounds.swLat;
      req.swLng = debouncedBounds.swLng;
    }
    return req;
  };

  const { data: mapData, isLoading: mapLoading } = useQuery({
    queryKey: [
      "map-advertisements",
      keyword,
      provinceId,
      wardId,
      apartmentTypeUuid,
      priceFrom,
      priceTo,
      apartmentSizeFrom,
      apartmentSizeTo,
      debouncedBounds?.neLat,
      debouncedBounds?.swLat,
      debouncedBounds?.neLng,
      debouncedBounds?.swLng,
    ],
    queryFn: () =>
      httpRequest({
        http: advertisementService.getForMap(buildMapRequest()),
      }),
    enabled: !!debouncedBounds,
  });

  const mapLocations = useMemo(() => {
    const items = (mapData as any)?.items || [];
    return items as { point: string; longitude: number; address: string; totalAds: number; ads: AdvertisementData[] }[];
  }, [mapData]);

  const visibleAds = useMemo(() => mapLocations.flatMap((loc) => loc.ads), [mapLocations]);

  // Sync to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (provinceId) params.set("provinceId", provinceId);
    if (wardId) params.set("wardId", wardId);
    if (apartmentTypeUuid) params.set("apartmentTypeUuid", apartmentTypeUuid);
    if (priceFrom) params.set("priceFrom", priceFrom);
    if (priceTo) params.set("priceTo", priceTo);
    if (apartmentSizeFrom) params.set("apartmentSizeFrom", apartmentSizeFrom);
    if (apartmentSizeTo) params.set("apartmentSizeTo", apartmentSizeTo);
    setSearchParams(params, { replace: true });
  }, [
    keyword,
    provinceId,
    wardId,
    apartmentTypeUuid,
    priceFrom,
    priceTo,
    apartmentSizeFrom,
    apartmentSizeTo,
    setSearchParams,
  ]);

  const handlePriceSelect = (uuid: string) => {
    if (uuid === "__all__" || uuid === selectedPriceUuid) {
      setPriceFrom("");
      setPriceTo("");
    } else {
      const fp = filterPrices.find((p) => p.uuid === uuid);
      if (fp) {
        setPriceFrom(fp.value ? String(fp.value) : "");
        setPriceTo(fp.valueTo ? String(fp.valueTo) : "");
      }
    }
  };

  const handleSizeSelect = (uuid: string) => {
    if (uuid === "__all__" || uuid === selectedSizeUuid) {
      setApartmentSizeFrom("");
      setApartmentSizeTo("");
    } else {
      const fs = filterApartmentSizes.find((s) => s.uuid === uuid);
      if (fs) {
        setApartmentSizeFrom(fs.value ? String(fs.value) : "");
        setApartmentSizeTo(fs.valueTo ? String(fs.valueTo) : "");
      }
    }
  };

  const handleBoundsChange = useCallback(
    (b: { neLat: number; neLng: number; swLat: number; swLng: number }) => {
      setBounds(b);
    },
    [],
  );

  const activeFilterCount = [
    apartmentTypeUuid,
    selectedPriceUuid,
    selectedSizeUuid,
  ].filter(Boolean).length;

  const filterContent = (
    <div className="space-y-5 p-1">
      {/* Keyword */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
          {t("search.keyword")}
        </label>
        <LocationAutocomplete
          value={keyword}
          onChange={setKeyword}
          onSelect={handleLocationSelect}
          enrichSuffix={enrichSuffix}
          radiusKm={radiusKm}
          placeholder={t("search.keywordPlaceholder")}
        />
      </div>

      {/* Province */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
          {t("search.area")}
        </label>
        <Select
          value={provinceId || "__all__"}
          onValueChange={(val) => {
            setProvinceId(val === "__all__" ? "" : val);
            setWardId("");
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("search.all")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{t("search.all")}</SelectItem>
            {provinces.map((p) => (
              <SelectItem key={p.code} value={p.code}>
                {p.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ward */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
          {t("hero.ward")}
        </label>
        <Select
          value={wardId || "__all__"}
          onValueChange={(val) => setWardId(val === "__all__" ? "" : val)}
          disabled={!provinceId}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={
                !provinceId ? t("hero.selectAreaFirst") : t("search.all")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">{t("search.all")}</SelectItem>
            {wards.map((w) => (
              <SelectItem key={w.code} value={w.code}>
                {w.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Room type */}
      {apartmentTypes.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t("hero.roomType")}
          </p>
          <div className="flex flex-col gap-1.5">
            {apartmentTypes.map((at) => (
              <button
                key={at.uuid}
                onClick={() =>
                  setApartmentTypeUuid((prev) =>
                    prev === at.uuid ? "" : at.uuid,
                  )
                }
                className={cn(
                  "px-3 py-2 rounded-lg border text-sm text-left transition-colors",
                  apartmentTypeUuid === at.uuid
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border bg-background text-foreground hover:bg-secondary",
                )}
              >
                {at.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {t("hero.priceRange")}
        </p>
        <div className="flex flex-col gap-1.5">
          {filterPrices.map((fp) => (
            <button
              key={fp.uuid}
              onClick={() => handlePriceSelect(fp.uuid)}
              className={cn(
                "px-3 py-2 rounded-lg border text-sm text-left transition-colors",
                selectedPriceUuid === fp.uuid
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-background text-foreground hover:bg-secondary",
              )}
            >
              {fp.name}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {t("hero.areaSize")}
        </p>
        <div className="flex flex-col gap-1.5">
          {filterApartmentSizes.map((fs) => (
            <button
              key={fs.uuid}
              onClick={() => handleSizeSelect(fs.uuid)}
              className={cn(
                "px-3 py-2 rounded-lg border text-sm text-left transition-colors",
                selectedSizeUuid === fs.uuid
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-background text-foreground hover:bg-secondary",
              )}
            >
              {fs.name}
            </button>
          ))}
        </div>
      </div>

      {/* Radius */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Bán kính tìm kiếm
        </p>
        <div className="flex flex-col gap-1.5">
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r.value}
              onClick={() => setRadiusKm(r.value)}
              className={cn(
                "px-3 py-2 rounded-lg border text-sm text-left transition-colors",
                radiusKm === r.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border bg-background text-foreground hover:bg-secondary",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col pt-16 bg-background">
      <SEO title={t("mapPage.title")} description={t("search.desc")} />
      <Navbar />

      {/* Split layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Room list panel */}
        <div
          className={cn(
            "flex flex-col border-r border-border bg-card",
            isMobile
              ? "w-full fixed inset-x-0 top-16 bottom-[4rem] z-[1100] transition-transform duration-300"
              : "w-[380px] shrink-0",
          )}
          style={
            isMobile
              ? { transform: mobileShowList ? "translateX(0)" : "translateX(-100%)" }
              : undefined
          }
        >
          {/* Header */}
          <div className="p-3 border-b border-border flex items-center gap-2">
            {isMobile ? (
              <button
                onClick={() => setMobileShowList(false)}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
              >
                <X size={18} />
              </button>
            ) : (
              <button
                onClick={() => navigate(-1)}
                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <p className="text-sm font-medium text-foreground flex-1">
              {visibleAds.length} {t("search.found")}
            </p>
            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <button className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors">
                  <SlidersHorizontal size={14} />
                  {t("search.filter")}
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] overflow-y-auto z-[1300]" overlayClassName="z-[1250]">
                <SheetHeader>
                  <SheetTitle>{t("search.filter")}</SheetTitle>
                </SheetHeader>
                <div className="mt-4">{filterContent}</div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Room cards list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {mapLoading && visibleAds.length === 0 && (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-primary" />
              </div>
            )}
            {visibleAds.map((ad, i) => (
              <div
                key={ad.uuid}
                onMouseEnter={() => setHoveredId(ad.uuid)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <AdvertisementCard data={ad} index={i} />
              </div>
            ))}
            {!mapLoading && visibleAds.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search size={32} className="text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground">
                  {t("search.noResult")}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("search.noResultMapHint")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Map */}
        <div className="flex-1 relative">
          {/* Floating search bar on map */}
          <div className="absolute top-4 left-4 z-[1000] w-[calc(100%-2rem)] md:w-80">
            <LocationAutocomplete
              value={keyword}
              onChange={setKeyword}
              onSelect={handleLocationSelect}
              enrichSuffix={enrichSuffix}
              radiusKm={radiusKm}
              placeholder={t("search.keywordPlaceholder")}
              className="w-full"
              inputClassName="bg-card shadow-lg border-border"
            />
          </div>

          <MapView
            locations={mapLocations}
            hoveredId={hoveredId}
            loading={mapLoading && mapLocations.length === 0}
            onMarkerClick={(id) => navigate(`/advertisement/${id}`)}
            onBoundsChange={handleBoundsChange}
            flyTo={mapCenter}
          />

          {/* Mobile: toggle list button */}
          {isMobile && (
            <button
              onClick={() => setMobileShowList((v) => !v)}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-primary text-primary-foreground px-4 py-2.5 rounded-full shadow-lg text-sm font-medium"
            >
              {mobileShowList ? t("search.showMap") : t("search.showList")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapSearchPage;
