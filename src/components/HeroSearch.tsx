import { useState } from 'react';
import { Search, MapPin, CircleDollarSign, Maximize, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-illustration.png';
import { DISTRICTS, ROOM_TYPES } from '@/lib/mock-data';

export const HeroSearch = () => {
  const navigate = useNavigate();
  const [area, setArea] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sizeRange, setSizeRange] = useState('');
  const [roomType, setRoomType] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (area) params.set('district', area);
    if (priceRange) params.set('price_max', priceRange);
    if (sizeRange) params.set('size', sizeRange);
    if (roomType) params.set('type', roomType);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-20 md:pb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              Tìm phòng trọ phù hợp{' '}
              <span className="text-primary">trong vài giây</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg">
              Nền tảng tìm phòng thông minh giúp bạn khám phá phòng trọ và căn hộ phù hợp nhanh nhất.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="hidden md:block"
          >
            <img src={heroImage} alt="XanhStay cityscape" className="w-full max-w-md mx-auto" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-4 md:-mt-4 relative z-20"
        >
          <div className="bg-card rounded-2xl shadow-soft border border-border p-2 flex flex-col md:flex-row items-stretch gap-2">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
              <div className="search-field">
                <label className="search-field-label">Khu vực</label>
                <select
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  className="search-field-input"
                >
                  <option value="">Tất cả quận</option>
                  {DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="search-field">
                <label className="search-field-label">Loại phòng</label>
                <select
                  value={roomType}
                  onChange={e => setRoomType(e.target.value)}
                  className="search-field-input"
                >
                  <option value="">Tất cả loại</option>
                  {ROOM_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="search-field">
                <label className="search-field-label">Khoảng giá</label>
                <select
                  value={priceRange}
                  onChange={e => setPriceRange(e.target.value)}
                  className="search-field-input"
                >
                  <option value="">Tất cả giá</option>
                  <option value="3000000">Dưới 3 triệu</option>
                  <option value="5000000">Dưới 5 triệu</option>
                  <option value="8000000">Dưới 8 triệu</option>
                  <option value="10000000">Dưới 10 triệu</option>
                  <option value="15000000">Dưới 15 triệu</option>
                </select>
              </div>
              <div className="search-field">
                <label className="search-field-label">Diện tích</label>
                <select
                  value={sizeRange}
                  onChange={e => setSizeRange(e.target.value)}
                  className="search-field-input"
                >
                  <option value="">Tất cả</option>
                  <option value="20">Trên 20m²</option>
                  <option value="30">Trên 30m²</option>
                  <option value="40">Trên 40m²</option>
                  <option value="50">Trên 50m²</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-primary hover:bg-xanh-700 text-primary-foreground px-8 py-4 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Search size={20} />
              <span>Tìm phòng</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
