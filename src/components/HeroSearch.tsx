import { useState, useEffect, useRef } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { httpRequest } from "@/services/index";
import provinceService, { ProvinceItem } from "@/services/province.service";
import apartmentTypeService, {
  ApartmentTypeItem,
} from "@/services/apartmentType.service";
import { filterPrices, filterApartmentSizes } from "@/lib/filter-options";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

import heroBanner1 from "@/assets/hero-banner-1.jpg";
import heroBanner2 from "@/assets/hero-banner-2.jpg";
import heroBanner3 from "@/assets/hero-banner-3.jpg";

const bannerImages = [heroBanner1, heroBanner2, heroBanner3];

export const HeroSearch = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [provinceId, setProvinceId] = useState("");
  const [wardId, setWardId] = useState("");
  const [priceUuid, setPriceUuid] = useState("");
  const [sizeUuid, setSizeUuid] = useState("");
  const [apartmentTypeUuid, setApartmentTypeUuid] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);

  // Banner slideshow - 5s interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Sticky search panel on desktop only
  useEffect(() => {
    if (isMobile) {
      setIsSticky(false);
      return;
    }
    const handleScroll = () => {
      if (heroSectionRef.current && searchPanelRef.current) {
        const heroBottom =
          heroSectionRef.current.getBoundingClientRect().bottom;
        setIsSticky(heroBottom < 64); // 64px = navbar height
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (provinceId) params.set("provinceId", provinceId);
    if (wardId) params.set("wardId", wardId);
    if (apartmentTypeUuid) params.set("apartmentTypeUuid", apartmentTypeUuid);

    const selectedPrice = filterPrices.find((p) => p.uuid === priceUuid);
    if (selectedPrice) {
      if (selectedPrice.value)
        params.set("priceFrom", String(selectedPrice.value));
      if (selectedPrice.valueTo)
        params.set("priceTo", String(selectedPrice.valueTo));
    }

    const selectedSize = filterApartmentSizes.find((s) => s.uuid === sizeUuid);
    if (selectedSize) {
      if (selectedSize.value)
        params.set("apartmentSizeFrom", String(selectedSize.value));
      if (selectedSize.valueTo)
        params.set("apartmentSizeTo", String(selectedSize.valueTo));
    }

    navigate(`/search?${params.toString()}`);
  };

  const advancedFilterCount = [wardId, sizeUuid, apartmentTypeUuid].filter(
    Boolean,
  ).length;

  const searchPanel = (
    <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-soft border border-border p-3 sm:p-4">
      {/* Main filters row */}
      <div className="flex flex-col md:flex-row items-stretch gap-2">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="search-field">
            <Select
              value={provinceId}
              onValueChange={(val) => {
                setProvinceId(val === "__all__" ? "" : val);
                setWardId("");
              }}
            >
              <SelectTrigger className="search-field-select-trigger">
                <SelectValue placeholder={t("hero.area")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{t("hero.area")}</SelectItem>
                {provinces.map((p) => (
                  <SelectItem key={p.code} value={p.code}>
                    {p.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="search-field">
            <Select
              value={priceUuid}
              onValueChange={(val) =>
                setPriceUuid(val === "__all__" ? "" : val)
              }
            >
              <SelectTrigger className="search-field-select-trigger">
                <SelectValue placeholder={t("hero.priceRange")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{t("hero.priceRange")}</SelectItem>
                {filterPrices.map((fp) => (
                  <SelectItem key={fp.uuid} value={fp.uuid}>
                    {fp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 items-end">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap h-fit ${
              showAdvanced
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            <SlidersHorizontal size={18} />
            <span className="hidden sm:inline">
              {t("hero.advancedFilters")}
            </span>
            {advancedFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {advancedFilterCount}
              </span>
            )}
          </button>

          <button
            onClick={handleSearch}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap h-fit"
          >
            <Search size={20} />
            <span>{t("hero.searchBtn")}</span>
          </button>
        </div>
      </div>

      {/* Advanced filters panel */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-3 mt-3 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("hero.advancedFilters")}
                </span>
                <button
                  onClick={() => setShowAdvanced(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="search-field">
                  <Select
                    value={wardId}
                    onValueChange={(val) =>
                      setWardId(val === "__all__" ? "" : val)
                    }
                    disabled={
                      !provinceId || (wardsLoading && wards.length === 0)
                    }
                  >
                    <SelectTrigger className="search-field-select-trigger">
                      <SelectValue
                        placeholder={
                          !provinceId
                            ? t("hero.selectAreaFirst")
                            : wardsLoading
                              ? t("search.loading")
                              : t("hero.ward")
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">{t("hero.ward")}</SelectItem>
                      {wards.map((w) => (
                        <SelectItem key={w.code} value={w.code}>
                          {w.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="search-field">
                  <Select
                    value={apartmentTypeUuid}
                    onValueChange={(val) =>
                      setApartmentTypeUuid(val === "__all__" ? "" : val)
                    }
                  >
                    <SelectTrigger className="search-field-select-trigger">
                      <SelectValue placeholder={t("hero.roomType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">
                        {t("hero.roomType")}
                      </SelectItem>
                      {apartmentTypes.map((at) => (
                        <SelectItem key={at.uuid} value={at.uuid}>
                          {at.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="search-field">
                  <Select
                    value={sizeUuid}
                    onValueChange={(val) =>
                      setSizeUuid(val === "__all__" ? "" : val)
                    }
                  >
                    <SelectTrigger className="search-field-select-trigger">
                      <SelectValue placeholder={t("hero.areaSize")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">
                        {t("hero.areaSize")}
                      </SelectItem>
                      {filterApartmentSizes.map((fs) => (
                        <SelectItem key={fs.uuid} value={fs.uuid}>
                          {fs.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <section ref={heroSectionRef} className="relative overflow-hidden">
        {/* Banner slideshow background - contained to hero section */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full overflow-hidden">
            {bannerImages.map((img, idx) => (
              <div
                key={idx}
                className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
                style={{ opacity: currentBanner === idx ? 1 : 0 }}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end min-h-[340px] md:min-h-[420px] pb-6 md:pb-8">
          {/* Brand text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-center mb-4 md:mb-6"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-2">
              XanhStay
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-light">
              {t("slogan")}
            </p>
          </motion.div>

          {/* Search panel */}
          <motion.div
            ref={searchPanelRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            className={`relative z-20 max-w-3xl mx-auto ${!isMobile && isSticky ? "invisible" : ""}`}
          >
            {searchPanel}
          </motion.div>
        </div>
      </section>

      {/* Sticky search panel for desktop */}
      {!isMobile && isSticky && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            {searchPanel}
          </div>
        </div>
      )}
    </>
  );
};
