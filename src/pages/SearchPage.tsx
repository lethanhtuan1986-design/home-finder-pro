import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { AdvertisementCard } from "@/components/AdvertisementCard";
import { MapView } from "@/components/MapView";
import { Footer } from "@/components/Footer";
import { filterPrices, filterApartmentSizes } from "@/lib/filter-options";
import advertisementService, {
  GetListAdvertisementRequest,
  GetAdvertisementsForMapRequest,
  MapLocationGroup,
} from "@/services/advertisement.service";
import provinceService, { ProvinceItem } from "@/services/province.service";
import apartmentTypeService, { ApartmentTypeItem } from "@/services/apartmentType.service";
import { httpRequest } from "@/services/index";
import { useTranslation } from "react-i18next";
import { Search, Map as MapIcon, List, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const PAGE_SIZE = 20;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

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
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

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

  // API data: provinces, wards, apartment types
  const { data: provinces = [] } = useQuery<ProvinceItem[]>({
    queryKey: ["dropdown-province"],
    queryFn: () => httpRequest({ http: provinceService.listProvince({ keyword: "" }) }),
  });

  const { data: wards = [], isLoading: wardsLoading } = useQuery<
    { code: string; fullName: string; fullNameEn: string }[]
  >({
    queryKey: ["dropdown-ward", provinceId],
    queryFn: () => httpRequest({ http: provinceService.listWard({ keyword: "", provinceCode: provinceId }) }),
    enabled: !!provinceId,
  });

  const { data: apartmentTypes = [] } = useQuery<ApartmentTypeItem[]>({
    queryKey: ["dropdown-apartment-type"],
    queryFn: () =>
      httpRequest({
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

  // Build API request for list
  const buildRequest = (): GetListAdvertisementRequest => {
    const req: GetListAdvertisementRequest = { isPaging: 1, page, pageSize: PAGE_SIZE };
    if (debouncedKeyword) req.keyword = debouncedKeyword;
    if (provinceId) req.provinceId = provinceId;
    if (wardId) req.wardId = wardId;
    if (apartmentTypeUuid) req.apartmentTypeUuid = apartmentTypeUuid;
    if (priceFrom) req.priceFrom = Number(priceFrom);
    if (priceTo) req.priceTo = Number(priceTo);
    if (apartmentSizeFrom) req.apartmentSizeFrom = Number(apartmentSizeFrom);
    if (apartmentSizeTo) req.apartmentSizeTo = Number(apartmentSizeTo);
    return req;
  };

  // Build API request for map
  const buildMapRequest = (): GetAdvertisementsForMapRequest => {
    const req: GetAdvertisementsForMapRequest = { isPaging: 0 };
    if (debouncedKeyword) req.keyword = debouncedKeyword;
    if (provinceId) req.provinceId = provinceId;
    if (wardId) req.wardId = wardId;
    if (apartmentTypeUuid) req.apartmentTypeUuid = apartmentTypeUuid;
    if (priceFrom) req.priceFrom = Number(priceFrom);
    if (priceTo) req.priceTo = Number(priceTo);
    if (apartmentSizeFrom) req.apartmentSizeFrom = Number(apartmentSizeFrom);
    if (apartmentSizeTo) req.apartmentSizeTo = Number(apartmentSizeTo);
    return req;
  };

  const {
    data: listData,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: [
      "advertisements",
      debouncedKeyword,
      provinceId,
      wardId,
      apartmentTypeUuid,
      priceFrom,
      priceTo,
      apartmentSizeFrom,
      apartmentSizeTo,
      page,
    ],
    queryFn: () => httpRequest({ http: advertisementService.getListPaged(buildRequest()) }),
  });

  const { data: mapLocations = [], isLoading: mapLoading } = useQuery<MapLocationGroup[]>({
    queryKey: [
      "map-advertisements",
      debouncedKeyword,
      provinceId,
      wardId,
      apartmentTypeUuid,
      priceFrom,
      priceTo,
      apartmentSizeFrom,
      apartmentSizeTo,
    ],
    queryFn: () => httpRequest({ http: advertisementService.getForMap(buildMapRequest()) }),
  });

  const advertisements = useMemo(() => (listData as any)?.items || [], [listData]);
  const totalCount = (listData as any)?.pagination?.totalCount ?? 0;
  const totalPages = (listData as any)?.pagination?.totalPage ?? 1;
  const error = queryError ? t("search.serverError") : null;

  // Reset page when filters change (skip initial mount)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setPage(1);
  }, [debouncedKeyword, provinceId, wardId, apartmentTypeUuid, priceFrom, priceTo, apartmentSizeFrom, apartmentSizeTo]);

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
    if (page > 1) params.set("page", String(page));
    setSearchParams(params, { replace: true });
  }, [
    debouncedKeyword,
    provinceId,
    wardId,
    apartmentTypeUuid,
    priceFrom,
    priceTo,
    apartmentSizeFrom,
    apartmentSizeTo,
    page,
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToList = () => {
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("ellipsis");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title={t("search.title")} description={t("search.desc")} />
      <Navbar />

      {/* Filters panel */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          {/* Top row: keyword + dropdowns */}
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("search.keyword")}</label>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t("search.keywordPlaceholder")}
                className="custom-input w-full"
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("search.area")}</label>
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
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{t("hero.ward")}</label>
              <Select
                value={wardId || "__all__"}
                onValueChange={(val) => setWardId(val === "__all__" ? "" : val)}
                disabled={!provinceId || (wardsLoading && wards.length === 0)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      !provinceId ? t("hero.selectAreaFirst") : wardsLoading ? t("search.loading") : t("search.all")
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
          </div>

          {/* Apartment types */}
          {apartmentTypes.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">{t("hero.roomType")}</p>
              <div className="flex gap-2 flex-wrap">
                {apartmentTypes.map((at) => (
                  <button
                    key={at.uuid}
                    onClick={() => setApartmentTypeUuid((prev) => (prev === at.uuid ? "" : at.uuid))}
                    className={cn(
                      "px-3 py-1.5 rounded-lg border text-sm transition-colors",
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

          {/* Price filters */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">{t("hero.priceRange")}</p>
            <div className="flex gap-2 flex-wrap">
              {filterPrices.map((fp) => (
                <button
                  key={fp.uuid}
                  onClick={() => handlePriceSelect(fp.uuid)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-sm transition-colors",
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

          {/* Size filters */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">{t("hero.areaSize")}</p>
            <div className="flex gap-2 flex-wrap">
              {filterApartmentSizes.map((fs) => (
                <button
                  key={fs.uuid}
                  onClick={() => handleSizeSelect(fs.uuid)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-sm transition-colors",
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

          {/* Pagination + view toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {totalCount} {t("search.found")}
              </p>
              {loading && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
            </div>

            <div className="flex items-center gap-3">
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => page > 1 && handlePageChange(page - 1)}
                        className={cn(page <= 1 && "pointer-events-none opacity-50", "cursor-pointer")}
                      />
                    </PaginationItem>
                    {getPageNumbers().map((p, i) =>
                      p === "ellipsis" ? (
                        <PaginationItem key={`ellipsis-${i}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={p}>
                          <PaginationLink
                            isActive={page === p}
                            onClick={() => handlePageChange(p as number)}
                            className="cursor-pointer"
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => page < totalPages && handlePageChange(page + 1)}
                        className={cn(page >= totalPages && "pointer-events-none opacity-50", "cursor-pointer")}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}

              <div className="flex gap-1">
                <button
                  onClick={scrollToList}
                  className="px-3 py-2 rounded-lg border border-input bg-background text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-2 text-foreground h-9"
                >
                  <List size={16} />
                  {t("search.list")}
                </button>
                <button
                  onClick={scrollToMap}
                  className="px-3 py-2 rounded-lg border border-input bg-background text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-2 text-foreground h-9"
                >
                  <MapIcon size={16} />
                  {t("search.map")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
              {error}
            </div>
          )}

          {/* List section */}
          <div ref={listRef}>
            {loading && advertisements.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-full mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {advertisements.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {advertisements.map((ad: any, i: number) => (
                  <div key={ad.uuid} onMouseEnter={() => setHoveredId(ad.uuid)} onMouseLeave={() => setHoveredId(null)}>
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

          {/* Map section below list */}
          <div ref={mapRef} className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapIcon size={20} />
              {t("search.map")}
            </h2>
            <div className="h-[500px] rounded-xl overflow-hidden border border-border">
              <MapView
                locations={mapLocations}
                hoveredId={hoveredId}
                loading={mapLoading && mapLocations.length === 0}
                onMarkerClick={(id) => navigate(`/property/${id}`)}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;
