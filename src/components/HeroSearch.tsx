import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import heroImage from '@/assets/hero-illustration.png';
import { DISTRICTS, ROOM_TYPES } from '@/lib/mock-data';

export const HeroSearch = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
              {t('hero.title')}{' '}
              <span className="text-primary">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-lg">
              {t('hero.subtitle')}
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
                <label className="search-field-label">{t('hero.area')}</label>
                <select value={area} onChange={e => setArea(e.target.value)} className="search-field-input">
                  <option value="">{t('hero.allDistricts')}</option>
                  {DISTRICTS.map(d => (<option key={d} value={d}>{d}</option>))}
                </select>
              </div>
              <div className="search-field">
                <label className="search-field-label">{t('hero.roomType')}</label>
                <select value={roomType} onChange={e => setRoomType(e.target.value)} className="search-field-input">
                  <option value="">{t('hero.allTypes')}</option>
                  {ROOM_TYPES.map(t2 => (<option key={t2} value={t2}>{t2}</option>))}
                </select>
              </div>
              <div className="search-field">
                <label className="search-field-label">{t('hero.priceRange')}</label>
                <select value={priceRange} onChange={e => setPriceRange(e.target.value)} className="search-field-input">
                  <option value="">{t('hero.allPrices')}</option>
                  <option value="3000000">{t('hero.under')} 3 {t('hero.million')}</option>
                  <option value="5000000">{t('hero.under')} 5 {t('hero.million')}</option>
                  <option value="8000000">{t('hero.under')} 8 {t('hero.million')}</option>
                  <option value="10000000">{t('hero.under')} 10 {t('hero.million')}</option>
                  <option value="15000000">{t('hero.under')} 15 {t('hero.million')}</option>
                </select>
              </div>
              <div className="search-field">
                <label className="search-field-label">{t('hero.areaSize')}</label>
                <select value={sizeRange} onChange={e => setSizeRange(e.target.value)} className="search-field-input">
                  <option value="">{t('hero.allSizes')}</option>
                  <option value="20">{t('hero.above')} 20m²</option>
                  <option value="30">{t('hero.above')} 30m²</option>
                  <option value="40">{t('hero.above')} 40m²</option>
                  <option value="50">{t('hero.above')} 50m²</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="w-full md:w-auto bg-primary hover:bg-xanh-700 text-primary-foreground px-8 py-4 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Search size={20} />
              <span>{t('hero.searchBtn')}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
