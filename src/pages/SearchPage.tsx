import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { FilterBar } from '@/components/FilterBar';
import { AdvertisementCard } from '@/components/AdvertisementCard';
import { PropertyCard } from '@/components/PropertyCard';
import { MapView } from '@/components/MapView';
import { Footer } from '@/components/Footer';
import { mockProperties, filterProperties, DISTRICTS, ROOM_TYPES } from '@/lib/mock-data';
import { getListAdvertisement, AdvertisementData, GetListAdvertisementRequest } from '@/services/roomService';
import { useNavigate } from 'react-router-dom';
import { Search, Map as MapIcon, List, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const PAGE_SIZE = 8;

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);

  // Filter state
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('price_max') || '');
  const [roomType, setRoomType] = useState(searchParams.get('type') || '');
  const [sizeMin, setSizeMin] = useState(searchParams.get('size') || '');
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');

  // API state
  const [advertisements, setAdvertisements] = useState<AdvertisementData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const buildRequest = useCallback(
    (pageNum: number): GetListAdvertisementRequest => {
      const req: GetListAdvertisementRequest = {
        isPaging: 1,
        page: pageNum,
        pageSize: PAGE_SIZE,
      };
      if (keyword) req.keyword = keyword;
      if (district) req.provinceId = district;
      if (priceMax) req.priceTo = Number(priceMax);
      if (sizeMin) req.apartmentSizeFrom = Number(sizeMin);
      if (activeFilters.includes('under3m')) req.priceTo = 3000000;
      if (activeFilters.includes('under5m') && !activeFilters.includes('under3m')) req.priceTo = 5000000;
      if (activeFilters.includes('furnished')) req.keyword = (req.keyword || '') + ' nội thất';
      return req;
    },
    [keyword, district, priceMax, sizeMin, activeFilters]
  );

  const fetchData = useCallback(
    async (pageNum: number, append = false) => {
      setLoading(true);
      setError(null);
      try {
        const res = await getListAdvertisement(buildRequest(pageNum));
        if (res.error.code === 0) {
          setAdvertisements(prev => (append ? [...prev, ...res.data.items] : res.data.items));
          setTotalCount(res.data.pagination.totalCount);
          setTotalPage(res.data.pagination.totalPage);
        } else {
          setError(res.error.message);
        }
      } catch (err) {
        console.error('API Error:', err);
        setError('Không thể kết nối đến máy chủ. Đang hiển thị dữ liệu mẫu.');
        // Fallback to mock data
        setAdvertisements([]);
      } finally {
        setLoading(false);
      }
    },
    [buildRequest]
  );

  // Sync filters to URL query params
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (district) params.set('district', district);
    if (priceMax) params.set('price_max', priceMax);
    if (roomType) params.set('type', roomType);
    if (sizeMin) params.set('size', sizeMin);
    if (activeFilters.length > 0) params.set('filters', activeFilters.join(','));
    setSearchParams(params, { replace: true });
  }, [keyword, district, priceMax, roomType, sizeMin, activeFilters, setSearchParams]);

  // Fetch on filter changes
  useEffect(() => {
    setPage(1);
    fetchData(1);
  }, [district, priceMax, roomType, sizeMin, activeFilters, keyword]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage, true);
  };

  // Fallback: filter mock data when API fails
  const mockFiltered = (() => {
    let results = filterProperties({
      district: district || undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      type: roomType || undefined,
      size: sizeMin ? Number(sizeMin) : undefined,
    });
    if (activeFilters.includes('under3m')) results = results.filter(p => p.price < 3000000);
    if (activeFilters.includes('under5m')) results = results.filter(p => p.price < 5000000);
    if (activeFilters.includes('furnished')) results = results.filter(p => p.furnished);
    if (activeFilters.includes('studio')) results = results.filter(p => p.type === 'Studio');
    if (activeFilters.includes('balcony')) results = results.filter(p => p.hasBalcony);
    if (activeFilters.includes('apartment')) results = results.filter(p => p.type === 'Căn hộ');
    if (activeFilters.includes('room')) results = results.filter(p => p.type === 'Phòng trọ');
    return results;
  })();

  const hasApiData = advertisements.length > 0;
  const displayCount = hasApiData ? totalCount : mockFiltered.length;

  const toggleFilter = (key: string) => {
    setActiveFilters(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Search bar */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Từ khóa</label>
              <input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Tìm theo tên, địa chỉ..."
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Khu vực</label>
              <select value={district} onChange={e => setDistrict(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm">
                <option value="">Tất cả</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Loại phòng</label>
              <select value={roomType} onChange={e => setRoomType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm">
                <option value="">Tất cả</option>
                {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Giá tối đa</label>
              <select value={priceMax} onChange={e => setPriceMax(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm">
                <option value="">Không giới hạn</option>
                <option value="3000000">3 triệu</option>
                <option value="5000000">5 triệu</option>
                <option value="8000000">8 triệu</option>
                <option value="10000000">10 triệu</option>
                <option value="15000000">15 triệu</option>
              </select>
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Diện tích</label>
              <select value={sizeMin} onChange={e => setSizeMin(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm">
                <option value="">Tất cả</option>
                <option value="20">≥ 20m²</option>
                <option value="30">≥ 30m²</option>
                <option value="40">≥ 40m²</option>
                <option value="50">≥ 50m²</option>
              </select>
            </div>
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-sm font-medium hover:bg-secondary transition-colors flex items-center gap-2 text-foreground"
            >
              {showMap ? <List size={16} /> : <MapIcon size={16} />}
              {showMap ? 'Danh sách' : 'Bản đồ'}
            </button>
          </div>
          <div className="mt-3">
            <FilterBar activeFilters={activeFilters} onToggle={toggleFilter} />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 mb-4">
            <p className="text-sm text-muted-foreground">
              {displayCount} phòng được tìm thấy
            </p>
            {loading && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 text-destructive text-sm border border-destructive/20">
              {error}
            </div>
          )}

          <div className={`flex gap-6`}>
            <div className={showMap ? 'w-full lg:w-3/5' : 'w-full'}>
              {/* Loading skeleton */}
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

              {/* API data cards */}
              {hasApiData && (
                <div className={`grid ${showMap ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                  {advertisements.map((ad, i) => (
                    <div
                      key={ad.uuid}
                      onMouseEnter={() => setHoveredId(ad.uuid)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <AdvertisementCard data={ad} index={i} />
                    </div>
                  ))}
                </div>
              )}

              {/* Fallback mock data */}
              {!hasApiData && !loading && (
                <div className={`grid ${showMap ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                  {mockFiltered.slice(0, PAGE_SIZE * page).map((p, i) => (
                    <div
                      key={p.id}
                      onMouseEnter={() => setHoveredId(p.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <PropertyCard data={p} index={i} />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && displayCount === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <Search size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Không tìm thấy phòng phù hợp</p>
                  <p className="text-sm mt-1">Hãy thử thay đổi bộ lọc</p>
                </div>
              )}

              {/* Load more */}
              {hasApiData && page < totalPage && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-secondary transition-colors text-foreground disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" /> Đang tải...
                      </span>
                    ) : (
                      `Xem thêm (${totalCount - advertisements.length} phòng)`
                    )}
                  </button>
                </div>
              )}

              {/* Mock fallback load more */}
              {!hasApiData && !loading && PAGE_SIZE * page < mockFiltered.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-6 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-secondary transition-colors text-foreground"
                  >
                    Xem thêm ({mockFiltered.length - PAGE_SIZE * page} phòng)
                  </button>
                </div>
              )}
            </div>

            {showMap && (
              <div className="hidden lg:block w-2/5">
                <div className="sticky top-20 h-[calc(100vh-8rem)]">
                  <MapView
                    properties={hasApiData ? [] : mockFiltered}
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
