import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import heroImage from '@/assets/hero-illustration.png';
import { httpRequest } from '@/services/index';
import provinceService, { ProvinceItem } from '@/services/province.service';
import apartmentTypeService, { ApartmentTypeItem } from '@/services/apartmentType.service';
import { filterPrices, filterApartmentSizes } from '@/lib/filter-options';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const HeroSearch = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [provinceId, setProvinceId] = useState('');
  const [wardId, setWardId] = useState('');
  const [priceUuid, setPriceUuid] = useState('');
  const [sizeUuid, setSizeUuid] = useState('');
  const [apartmentTypeUuid, setApartmentTypeUuid] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data: provinces = [] } = useQuery<ProvinceItem[]>({
    queryKey: ['dropdown-province'],
    queryFn: () => httpRequest({ http: provinceService.listProvince({ keyword: '' }) }),
  });

  const { data: wards = [], isLoading: wardsLoading } = useQuery<{ code: string; fullName: string; fullNameEn: string }[]>({
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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (provinceId) params.set('provinceId', provinceId);
    if (wardId) params.set('wardId', wardId);
    if (apartmentTypeUuid) params.set('apartmentTypeUuid', apartmentTypeUuid);

    const selectedPrice = filterPrices.find((p) => p.uuid === priceUuid);
    if (selectedPrice) {
      if (selectedPrice.value) params.set('priceFrom', String(selectedPrice.value));
      if (selectedPrice.valueTo) params.set('priceTo', String(selectedPrice.valueTo));
    }

    const selectedSize = filterApartmentSizes.find((s) => s.uuid === sizeUuid);
    if (selectedSize) {
      if (selectedSize.value) params.set('apartmentSizeFrom', String(selectedSize.value));
      if (selectedSize.valueTo) params.set('apartmentSizeTo', String(selectedSize.valueTo));
    }

    navigate(`/search?${params.toString()}`);
  };

  const advancedFilterCount = [wardId, sizeUuid].filter(Boolean).length;

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
          <div className="bg-card rounded-2xl shadow-soft border border-border p-3 sm:p-4">
            {/* Main filters row: 3 core filters + advanced toggle + search */}
            <div className="flex flex-col md:flex-row items-stretch gap-2">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Khu vực */}
                <div className="search-field">
                  <label className="search-field-label">{t('hero.area')}</label>
                  <Select
                    value={provinceId}
                    onValueChange={(val) => { setProvinceId(val === '__all__' ? '' : val); setWardId(''); }}
                  >
                    <SelectTrigger className="search-field-select-trigger">
                      <SelectValue placeholder={t('hero.allDistricts')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">{t('hero.allDistricts')}</SelectItem>
                      {provinces.map((p) => (
                        <SelectItem key={p.code} value={p.code}>{p.fullName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Loại hình */}
                <div className="search-field">
                  <label className="search-field-label">{t('hero.roomType')}</label>
                  <Select
                    value={apartmentTypeUuid}
                    onValueChange={(val) => setApartmentTypeUuid(val === '__all__' ? '' : val)}
                  >
                    <SelectTrigger className="search-field-select-trigger">
                      <SelectValue placeholder={t('hero.allTypes')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">{t('hero.allTypes')}</SelectItem>
                      {apartmentTypes.map((at) => (
                        <SelectItem key={at.uuid} value={at.uuid}>{at.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Khoảng giá */}
                <div className="search-field">
                  <label className="search-field-label">{t('hero.priceRange')}</label>
                  <Select
                    value={priceUuid}
                    onValueChange={(val) => setPriceUuid(val === '__all__' ? '' : val)}
                  >
                    <SelectTrigger className="search-field-select-trigger">
                      <SelectValue placeholder={t('hero.allPrices')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__all__">{t('hero.allPrices')}</SelectItem>
                      {filterPrices.map((fp) => (
                        <SelectItem key={fp.uuid} value={fp.uuid}>{fp.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                {/* Advanced filters toggle */}
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                    showAdvanced
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                  }`}
                >
                  <SlidersHorizontal size={18} />
                  <span className="hidden sm:inline">{t('hero.advancedFilters')}</span>
                  {advancedFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {advancedFilterCount}
                    </span>
                  )}
                </button>

                {/* Search button */}
                <button
                  onClick={handleSearch}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Search size={20} />
                  <span>{t('hero.searchBtn')}</span>
                </button>
              </div>
            </div>

            {/* Advanced filters panel */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 mt-3 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('hero.advancedFilters')}</span>
                      <button
                        onClick={() => setShowAdvanced(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Phường/xã */}
                      <div className="search-field">
                        <label className="search-field-label">{t('hero.ward')}</label>
                        <Select
                          value={wardId}
                          onValueChange={(val) => setWardId(val === '__all__' ? '' : val)}
                          disabled={!provinceId || (wardsLoading && wards.length === 0)}
                        >
                          <SelectTrigger className="search-field-select-trigger">
                            <SelectValue placeholder={!provinceId ? t('hero.selectAreaFirst') : wardsLoading ? t('search.loading') : t('hero.allWards')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__all__">{t('hero.allWards')}</SelectItem>
                            {wards.map((w) => (
                              <SelectItem key={w.code} value={w.code}>{w.fullName}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Diện tích */}
                      <div className="search-field">
                        <label className="search-field-label">{t('hero.areaSize')}</label>
                        <Select
                          value={sizeUuid}
                          onValueChange={(val) => setSizeUuid(val === '__all__' ? '' : val)}
                        >
                          <SelectTrigger className="search-field-select-trigger">
                            <SelectValue placeholder={t('hero.allSizes')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__all__">{t('hero.allSizes')}</SelectItem>
                            {filterApartmentSizes.map((fs) => (
                              <SelectItem key={fs.uuid} value={fs.uuid}>{fs.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
