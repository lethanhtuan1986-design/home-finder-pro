import { HeroSearch } from "@/components/HeroSearch";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { AdvertisementCard } from "@/components/AdvertisementCard";
import { TestimonialsSection } from "@/components/TestimonialsSection";
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
import { useMemo, useState } from "react";

// Fisher-Yates shuffle
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'recommended' | 'latest'>('recommended');

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

  // Recommended (shuffled)
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

  // Latest
  const { data: latestData, isLoading: latestLoading } = useQuery<{
    items: AdvertisementData[];
  }>({
    queryKey: ["latest-advertisements"],
    queryFn: () =>
      httpRequest({
        http: advertisementService.getListPaged({
          isPaging: 1,
          page: 1,
          pageSize: 6,
          typeFinding: 0,
        }),
      }),
  });

  const recommendedAds = useMemo(
    () => shuffleArray((featuredData?.items ?? []).filter(Boolean)),
    [featuredData]
  );
  const latestAds = (latestData?.items ?? []).filter(Boolean);

  const currentAds = activeTab === 'recommended' ? recommendedAds : latestAds;
  const currentLoading = activeTab === 'recommended' ? featuredLoading : latestLoading;

  const handleFilterClick = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams(params);
    navigate(`/search?${searchParams.toString()}`);
  };

  const quickFilters = [
    ...apartmentTypesRaw.map((at: ApartmentTypeItem) => ({
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

  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border">
          <Skeleton className="aspect-[3/2] w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-full mt-3" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-14 md:pb-0">
      <SEO
        title="XanhStay - Tìm phòng, căn hộ cho thuê"
        description="Nền tảng tìm phòng và căn hộ cho thuê thông minh tại Việt Nam."
      />
      <Navbar />
      <HeroSearch />

      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Room Listings with Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-6 gap-4">
          <div>
            {/* Tabs */}
            <div className="flex gap-1 bg-secondary rounded-xl p-1">
              <button
                onClick={() => setActiveTab('recommended')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === 'recommended'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t("listing.recommended")}
              </button>
              <button
                onClick={() => setActiveTab('latest')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === 'latest'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t("listing.latest")}
              </button>
            </div>
            <p className="section-subtitle mt-2">
              {activeTab === 'recommended' ? t("listing.recommendedSub") : t("listing.latestSub")}
            </p>
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
          {currentLoading ? (
            <SkeletonGrid />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentAds.map((ad, i) => (
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

      {/* Testimonials */}
      <TestimonialsSection />

      <CoreValues />
      <Footer />
    </div>
  );
};

export default Index;
