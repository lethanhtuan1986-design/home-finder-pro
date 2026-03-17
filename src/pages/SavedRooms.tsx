import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
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

  const { data: savedData, isLoading } = useQuery<{ items: AdvertisementData[] }>({
    queryKey: ['saved-advertisements', savedIds],
    queryFn: () =>
      httpRequest({
        http: advertisementService.getListPaged({
          isPaging: 0,
          adsLikeds: savedIds,
        }),
      }),
    enabled: savedIds.length > 0,
  });

  const savedProperties = savedData?.items ?? [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title={t('saved.title')} description={t('saved.title')} />
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="section-title mb-2">{t('saved.title')}</h1>
        <p className="section-subtitle mb-8">{t('saved.count', { count: savedIds.length })}</p>

        {isLoading && savedIds.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: Math.min(savedIds.length, 6) }).map((_, i) => (
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
        )}

        {!isLoading && savedProperties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((ad, i) => (
              <AdvertisementCard key={ad.uuid} data={ad} index={i} />
            ))}
          </div>
        )}

        {!isLoading && savedIds.length === 0 && (
          <div className="text-center py-20">
            <Heart size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-medium text-foreground">{t('saved.empty')}</p>
            <p className="text-sm text-muted-foreground mt-1 mb-6">{t('saved.emptyHint')}</p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {t('nav.searchNow')}
            </Link>
          </div>
        )}

        {!isLoading && savedIds.length > 0 && savedProperties.length === 0 && (
          <div className="text-center py-20">
            <Heart size={48} className="mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-lg font-medium text-foreground">{t('search.noResult')}</p>
            <p className="text-sm text-muted-foreground mt-1">{t('search.noResultHint')}</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SavedRooms;
