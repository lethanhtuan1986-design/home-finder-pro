import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { SEO } from '@/components/SEO';
import { Navbar } from '@/components/Navbar';
import { AdvertisementCard } from '@/components/AdvertisementCard';
import { PropertyCard } from '@/components/PropertyCard';
import { MapView } from '@/components/MapView';
import { Footer } from '@/components/Footer';
import { mockProperties, filterProperties } from '@/lib/mock-data';
import { filterPrices, filterApartmentSizes, FilterOption } from '@/lib/filter-options';
import advertisementService, { GetListAdvertisementRequest } from '@/services/advertisement.service';
import provinceService, { ProvinceItem } from '@/services/province.service';
import apartmentTypeService, { ApartmentTypeItem } from '@/services/apartmentType.service';
import { httpRequest } from '@/services/index';
import { useTranslation } from 'react-i18next';
import { Search, Map as MapIcon, List, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 8;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [mockPage, setMockPage] = useState(1);

  // Filter states from URL
  const [provinceId, setProvinceId] = useState(searchParams.get('provinceId') || '');
  const [wardId, setWardId] = useState(searchParams.get('wardId') || '');
  const [apartmentTypeUuid, setApartmentTypeUuid] = useState(searchParams.get('apartmentTypeUuid') || '');
  const [priceFrom, setPriceFrom] = useState(searchParams.get('priceFrom') || '');
  const [priceTo, setPriceTo] = useState(searchParams.get('priceTo') || '');
  const [apartmentSizeFrom, setApartmentSizeFrom] = useState(searchParams.get('apartmentSizeFrom') || '');
  const [apartmentSizeTo, setApartmentSizeTo] = useState(searchParams.get('apartmentSizeTo') || '');
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');

  // Derive selected price/size uuid from URL params
  const selectedPriceUuid = filterPrices.find(
    (fp) =>
      String(fp.value || '') === priceFrom && String(fp.valueTo || '') === priceTo
  )?.uuid || '';

  const selectedSizeUuid = filterApartmentSizes.find(
    (fs) =>
      String(fs.value || '') === apartmentSizeFrom && String(fs.valueTo || '') === apartmentSizeTo
  )?.uuid || '';

  // API data: provinces, wards, apartment types
  const { data: provinces = [] } = useQuery<ProvinceItem[]>({
    queryKey: ['dropdown-province'],
    queryFn: () =>
      httpRequest({
        http: provinceService.listProvince({ keyword: '' }),
      }),
  });

  const { data: wards = [] } = useQuery<{ code: string; fullName: string; fullNameEn: string }[]>({
    queryKey: ['dropdown-ward', provinceId],
    queryFn: () =>
      httpRequest({
        http: provinceService.listWard({ keyword: '', provinceCode: provinceId }),
      }),
    enabled: !!provinceId,
  });

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

  // Build API request
  const buildRequest = (pageNum: number): GetListAdvertisementRequest => {
    const req: GetListAdvertisementRequest = {
      isPaging: 1,
      page: pageNum,
      pageSize: PAGE_SIZE,
    };
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
    error: queryError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['advertisements', keyword, provinceId, wardId, apartmentTypeUuid, priceFrom, priceTo, apartmentSizeFrom, apartmentSizeTo],
    queryFn: ({ pageParam = 1 }) =>
      httpRequest({
        http: advertisementService.getListPaged(buildRequest(pageParam as number)),
      }),
    getNextPageParam: (lastPage: any, allPages) => {
      if (!lastPage?.pagination) return undefined;
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.pagination.totalPage ? nextPage : undefined;
    },
    initialPageParam: 1,
  });

  const advertisements = useMemo(
    () => infiniteData?.pages.flatMap((p: any) => p?.items || []) ?? [],
    [infiniteData]
  );
  const totalCount = infiniteData?.pages[0]?.pagination?.totalCount ?? 0;
  const error = queryError ? t('search.serverError') : null;

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (provinceId) params.set('provinceId', provinceId);
    if (wardId) params.set('wardId', wardId);
    if (apartmentTypeUuid) params.set('apartmentTypeUuid', apartmentTypeUuid);
    if (priceFrom) params.set('priceFrom', priceFrom);
    if (priceTo) params.set('priceTo', priceTo);
    if (apartmentSizeFrom) params.set('apartmentSizeFrom', apartmentSizeFrom);
    if (apartmentSizeTo) params.set('apartmentSizeTo', apartmentSizeTo);
    setSearchParams(params, { replace: true });
  }, [keyword, provinceId, wardId, apartmentTypeUuid, priceFrom, priceTo, apartmentSizeFrom, apartmentSizeTo, setSearchParams]);

  const handlePriceSelect = (fp: FilterOption) => {
    if (selectedPriceUuid === fp.uuid) {
      setPriceFrom('');
      setPriceTo('');
    } else {
      setPriceFrom(fp.value ? String(fp.value) : '');
      setPriceTo(fp.valueTo ? String(fp.valueTo) : '');
    }
  };

  const handleSizeSelect = (fs: FilterOption) => {
    if (selectedSizeUuid === fs.uuid) {
      setApartmentSizeFrom('');
      setApartmentSizeTo('');
    } else {
      setApartmentSizeFrom(fs.value ? String(fs.value) : '');
      setApartmentSizeTo(fs.valueTo ? String(fs.valueTo) : '');
    }
  };

  const hasApiData = advertisements.length > 0;
  const displayCount = hasApiData ? totalCount : mockProperties.length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title={t('search.title')} description={t('search.desc')} />
      <Navbar />

      {/* Filters panel */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          {/* Top row: keyword + dropdowns */}
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('search.keyword')}</label>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t('search.keywordPlaceholder')}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('search.area')}</label>
              <select
                value={provinceId}
                onChange={(e) => {
                  setProvinceId(e.target.value);
                  setWardId('');
                }}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
              >
                <option value="">{t('search.all')}</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>{p.fullName}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">{t('hero.ward')}</label>
              <select
                value={wardId}
                onChange={(e) => setWardId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
                disabled={!provinceId}
              >
                <option value="">{t('search.all')}</option>
                {wards.map((w) => (
                  <option key={w.code} value={w.code}>{w.fullName}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-2 text-foreground"
            >
              {showMap ? <List size={16} /> : <MapIcon size={16} />}
              {showMap ? t('search.list') : t('search.map')}
            </button>
          </div>

          {/* Apartment types */}
          {apartmentTypes.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">{t('hero.roomType')}</p>
              <div className="flex gap-2 flex-wrap">
                {apartmentTypes.map((at) => (
                  <button
                    key={at.uuid}
                    onClick={() => setApartmentTypeUuid((prev) => (prev === at.uuid ? '' : at.uuid))}
                    className={cn(
                      'px-3 py-1.5 rounded-lg border text-sm transition-colors',
                      apartmentTypeUuid === at.uuid
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border bg-background text-foreground hover:bg-secondary'
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
            <p className="text-xs font-medium text-muted-foreground mb-2">{t('hero.priceRange')}</p>
            <div className="flex gap-2 flex-wrap">
              {filterPrices.map((fp) => (
                <button
                  key={fp.uuid}
                  onClick={() => handlePriceSelect(fp)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg border text-sm transition-colors',
                    selectedPriceUuid === fp.uuid
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border bg-background text-foreground hover:bg-secondary'
                  )}
                >
                  {fp.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size filters */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">{t('hero.areaSize')}</p>
            <div className="flex gap-2 flex-wrap">
              {filterApartmentSizes.map((fs) => (
                <button
                  key={fs.uuid}
                  onClick={() => handleSizeSelect(fs)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg border text-sm transition-colors',
                    selectedSizeUuid === fs.uuid
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border bg-background text-foreground hover:bg-secondary'
                  )}
                >
                  {fs.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 mb-4">
            <p className="text-sm text-muted-foreground">
              {displayCount} {t('search.found')}
            </p>
            {loading && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <div className="flex gap-6">
            <div className={showMap ? 'w-full lg:w-3/5' : 'w-full'}>
              {loading && advertisements.length === 0 && (
                <div className={`grid ${showMap ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
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

              {hasApiData && (
                <div className={`grid ${showMap ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                  {advertisements.map((ad: any, i: number) => (
                    <div key={ad.uuid} onMouseEnter={() => setHoveredId(ad.uuid)} onMouseLeave={() => setHoveredId(null)}>
                      <AdvertisementCard data={ad} index={i} />
                    </div>
                  ))}
                </div>
              )}

              {!hasApiData && !loading && (
                <div className={`grid ${showMap ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                  {mockProperties.slice(0, PAGE_SIZE * mockPage).map((p, i) => (
                    <div key={p.id} onMouseEnter={() => setHoveredId(p.id)} onMouseLeave={() => setHoveredId(null)}>
                      <PropertyCard data={p} index={i} />
                    </div>
                  ))}
                </div>
              )}

              {!loading && displayCount === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <Search size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">{t('search.noResult')}</p>
                  <p className="text-sm mt-1">{t('search.noResultHint')}</p>
                </div>
              )}

              {hasApiData && hasNextPage && (
                <div className="text-center mt-8">
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
                      `${t('search.loadMore')} (${totalCount - advertisements.length} ${t('search.found')})`
                    )}
                  </button>
                </div>
              )}

              {!hasApiData && !loading && PAGE_SIZE * mockPage < mockProperties.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setMockPage((p) => p + 1)}
                    className="px-6 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-secondary transition-colors text-foreground"
                  >
                    {t('search.loadMore')}
                  </button>
                </div>
              )}
            </div>

            {showMap && (
              <div className="hidden lg:block w-2/5">
                <div className="sticky top-20 h-[calc(100vh-8rem)]">
                  <MapView
                    properties={hasApiData ? [] : mockProperties}
                    hoveredId={hoveredId}
                    onMarkerClick={(id) => navigate(`/property/${id}`)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchPage;
