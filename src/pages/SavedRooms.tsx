import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingCallButton } from '@/components/FloatingCallButton';

import { SEO } from '@/components/SEO';
import { AdvertisementCard } from '@/components/AdvertisementCard';
import { useSavedRooms } from '@/hooks/useSavedRooms';
import { useQuery } from '@tanstack/react-query';
import advertisementService, { AdvertisementData } from '@/services/advertisement.service';
import { httpRequest } from '@/services/index';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';

const SavedRooms = () => {
  const { savedIds } = useSavedRooms();
  const { t } = useTranslation();

  const { data: savedData, isLoading } = useQuery<AdvertisementData[] | { items: AdvertisementData[] }>({
    queryKey: ['saved-advertisements', savedIds],
    queryFn: () =>
      httpRequest({
        http: advertisementService.getListPaged({
          isPaging: 1,
          page: 1,
          pageSize: 20,
          adsLikeds: savedIds,
          isHot: 0,
          typeOrder: 0,
        }),
      }),
    enabled: savedIds.length > 0,
  });

  // Handle both array and { items: [] } response formats
  const savedProperties: AdvertisementData[] = Array.isArray(savedData)
    ? savedData
    : (savedData as any)?.items ?? [];

  return (
    <div className="min-h-screen bg-background flex flex-col pb-14 md:pb-0 pt-16">
      <SEO title={t('saved.title')} description={t('saved.title')} />
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-2">{t('saved.title')}</h1>
        <p className="section-subtitle mb-8">{t('saved.count', { count: savedIds.length })}</p>

        {isLoading && savedIds.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: Math.min(savedIds.length, 6) }).map((_, i) => (
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

        {!isLoading && savedProperties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((ad, i) => (
              <AdvertisementCard key={ad.uuid} data={ad} index={i} showScheduleButton />
            ))}
          </div>
        )}

        {!isLoading && savedIds.length === 0 && (
          <EmptyState
            icon={Heart}
            title={t('saved.empty')}
            description={t('saved.emptyHint')}
            actionLabel={t('nav.searchNow')}
            actionTo="/search"
          />
        )}

        {!isLoading && savedIds.length > 0 && savedProperties.length === 0 && (
          <EmptyState
            icon={Heart}
            title={t('search.noResult')}
            description={t('search.noResultHint')}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SavedRooms;
