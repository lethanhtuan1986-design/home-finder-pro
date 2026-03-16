import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { FilterBar } from '@/components/FilterBar';
import { PropertyCard } from '@/components/PropertyCard';
import { MapView } from '@/components/MapView';
import { Footer } from '@/components/Footer';
import { mockProperties, filterProperties, DISTRICTS, ROOM_TYPES } from '@/lib/mock-data';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Map as MapIcon, List } from 'lucide-react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('price_max') || '');
  const [roomType, setRoomType] = useState(searchParams.get('type') || '');
  const [sizeMin, setSizeMin] = useState(searchParams.get('size') || '');

  const filtered = useMemo(() => {
    let results = filterProperties({
      district: district || undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
      type: roomType || undefined,
      size: sizeMin ? Number(sizeMin) : undefined,
    });

    // Apply chip filters
    if (activeFilters.includes('under3m')) results = results.filter(p => p.price < 3000000);
    if (activeFilters.includes('under5m')) results = results.filter(p => p.price < 5000000);
    if (activeFilters.includes('furnished')) results = results.filter(p => p.furnished);
    if (activeFilters.includes('studio')) results = results.filter(p => p.type === 'Studio');
    if (activeFilters.includes('balcony')) results = results.filter(p => p.hasBalcony);
    if (activeFilters.includes('apartment')) results = results.filter(p => p.type === 'Căn hộ');
    if (activeFilters.includes('room')) results = results.filter(p => p.type === 'Phòng trọ');

    return results;
  }, [district, priceMax, roomType, sizeMin, activeFilters]);

  const visibleProperties = filtered.slice(0, visibleCount);

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
          <p className="text-sm text-muted-foreground mb-4">{filtered.length} phòng được tìm thấy</p>

          <div className={`flex gap-6 ${showMap ? '' : ''}`}>
            <div className={showMap ? 'w-full lg:w-3/5' : 'w-full'}>
              <div className={`grid ${showMap ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                {visibleProperties.map((p, i) => (
                  <div
                    key={p.id}
                    onMouseEnter={() => setHoveredId(p.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <PropertyCard data={p} index={i} />
                  </div>
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <Search size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Không tìm thấy phòng phù hợp</p>
                  <p className="text-sm mt-1">Hãy thử thay đổi bộ lọc</p>
                </div>
              )}
              {visibleCount < filtered.length && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setVisibleCount(v => v + 8)}
                    className="px-6 py-2.5 rounded-xl border border-border bg-card text-sm font-medium hover:bg-secondary transition-colors text-foreground"
                  >
                    Xem thêm ({filtered.length - visibleCount} phòng)
                  </button>
                </div>
              )}
            </div>

            {showMap && (
              <div className="hidden lg:block w-2/5">
                <div className="sticky top-20 h-[calc(100vh-8rem)]">
                  <MapView
                    properties={filtered}
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
