import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SEO } from "@/components/SEO";
import { Navbar } from "@/components/Navbar";
import { AdvertisementCard } from "@/components/AdvertisementCard";
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
import { Search, Map as MapIcon, Loader2, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
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
import { MiniMapPreview } from "@/components/MiniMapPreview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PAGE_SIZE = 20;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const listRef = useRef<HTMLDivElement>(null);

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
  const [advancedOpen, setAdvancedOpen] = useState(false);

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

  const buildRequest = (): GetListAdvertisementRequest => {
    const req: GetListAdvertisementRequest = {
      isPaging: 1,
      page,
      pageSize: PAGE_SIZE,
    };
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
    queryFn: () =>
      httpRequest({
        isCatalog: true,
        http: advertisementService.getForMap(buildMapRequest()),
      }),
  });

  const advertisements = useMemo(() => (listData as any)?.items || [], [listData]);
  const totalCount = (listData as any)?.pagination?.totalCount ?? 0;
  const totalPages = (listData as any)?.pagination?.totalPage ?? 1;
  const error = queryError ? t("search.serverError") : null;

  // Reset page when filters change
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

  // Navigate to map view preserving all filters
  const goToMapView = () => {
    const params = new URLSearchParams();
    if (debouncedKeyword) params.set("q", debouncedKeyword);
    if (provinceId) params.set("provinceId", provinceId);
    if (wardId) params.set("wardId", wardId);
    if (apartmentTypeUuid) params.set("apartmentTypeUuid", apartmentTypeUuid);
    if (priceFrom) params.set("priceFrom", priceFrom);
    if (priceTo) params.set("priceTo", priceTo);
    if (apartmentSizeFrom) params.set("apartmentSizeFrom", apartmentSizeFrom);
    if (apartmentSizeTo) params.set("apartmentSizeTo", apartmentSizeTo);
    navigate(`/search/map?${params.toString()}`);
  };

  const resetFilters = () => {
    setProvinceId("");
    setWardId("");
    setApartmentTypeUuid("");
    setPriceFrom("");
    setPriceTo("");
    setApartmentSizeFrom("");
    setApartmentSizeTo("");
    setKeyword("");
    setAdvancedOpen(false);
  };

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

  const activeFilterCount = [provinceId, wardId, apartmentTypeUuid, selectedPriceUuid, selectedSizeUuid].filter(Boolean).length;

  // Active filter chips
  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (provinceId) {
    const p = provinces.find((p) => p.code === provinceId);
    if (p) activeChips.push({ label: p.fullName, onRemove: () => { setProvinceId(""); setWardId(""); } });
  }
  if (apartmentTypeUuid) {
    const at = apartmentTypes.find((a) => a.uuid === apartmentTypeUuid);
    if (at) activeChips.push({ label: at.name, onRemove: () => setApartmentTypeUuid("") });
  }
  if (selectedPriceUuid) {
    const fp = filterPrices.find((f) => f.uuid === selectedPriceUuid);
    if (fp) activeChips.push({ label: fp.name, onRemove: () => { setPriceFrom(""); setPriceTo(""); } });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pt-16">
      <SEO title={t("search.title")} description={t("search.desc")} />
      <Navbar />

      {/* Sticky toolbar */}
      <div className="sticky top-16 z-40 border-b border-border bg-card/95 backdrop-blur-xl shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2">
          {/* Search bar row */}
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t("search.keywordPlaceholder")}
                className="custom-input w-full pl-9 h-11"
              />
            </div>

            {/* 3 toolbar buttons */}
            <button
              onClick={goToMapView}
              className="h-11 px-4 rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-secondary transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <MapIcon size={16} />
              <span className="hidden sm:inline">{t("search.map")}</span>
            </button>

            <button
              onClick={() => setAdvancedOpen(true)}
              className={cn(
                "relative h-11 px-4 rounded-xl border text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap",
                activeFilterCount > 0
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "border-border bg-card text-foreground hover:bg-secondary"
              )}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">{t("search.advanced")}</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Active filter chips + count */}
          <div className="flex items-center gap-2 overflow-x-auto thin-scrollbar">
            {activeChips.map((chip, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium whitespace-nowrap">
                {chip.label}
                <button onClick={chip.onRemove} className="hover:text-primary/70">
                  <X size={12} />
                </button>
              </span>
            ))}
            <span className="text-sm text-muted-foreground whitespace-nowrap ml-auto">
              {totalCount} {t("search.found")}
              {loading && <Loader2 size={14} className="inline-block ml-1 animate-spin" />}
            </span>
          </div>
        </div>
      </div>

      {/* Advanced filters dialog */}
      <Dialog open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t("search.advancedFilters")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("search.area")}</label>
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

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("hero.ward")}</label>
              <Select
                value={wardId || "__all__"}
                onValueChange={(val) => setWardId(val === "__all__" ? "" : val)}
                disabled={!provinceId}
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder={!provinceId ? t("hero.selectAreaFirst") : t("search.all")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t("search.all")}</SelectItem>
                  {wards.map((w) => (
                    <SelectItem key={w.code} value={w.code}>{w.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("hero.roomType")}</label>
              <Select
                value={apartmentTypeUuid || "__all__"}
                onValueChange={(val) => setApartmentTypeUuid(val === "__all__" ? "" : val)}
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder={t("hero.allTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">{t("hero.allTypes")}</SelectItem>
                  {apartmentTypes.map((at) => (
                    <SelectItem key={at.uuid} value={at.uuid}>{at.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("hero.priceRange")}</label>
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

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("hero.areaSize")}</label>
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

            <div className="flex gap-2 pt-2">
              <button
                onClick={resetFilters}
                className="flex-1 h-11 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
              >
                {t("search.reset")}
              </button>
              <button
                onClick={() => setAdvancedOpen(false)}
                className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                {t("search.apply")}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main content: sidebar + list */}
      <div className="flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-4">
            {/* Left sidebar - map + ad banner */}
            <aside className="hidden lg:block w-[300px] shrink-0">
              <div className="sticky top-[calc(4rem+7rem)] space-y-5">
                {/* Map preview - wider */}
                <div
                  className="rounded-xl overflow-hidden border border-border cursor-pointer group"
                  onClick={goToMapView}
                  title={t("search.openMapView")}
                >
                  <div className="h-[220px] relative">
                    <MiniMapPreview locations={mapLocations} loading={mapLoading} />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors flex items-center justify-center">
                      <span className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-lg group-hover:scale-105 transition-transform">
                        <MapIcon size={14} />
                        {t("search.openMapView")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ad banner placeholder */}
                <div className="rounded-xl border border-border overflow-hidden bg-gradient-to-b from-primary/5 to-primary/10 p-5 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <img src="/images/logo.svg" alt="XanhStay" className="h-7" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Thanh toán trước, giảm ngay!</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Trả trước 6 tháng giảm <span className="text-primary font-bold">3%</span> • 12 tháng giảm <span className="text-primary font-bold">5%</span>
                  </p>
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Tải ứng dụng
                  </a>
                </div>
              </div>
            </aside>

            {/* Right: Room list */}
            <div className="flex-1 min-w-0" ref={listRef}>
              {/* Mobile: filter chips + map button */}
              <div className="lg:hidden flex items-center gap-2 mb-4 overflow-x-auto thin-scrollbar pb-2">
                <button
                  onClick={goToMapView}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-primary/30 text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
                >
                  <MapIcon size={16} />
                  {t("search.map")}
                </button>
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
                        <SelectItem key={at.uuid} value={at.uuid}>
                          {at.name}
                        </SelectItem>
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
                      <SelectItem key={fp.uuid} value={fp.uuid}>
                        {fp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
                  {error}
                </div>
              )}

              {loading && advertisements.length === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {advertisements.map((ad: any, i: number) => (
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;
