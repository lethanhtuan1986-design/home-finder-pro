import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { MapView } from '@/components/MapView';
import { AdvertisementCard } from '@/components/AdvertisementCard';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import advertisementService, { GetAdvertisementsForMapRequest } from '@/services/advertisement.service';
import provinceService, { ProvinceItem } from '@/services/province.service';
import apartmentTypeService, { ApartmentTypeItem } from '@/services/apartmentType.service';
import { filterPrices, filterApartmentSizes, FilterOption } from '@/lib/filter-options';
import { httpRequest } from '@/services/index';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Search, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 20;

const MapPage = () => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { t } = useTranslation();

  // Filter states
  const [provinceId, setProvinceId] = useState('');
  const [wardId, setWardId] = useState('');
  const [apartmentTypeUuid, setApartmentTypeUuid] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [apartmentSizeFrom, setApartmentSizeFrom] = useState('');
  const [apartmentSizeTo, setApartmentSizeTo] = useState('');
  const [keyword, setKeyword] = useState('');

  const selectedPriceUuid = filterPrices.find(
    (fp) => String(fp.value || '') === priceFrom && String(fp.valueTo || '') === priceTo
  )?.uuid || '';

  const selectedSizeUuid = filterApartmentSizes.find(
    (fs) => String(fs.value || '') === apartmentSizeFrom && String(fs.valueTo || '') === apartmentSizeTo
  )?.uuid || '';

  // Dropdowns
  const { data: provinces = [] } = useQuery<ProvinceItem[]>({
    queryKey: ['dropdown-province'],
    queryFn: () => httpRequest({ http: provinceService.listProvince({ keyword: '' }) }),
  });

  const { data: wards = [] } = useQuery<{ code: string; fullName: string; fullNameEn: string }[]>({
    queryKey: ['dropdown-ward', provinceId],
    queryFn: () => httpRequest({ http: provinceService.listWard({ keyword: '', provinceCode: provinceId }) }),
    enabled: !!provinceId,
  });

  const { data: apartmentTypes = [] } = useQuery<ApartmentTypeItem[]>({
    queryKey: ['dropdown-apartment-type'],
    queryFn: () =>
      httpRequest({
        http: apartmentTypeService.listApartmentType({
          isPaging: 0, typeFinding: 0, page: 1, pageSize: 100, keyword: '', status: 1,
        }),
      }),
  });

  const buildRequest = (pageNum: number): GetAdvertisementsForMapRequest => {
    const req: GetAdvertisementsForMapRequest = { isPaging: 1, page: pageNum, pageSize: PAGE_SIZE };
    if (keyword) req.keyword = keyword;
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
    data: infiniteData,
    isLoading: loading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['map-advertisements', keyword, provinceId, wardId, apartmentTypeUuid, priceFrom, priceTo, apartmentSizeFrom, apartmentSizeTo],
    queryFn: ({ pageParam = 1 }) =>
      httpRequest({ http: advertisementService.getForMap(buildRequest(pageParam as number)) }),
    getNextPageParam: (lastPage: any, allPages) => {
      if (!lastPage?.pagination) return undefined;
      const next = allPages.length + 1;
      return next <= lastPage.pagination.totalPage ? next : undefined;
    },
    initialPageParam: 1,
  });

  const advertisements = infiniteData?.pages.flatMap((p: any) => p?.items || []) ?? [];
  const totalCount = infiniteData?.pages[0]?.pagination?.totalCount ?? 0;

  const handlePriceSelect = (fp: FilterOption) => {
    if (selectedPriceUuid === fp.uuid) { setPriceFrom(''); setPriceTo(''); }
    else { setPriceFrom(fp.value ? String(fp.value) : ''); setPriceTo(fp.valueTo ? String(fp.valueTo) : ''); }
  };

  const handleSizeSelect = (fs: FilterOption) => {
    if (selectedSizeUuid === fs.uuid) { setApartmentSizeFrom(''); setApartmentSizeTo(''); }
    else { setApartmentSizeFrom(fs.value ? String(fs.value) : ''); setApartmentSizeTo(fs.valueTo ? String(fs.valueTo) : ''); }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title={t('mapPage.title')} description={t('mapPage.title')} />
      <Navbar />

      {/* Compact filter bar */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="max-w-[1600px] mx-auto flex flex-wrap gap-2 items-center">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t('search.keywordPlaceholder')}
            className="custom-select flex-1 min-w-[120px] max-w-[200px]"
          />
          <select
            value={provinceId}
            onChange={(e) => { setProvinceId(e.target.value); setWardId(''); }}
            className="custom-select"
          >
            <option value="">{t('hero.area')}</option>
            {provinces.map((p) => <option key={p.code} value={p.code}>{p.fullName}</option>)}
          </select>
          <select
            value={wardId}
            onChange={(e) => setWardId(e.target.value)}
            className="custom-select"
            disabled={!provinceId}
          >
            <option value="">{t('hero.ward')}</option>
            {wards.map((w) => <option key={w.code} value={w.code}>{w.fullName}</option>)}
          </select>
          <select
            value={apartmentTypeUuid}
            onChange={(e) => setApartmentTypeUuid(e.target.value)}
            className="custom-select"
          >
            <option value="">{t('hero.roomType')}</option>
            {apartmentTypes.map((at) => <option key={at.uuid} value={at.uuid}>{at.name}</option>)}
          </select>
          <select
            value={selectedPriceUuid}
            onChange={(e) => {
              const fp = filterPrices.find((p) => p.uuid === e.target.value);
              if (fp) handlePriceSelect(fp);
              else { setPriceFrom(''); setPriceTo(''); }
            }}
            className="custom-select"
          >
            <option value="">{t('hero.priceRange')}</option>
            {filterPrices.map((fp) => <option key={fp.uuid} value={fp.uuid}>{fp.name}</option>)}
          </select>
          <select
            value={selectedSizeUuid}
            onChange={(e) => {
              const fs = filterApartmentSizes.find((s) => s.uuid === e.target.value);
              if (fs) handleSizeSelect(fs);
              else { setApartmentSizeFrom(''); setApartmentSizeTo(''); }
            }}
            className="custom-select"
          >
            <option value="">{t('hero.areaSize')}</option>
            {filterApartmentSizes.map((fs) => <option key={fs.uuid} value={fs.uuid}>{fs.name}</option>)}
          </select>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Listing panel */}
        <div className="lg:w-[45%] overflow-auto p-4 space-y-3 max-h-[calc(100vh-7rem)]">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">{t('mapPage.title')}</h2>
            <span className="text-sm text-muted-foreground">
              ({loading ? '...' : totalCount} {t('search.found')})
            </span>
            {loading && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
          </div>

          {loading && advertisements.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
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

          {!loading && advertisements.length === 0 && (
            <div className="text-center py-16">
              <MapPin size={48} className="mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-lg font-medium text-foreground">{t('search.noResult')}</p>
              <p className="text-sm text-muted-foreground mt-1">{t('search.noResultHint')}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
            {advertisements.map((ad: any, i: number) => (
              <div
                key={ad.uuid}
                onMouseEnter={() => setHoveredId(ad.uuid)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <AdvertisementCard data={ad} index={i} />
              </div>
            ))}
          </div>

          {hasNextPage && (
            <div className="text-center py-4">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-secondary transition-colors text-foreground disabled:opacity-50"
              >
                {isFetchingNextPage ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> {t('search.loading')}
                  </span>
                ) : (
                  t('search.loadMore')
                )}
              </button>
            </div>
          )}
        </div>

        {/* Map panel */}
        <div className="lg:w-[55%] h-[50vh] lg:h-auto lg:sticky lg:top-16">
          <div className="h-full p-4 lg:p-0 lg:pr-4 lg:py-4">
            <MapView
              properties={[]}
              hoveredId={hoveredId}
              onMarkerClick={(id) => navigate(`/property/${id}`)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
