import { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import heroImage from '@/assets/hero-illustration.png';
import { httpRequest } from '@/services/index';
import provinceService, { ProvinceItem } from '@/services/province.service';
import apartmentTypeService, { ApartmentTypeItem } from '@/services/apartmentType.service';
import { filterPrices, filterApartmentSizes, FilterOption } from '@/lib/filter-options';

export const HeroSearch = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [provinceId, setProvinceId] = useState('');
  const [wardId, setWardId] = useState('');
  const [priceUuid, setPriceUuid] = useState('');
  const [sizeUuid, setSizeUuid] = useState('');
  const [apartmentTypeUuid, setApartmentTypeUuid] = useState('');

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
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {/* Khu vực */}
              <div className="search-field">
                <label className="search-field-label">{t('hero.area')}</label>
                <select
                  value={provinceId}
                  onChange={(e) => {
                    setProvinceId(e.target.value);
                    setWardId('');
                  }}
                  className="search-field-input"
                >
                  <option value="">{t('hero.allDistricts')}</option>
                  {provinces.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phường/xã */}
              <div className="search-field">
                <label className="search-field-label">{t('hero.ward')}</label>
                <select
                  value={wardId}
                  onChange={(e) => setWardId(e.target.value)}
                  className="search-field-input"
                  disabled={!provinceId}
                >
                  <option value="">{t('hero.allWards')}</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Loại hình */}
              <div className="search-field">
                <label className="search-field-label">{t('hero.roomType')}</label>
                <select
                  value={apartmentTypeUuid}
                  onChange={(e) => setApartmentTypeUuid(e.target.value)}
                  className="search-field-input"
                >
                  <option value="">{t('hero.allTypes')}</option>
                  {apartmentTypes.map((at) => (
                    <option key={at.uuid} value={at.uuid}>
                      {at.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Khoảng giá */}
              <div className="search-field">
                <label className="search-field-label">{t('hero.priceRange')}</label>
                <select
                  value={priceUuid}
                  onChange={(e) => setPriceUuid(e.target.value)}
                  className="search-field-input"
                >
                  <option value="">{t('hero.allPrices')}</option>
                  {filterPrices.map((fp) => (
                    <option key={fp.uuid} value={fp.uuid}>
                      {fp.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Diện tích */}
              <div className="search-field">
                <label className="search-field-label">{t('hero.areaSize')}</label>
                <select
                  value={sizeUuid}
                  onChange={(e) => setSizeUuid(e.target.value)}
                  className="search-field-input"
                >
                  <option value="">{t('hero.allSizes')}</option>
                  {filterApartmentSizes.map((fs) => (
                    <option key={fs.uuid} value={fs.uuid}>
                      {fs.name}
                    </option>
                  ))}
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
