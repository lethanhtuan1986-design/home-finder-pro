import { HeroSearch } from '@/components/HeroSearch';
import { AdvertisementCard } from '@/components/AdvertisementCard';
import { AppDownload } from '@/components/AppDownload';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { SEO } from '@/components/SEO';
import { useQuery } from '@tanstack/react-query';
import { httpRequest } from '@/services/index';
import apartmentTypeService, { ApartmentTypeItem } from '@/services/apartmentType.service';
import advertisementService, { AdvertisementData } from '@/services/advertisement.service';
import { filterPrices } from '@/lib/filter-options';

import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Eye, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { recentIds } = useRecentRooms();

  const { data: apartmentTypes = [] } = useQuery<ApartmentTypeItem[]>({
    queryKey: ['dropdown-apartment-type'],
    queryFn: () =>
      httpRequest({
        http: apartmentTypeService.listApartmentType({
          isPaging: 0,
          typeFinding: 0,
          page: 1,
          pageSize: 100,
          keyword: '',
          status: 1,
        }),
      }),
  });

  const { data: featuredData, isLoading: featuredLoading } = useQuery<{ items: AdvertisementData[] }>({
    queryKey: ['featured-advertisements'],
    queryFn: () =>
      httpRequest({
        http: advertisementService.getListPaged({
          isPaging: 1,
          page: 1,
          pageSize: 6,
        }),
      }),
  });

  // Recent rooms query
  const { data: recentData, isLoading: recentLoading } = useQuery<{ items: AdvertisementData[] }>({
    queryKey: ['recent-advertisements', recentIds],
    queryFn: () =>
      httpRequest({
        http: advertisementService.getListPaged({
          isPaging: 0,
          adsLikeds: recentIds,
        }),
      }),
    enabled: recentIds.length > 0,
  });

  const featuredAds = (featuredData?.items ?? []).filter(Boolean);
  const recentAds = (recentData?.items ?? []).filter(Boolean);

  // Sort recent ads to match recentIds order
  const sortedRecentAds = recentIds
    .map((id) => recentAds.find((ad) => ad.uuid === id))
    .filter(Boolean) as AdvertisementData[];

  const features = [
    { icon: Zap, title: t('features.fast'), desc: t('features.fastDesc') },
    { icon: Eye, title: t('features.visual'), desc: t('features.visualDesc') },
    { icon: Shield, title: t('features.trusted'), desc: t('features.trustedDesc') },
  ];

  const handleFilterClick = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams(params);
    navigate(`/search?${searchParams.toString()}`);
  };

  const quickFilters = [
    ...apartmentTypes.map((at) => ({
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
    <div className="min-h-screen bg-background">
      <SEO title="XanhStay - Tìm phòng trọ, căn hộ cho thuê" description="Nền tảng tìm phòng trọ và căn hộ cho thuê thông minh tại Việt Nam." />
      <Navbar />
      <HeroSearch />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <f.icon size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recently Viewed */}
      {recentIds.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center gap-2 mb-6">
            <Clock size={20} className="text-primary" />
            <h2 className="section-title">Lịch sử xem gần đây</h2>
          </div>
          {recentLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: Math.min(recentIds.length, 3) }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedRecentAds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedRecentAds.slice(0, 6).map((ad, i) => (
                <AdvertisementCard key={ad.uuid} data={ad} index={i} />
              ))}
            </div>
          ) : null}
        </section>
      )}

      {/* Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="section-title">{t('listing.featured')}</h2>
            <p className="section-subtitle mt-1">{t('listing.featuredSub')}</p>
          </div>
          <Link to="/search" className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            {t('listing.viewAll')} <ArrowRight size={16} />
          </Link>
        </div>

        {/* Quick filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAds.map((ad, i) => (
                <AdvertisementCard key={ad.uuid} data={ad} index={i} />
              ))}
            </div>
          )}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Link to="/search" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            {t('listing.viewAll')} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <AppDownload />
      <Footer />
    </div>
  );
};

export default Index;
