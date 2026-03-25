import { HeroSearch } from "@/components/HeroSearch";
import { AdvertisementCard } from "@/components/AdvertisementCard";
import { CoreValues } from "@/components/CoreValues";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

import { SEO } from "@/components/SEO";
import { useQuery } from "@tanstack/react-query";
import { httpRequest } from "@/services/index";
import apartmentTypeService, {
  ApartmentTypeItem,
} from "@/services/apartmentType.service";
import advertisementService, {
  AdvertisementData,
} from "@/services/advertisement.service";
import { filterPrices } from "@/lib/filter-options";

import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: apartmentTypesRaw = [] } = useQuery({
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

  const { data: featuredData, isLoading: featuredLoading } = useQuery<{
    items: AdvertisementData[];
  }>({
    queryKey: ["featured-advertisements"],
    queryFn: () =>
      httpRequest({
        http: advertisementService.getListPaged({
          isPaging: 1,
          page: 1,
          pageSize: 6,
        }),
      }),
  });

  const featuredAds = (featuredData?.items ?? []).filter(Boolean);

  const handleFilterClick = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams(params);
    navigate(`/search?${searchParams.toString()}`);
  };

  const quickFilters = [
    ...apartmentTypesRaw.map((at) => ({
      label: at.name,
      params: { apartmentTypeUuid: at.uuid },
    })),
    ...filterPrices.slice(0, 3).map((fp) => ({
      label: fp.name,
      params: {
        ...(fp.value ? { priceFrom: String(fp.value) } : {}),
        ...(fp.valueTo ? { priceTo: String(fp.valueTo) } : {}),
      },
    })),
  ];

  return (
    <div className="min-h-screen bg-background pb-14 md:pb-0">
      <SEO
        title="XanhStay - Tìm phòng trọ, căn hộ cho thuê"
        description="Nền tảng tìm phòng trọ và căn hộ cho thuê thông minh tại Việt Nam."
      />
      <Navbar />
      <HeroSearch />

      {/* Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="section-title">{t("listing.featured")}</h2>
            <p className="section-subtitle mt-1">{t("listing.featuredSub")}</p>
          </div>
          <Link
            to="/search"
            className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("listing.viewAll")} <ArrowRight size={16} />
          </Link>
        </div>

        {/* Quick filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 thin-scrollbar">
          {quickFilters.map((qf, i) => (
            <button
              key={i}
              onClick={() => handleFilterClick(qf.params)}
              className="filter-chip whitespace-nowrap"
            >
              {qf.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {featuredLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card rounded-2xl overflow-hidden border border-border"
                >
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAds.map((ad, i) => (
                <AdvertisementCard key={ad.uuid} data={ad} index={i} />
              ))}
            </div>
          )}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/search"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("listing.viewAll")} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <CoreValues />
      <Footer />
    </div>
  );
};

export default Index;
